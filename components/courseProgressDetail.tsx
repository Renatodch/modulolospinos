"use client";
import {
  APPROVED,
  APPROVED_COLOR_CLASS,
  COURSE_LAST_ITEM_INDEX,
  IN_PROGRESS,
  PRIMARY_COLOR,
  REPROVED,
  REPROVED_COLOR_CLASS,
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
}: {
  user_course: User_Course | null | undefined;
  tasksDetail: TaskActivityDetail[];
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const pendingTask = tasksDetail.some((t) => !t.done);
  const pendingEvaluateTask = tasksDetail.some((t) => t.done && !t.evaluated);
  const done = tasksDetail.every((t) => t.done && t.evaluated);
  const evaluatedTask = tasksDetail.some((t) => t.done && t.evaluated);
  const tasksDone = tasksDetail.filter((t) => t.done && !t.evaluated);
  const tasksEvaluated = tasksDetail.filter((t) => t.done && t.evaluated);
  const tasksPending = tasksDetail.filter((t) => !t.done);
  const state = user_course?.state ?? IN_PROGRESS;
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
          {!user_course && (
            <div className="italic flex items-center gap-2">
              <FiClock className=" text-xl" />
              Usted aun no ha iniciado el curso!
            </div>
          )}

          {user_course &&
            user_course.state === IN_PROGRESS &&
            user_course.progress < COURSE_LAST_ITEM_INDEX && (
              <>
                <div className="italic flex items-center gap-2">
                  <GrInProgress className=" text-xl" />
                  Usted se encuentra llevando el curso
                </div>
                <div className="mt-4">No hay tareas pendientes</div>
              </>
            )}

          {user_course &&
            user_course.state === IN_PROGRESS &&
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

          {state > IN_PROGRESS && (
            <>
              <div
                className={`italic flex items-center gap-2 ${
                  state === APPROVED && APPROVED_COLOR_CLASS
                } ${state === REPROVED && REPROVED_COLOR_CLASS}`}
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
                Su promedio ponderado es de:&nbsp;
                <span
                  className={`${state === APPROVED && APPROVED_COLOR_CLASS} ${
                    state === REPROVED && REPROVED_COLOR_CLASS
                  } text-xl`}
                >
                  {user_course?.average}
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
