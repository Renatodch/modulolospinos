"use client";
import {
  isUserCourseCompleted,
  isUserCourseInProgress,
  isUserCourseNotInit,
} from "@/lib/utils";
import {
  APPROVED,
  PRIMARY_COLOR,
  REPROVED,
  Subject,
  TaskActivityDetail,
  User_Course,
} from "@/model/types";
import { Button, Dialog, Flex, IconButton } from "@radix-ui/themes";
import { useState } from "react";
import { BiHappyAlt } from "react-icons/bi";
import { FaCheck, FaSadCry } from "react-icons/fa";
import { FcInspection } from "react-icons/fc";
import { FiClock } from "react-icons/fi";
import { GoAlertFill } from "react-icons/go";
import { GrInProgress } from "react-icons/gr";
const CourseProgressDetail = ({
  user_course,
  tasksDetail,
  subjects,
}: {
  user_course: User_Course;
  tasksDetail: TaskActivityDetail[];
  subjects: Subject[];
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const notinit = isUserCourseNotInit(user_course);
  const inprogress = isUserCourseInProgress(user_course);
  const endcourse = isUserCourseCompleted(user_course);
  const courseLastItemIndex = subjects.length - 1;
  const totalActivities = tasksDetail.length;
  const state = user_course.state!;
  const progress =
    user_course.progress > courseLastItemIndex
      ? courseLastItemIndex
      : user_course.progress!;
  const currentSubjectTitle = subjects.find(
    (_, index) => index === progress
  )?.title;
  const currentTasksDetail = tasksDetail.filter(
    (t) => t.value_subject <= progress
  );

  const noActivity =
    (currentTasksDetail.length === 0 ||
      currentTasksDetail.every((t) => t.done)) &&
    inprogress;
  const pendingTask = currentTasksDetail.some((t) => !t.done) && inprogress;
  const pendingEvaluateTask =
    currentTasksDetail.some((t) => t.done && !t.evaluated) && inprogress;
  const done =
    currentTasksDetail.filter((t) => t.evaluated).length === totalActivities &&
    inprogress &&
    progress === courseLastItemIndex;
  const evaluatedTask =
    currentTasksDetail.some((t) => t.evaluated) && inprogress;

  const tasksDone = currentTasksDetail.filter((t) => t.done && !t.evaluated);
  const tasksEvaluated = currentTasksDetail.filter(
    (t) => t.done && t.evaluated
  );
  const tasksPending = currentTasksDetail.filter((t) => !t.done);
  const handleClick = () => setOpen(!open);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton
          title="click para ver mas detalles"
          style={{ backgroundColor: PRIMARY_COLOR }}
          onClick={handleClick}
          radius="full"
        >
          <FcInspection />
        </IconButton>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Detalles de su progreso</Dialog.Title>
        <div>
          {notinit && (
            <div className="italic flex items-center gap-2">
              <FiClock className=" text-xl" />
              Usted aun no ha iniciado el curso!
            </div>
          )}
          {inprogress && (
            <div>
              Tema actual: &nbsp;
              <strong>
                {progress + 1}.&nbsp;
                {currentSubjectTitle}
              </strong>
            </div>
          )}
          {noActivity && <div className="mt-4">No hay tareas pendientes</div>}

          {inprogress &&
            (pendingTask || pendingEvaluateTask || evaluatedTask || done) && (
              <>
                {pendingTask && (
                  <div className="italic flex items-center gap-2 text-orange-500 border-t-2 mt-4 pt-2">
                    <GoAlertFill style={{ width: 50 }} />
                    {tasksPending.length > 1
                      ? `Tiene ${tasksPending.length} tareas pendientes`
                      : `Tiene ${tasksPending.length} tarea pendiente`}
                  </div>
                )}
                {pendingEvaluateTask && (
                  <div className="italic flex items-center gap-2 text-gray-700 mt-4 pt-2">
                    <GrInProgress style={{ width: 50 }} />
                    {tasksDone.length > 1
                      ? `Tiene ${tasksDone.length} tareas subidas que aun no han sido evaluadas`
                      : `Tiene ${tasksDone.length} tarea subida que aun no ha sido evaluada`}
                  </div>
                )}
                {evaluatedTask && (
                  <div className="italic flex items-center gap-2 text-green-700 mt-4 pt-2">
                    <FaCheck style={{ width: 50 }} />
                    {tasksEvaluated.length > 1
                      ? `Tiene ${tasksEvaluated.length} tareas que han sido evaluadas`
                      : `Tiene ${tasksEvaluated.length} tarea que ha sido evaluada`}
                  </div>
                )}
                {done && (
                  <div className="italic flex items-center gap-2 text-green-700 mt-4 pt-2">
                    <FaCheck style={{ width: 50 }} />
                    Ha terminado de hacer el curso y todas las actividades
                    pendientes han sido completadas y evaluadas.
                  </div>
                )}
              </>
            )}

          {endcourse && (
            <>
              <div
                className={`italic flex items-center gap-2 ${
                  state === APPROVED && "text-blue-600"
                } ${state === REPROVED && "text-red-600"}`}
              >
                {state === REPROVED && (
                  <>
                    <FaSadCry className="text-xl" />
                    Lamentamos informarle que ha sido reprobado del curso
                  </>
                )}
                {state === APPROVED && (
                  <>
                    <BiHappyAlt className="text-xl" />
                    Felicitaciones, aprobó el curso
                  </>
                )}
              </div>
              <div className="mt-4">
                Su promedio final es de:&nbsp;
                <span
                  className={`${state === APPROVED && "text-blue-600"} ${
                    state === REPROVED && "text-red-600"
                  } text-xl`}
                >
                  {user_course.average}
                </span>
              </div>
            </>
          )}
        </div>
        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button
              onClick={handleClick}
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              Aceptar
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default CourseProgressDetail;
