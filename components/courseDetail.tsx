"use client";
import { saveUserCourse } from "@/controllers/user-course.controller";
import { getDateString } from "@/lib/date-lib";
import {
  getScoreListSummary,
  isUserCourseCompleted,
  isUserCourseInProgress,
  isUserCourseNotInit,
  isUserCourseReproved,
} from "@/lib/utils";
import {
  IN_PROGRESS,
  PRIMARY_COLOR,
  Score,
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
import ScoreHistory from "./scoreHistory";
import ScoreReport from "./scoreReport";

const CourseDetail = ({
  tasksDetail,
  subjects,
  scores,
  user,
  onStart,
  user_course,
}: {
  tasksDetail: TaskActivityDetail[];
  subjects: Subject[];
  scores: Score[];
  user: User;
  onStart: () => void;
  user_course: User_Course;
}) => {
  const router = useRouter();
  const [clicked, setClicked] = useState(false);

  const completed = isUserCourseCompleted(user_course);
  const inprogress = isUserCourseInProgress(user_course);
  const notinit = isUserCourseNotInit(user_course);
  const reproved = isUserCourseReproved(user_course);
  const subjectsLen = subjects.length;

  const _scoreListSummary: Score[] = completed
    ? getScoreListSummary(scores)
    : [];

  let progress = completed
    ? _scoreListSummary.length
    : inprogress && user_course.progress >= subjectsLen
    ? subjectsLen - 1
    : user_course.progress;

  const totalSubjects = completed ? progress : subjectsLen;
  const part = 100 / totalSubjects;
  const progressPercent = Math.round(part * progress);
  const subjectsCompleted = `${progress}/${totalSubjects}`;

  const handleStartCourseClick = async () => {
    if (!user_course) {
      toast.error(TOAST_COURSE_START_FAILED);
      return;
    }
    if (inprogress) {
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
          color={inprogress ? "green" : reproved ? "red" : "blue"}
          value={[progressPercent]}
          className="mb-8"
        />

        {inprogress && (
          <Button size="3" style={{ backgroundColor: PRIMARY_COLOR }}>
            <Link href="/curso/clases" target="_blank">
              Continuar el aprendizaje
            </Link>
          </Button>
        )}
        {notinit && (
          <Button
            size="3"
            disabled={clicked}
            style={{ backgroundColor: PRIMARY_COLOR }}
            onClick={handleStartCourseClick}
          >
            Empezar el aprendizaje
          </Button>
        )}
        {completed && (
          <Button
            size="3"
            disabled
            style={{ backgroundColor: PRIMARY_COLOR }}
            onClick={handleStartCourseClick}
          >
            Curso finalizado
          </Button>
        )}

        {user_course.date_start && (
          <span className="italic text-sm mt-2">
            Empezó el día {getDateString(user_course.date_start)}
          </span>
        )}
        {user_course.date_end && (
          <span className="italic text-sm mt-2">
            Curso finalizado con promedio final registrado el día{" "}
            {getDateString(user_course.date_end)}
          </span>
        )}
        <div className="flex w-full gap-4 my-2 justify-end items-center">
          {!notinit && <strong>Reporte de Notas</strong>}
          {completed && <ScoreHistory user={user} />}
          {inprogress && <ScoreReport user={user} />}
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
