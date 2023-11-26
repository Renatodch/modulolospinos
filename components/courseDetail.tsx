"use client";
import { saveUserCourse } from "@/controllers/user-course.controller";
import { getDateString } from "@/lib/date-lib";
import {
  APPROVED,
  IN_PROGRESS,
  NOT_INIT,
  PRIMARY_COLOR,
  Subject,
  TOAST_COURSE_START_FAILED,
  TOAST_COURSE_START_SUCCESS,
  TaskActivityDetail,
  User,
  User_Course,
} from "@/model/types";
import { Button, Slider } from "@radix-ui/themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CourseProgressDetail from "./courseProgressDetail";
import NotesReport from "./notesReport";

const CourseDetail = ({
  tasksDetail,
  subjects,
  user,
  onStart,
  user_course,
}: {
  tasksDetail: TaskActivityDetail[];
  subjects: Subject[];
  user: User;
  onStart: () => void;
  user_course: User_Course | null | undefined;
}) => {
  const router = useRouter();
  const [clicked, setClicked] = useState(false);
  const [uc, setUc] = useState<User_Course | undefined | null>(undefined);

  const [ste, setSte] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  useEffect(() => {
    const update = async () => {
      setUc(user_course);
      setSte(user_course?.state!);
      setProgress(user_course?.progress!);
      const totalSubjects = subjects.length;
      const part = 100 / totalSubjects;
      const value =
        part * (user_course?.progress! + +(user_course?.state === APPROVED));
      setProgressPercent(value);
    };
    update();
  }, [user_course, subjects]);

  const handleStartCourseClick = async () => {
    if (!uc) {
      toast.error(TOAST_COURSE_START_FAILED);
      return;
    }
    if (uc?.state! > NOT_INIT) {
      toast.error("Usted ya inició el curso");
      return;
    }
    setClicked(true);
    toast.loading("Iniciando...");
    let userCourse;
    try {
      userCourse = await saveUserCourse({
        ...uc,
        date_start: new Date(),
        date_update: new Date(),
        state: IN_PROGRESS,
        progress: 0,
      });
      toast.dismiss();
      userCourse
        ? toast.success(TOAST_COURSE_START_SUCCESS)
        : toast.error(TOAST_COURSE_START_FAILED);
    } catch (e) {
      toast.dismiss();
      toast.error(TOAST_COURSE_START_FAILED);
    }
    setUc(userCourse);
    router.refresh();
    onStart();
    setClicked(false);
  };
  return (
    <>
      <div className="flex flex-col h-full">
        <p className="font-bold text-lg mb-4 flex justify-between">
          Progreso del curso{" "}
          <CourseProgressDetail
            user_course={uc}
            tasksDetail={tasksDetail}
            subjects={subjects}
          />
        </p>
        <p className="flex justify-between mb-4 flex-col">
          <span>{progress + +(ste === APPROVED)}/5</span>
          <span>{progressPercent}% Completado</span>
        </p>
        <Slider
          color={ste === 1 ? "green" : ste === 2 ? "red" : "blue"}
          value={[progressPercent]}
          className="mb-8"
        />

        {ste === IN_PROGRESS && (
          <Button
            size="3"
            disabled={Boolean(uc && ste > IN_PROGRESS)}
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            <Link href="/curso/clases" target="_blank">
              Continuar el aprendizaje
            </Link>
          </Button>
        )}
        {(ste === NOT_INIT || ste > IN_PROGRESS) && (
          <Button
            size="3"
            disabled={Boolean((uc && ste > IN_PROGRESS) || clicked)}
            style={{ backgroundColor: PRIMARY_COLOR }}
            onClick={handleStartCourseClick}
          >
            Empezar el aprendizaje
          </Button>
        )}

        {uc?.date_start && (
          <span className="italic text-sm mt-2">
            Empezó el día {getDateString(uc?.date_start)}
          </span>
        )}
        {ste > NOT_INIT && (
          <div className="flex w-full gap-4 my-2 justify-end items-center">
            <strong>Reporte de Notas</strong>
            <NotesReport user={user} user_course={uc} />
          </div>
        )}
      </div>
    </>
  );
};

export default CourseDetail;
