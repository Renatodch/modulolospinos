"use client";
import { saveUserCourse } from "@/controllers/user-course.controller";
import { getDateString } from "@/lib/date-lib";
import {
  isUserCourseCompleted,
  isUserCourseInProgress,
  isUserCourseNotInit,
  isUserCourseReproved,
} from "@/lib/utils";
import {
  IN_PROGRESS,
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
import { useState } from "react";
import { toast } from "sonner";
import CourseProgressDetail from "./courseProgressDetail";
import ScoreReport from "./scoreReport";

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

  const progress = user_course?.progress!;
  const totalSubjects = subjects.length;
  const part = 100 / totalSubjects;
  const value = isUserCourseCompleted(user_course) ? 100 : part * progress;

  const progressPercent = Math.round(value);
  const subjectsCompleted = isUserCourseCompleted(user_course)
    ? `${progress + 1}/${progress + 1}`
    : `${progress}/${totalSubjects}`;

  const handleStartCourseClick = async () => {
    if (!user_course) {
      toast.error(TOAST_COURSE_START_FAILED);
      return;
    }
    if (isUserCourseInProgress(user_course)) {
      toast.error("Usted ya inició el curso");
      return;
    }
    setClicked(true);

    toast.promise(
      new Promise((resolve, reject) => {
        saveUserCourse({
          ...user_course,
          date_start: new Date(),
          date_update: new Date(),
          state: IN_PROGRESS,
          progress: 0,
        })
          .then(resolve)
          .catch(reject);
      }),
      {
        loading: "Iniciando...",
        success: () => TOAST_COURSE_START_SUCCESS,
        error: () => TOAST_COURSE_START_FAILED,
        finally: () => {
          onStart();
          setClicked(false);
          router.refresh();
        },
      }
    );
  };
  return (
    <>
      <div className="flex flex-col h-full">
        <p className="font-bold text-lg mb-4 flex justify-between">
          Progreso del curso{" "}
          <CourseProgressDetail
            user_course={user_course}
            tasksDetail={tasksDetail}
            subjects={subjects}
          />
        </p>
        <p className="flex justify-between mb-4 flex-col">
          <span>{subjectsCompleted}</span>
          <span>{progressPercent}% Completado</span>
        </p>
        <Slider
          color={
            isUserCourseInProgress(user_course)
              ? "green"
              : isUserCourseReproved(user_course)
              ? "red"
              : "blue"
          }
          value={[progressPercent]}
          className="mb-8"
        />

        {isUserCourseInProgress(user_course) && (
          <Button size="3" style={{ backgroundColor: PRIMARY_COLOR }}>
            <Link href="/curso/clases" target="_blank">
              Continuar el aprendizaje
            </Link>
          </Button>
        )}
        {isUserCourseNotInit(user_course) && (
          <Button
            size="3"
            disabled={clicked}
            style={{ backgroundColor: PRIMARY_COLOR }}
            onClick={handleStartCourseClick}
          >
            Empezar el aprendizaje
          </Button>
        )}
        {isUserCourseCompleted(user_course) && (
          <Button
            size="3"
            disabled
            style={{ backgroundColor: PRIMARY_COLOR }}
            onClick={handleStartCourseClick}
          >
            Curso finalizado
          </Button>
        )}

        {user_course?.date_start && (
          <span className="italic text-sm mt-2">
            Empezó el día {getDateString(user_course?.date_start)}
          </span>
        )}
        {!isUserCourseNotInit(user_course) && (
          <div className="flex w-full gap-4 my-2 justify-end items-center">
            <strong>Reporte de Notas</strong>
            <ScoreReport
              user={user}
              tasksDetail={tasksDetail}
              subjects={subjects}
              notInit={isUserCourseNotInit(user_course)}
              progress={user_course?.progress!}
              avgFinalSaved={user_course?.average}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default CourseDetail;
