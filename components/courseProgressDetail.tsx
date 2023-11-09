"use client";
import { getDateString } from "@/lib/date-lib";
import {
  COURSE_APPROVED,
  COURSE_IN_PROCESS,
  COURSE_LAST_ITEM_INDEX,
  COURSE_REPROVED,
  Project,
  TOAST_PROJECT_PENDING,
  User_Course,
} from "@/types/types";
import {
  Button,
  Dialog,
  Flex,
  IconButton,
  Strong,
  Tooltip,
} from "@radix-ui/themes";
import { useState } from "react";
import { BiHappyAlt } from "react-icons/bi";
import { FaSadCry } from "react-icons/fa";
import { FcInspection } from "react-icons/fc";
import { FiClock } from "react-icons/fi";
import { GoAlertFill } from "react-icons/go";
import { GrInProgress } from "react-icons/gr";
const CourseProgressDetail = ({
  project,
  user_course,
}: {
  user_course: User_Course | null | undefined;
  project: Project | null | undefined;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const stateCourse = user_course?.state || 0;
  const progress = user_course?.progress || 0;

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Dialog.Root open={open}>
      <Dialog.Trigger>
        <Tooltip content="Click para ver mas detalles">
          <IconButton onClick={handleClick} radius="full">
            <FcInspection />
          </IconButton>
        </Tooltip>
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
            stateCourse === COURSE_IN_PROCESS &&
            progress < COURSE_LAST_ITEM_INDEX && (
              <>
                <div className="italic flex items-center gap-2">
                  <GrInProgress className=" text-xl" />
                  Usted se encuentra llevando el curso
                </div>
                <div className="mt-4">No hay tareas pendientes</div>
              </>
            )}
          {user_course && stateCourse === COURSE_IN_PROCESS && !project && (
            <>
              <div className="italic flex items-center gap-2 text-orange-400 ">
                <GoAlertFill className="text-xl" />
                {TOAST_PROJECT_PENDING}
              </div>
              <div className="mt-4">
                La fecha máxima de entrega es hasta el día &nbsp;
                {getDateString(user_course.date_project_send_max)}
              </div>
            </>
          )}
          {user_course && stateCourse === COURSE_IN_PROCESS && project && (
            <>
              <div className="italic flex items-center gap-2">
                <BiHappyAlt className="text-5xl" />
                Felicitaciones, ha subido su proyecto de fin de curso pero aun
                no ha sido evaluado
              </div>
              <div className="mt-4">
                Lo subió el día {getDateString(project.date_upload)}
              </div>
            </>
          )}
          {user_course && stateCourse !== COURSE_IN_PROCESS && project && (
            <>
              <div
                className={`italic flex items-center gap-2 ${
                  stateCourse === COURSE_APPROVED && "text-green-600"
                } ${stateCourse === COURSE_REPROVED && "text-red-600"} text-xl`}
              >
                {stateCourse === COURSE_APPROVED && (
                  <>
                    <BiHappyAlt className="text-xl" />
                    Usted aprobó el curso
                  </>
                )}
                {stateCourse === COURSE_REPROVED && (
                  <>
                    <FaSadCry className="text-xl" />
                    Usted reprobó el curso
                  </>
                )}
              </div>
              <div className="mt-4">
                La nota de su proyecto fue de: &nbsp;
                <span
                  className={`${
                    stateCourse === COURSE_APPROVED && "text-green-600"
                  } ${
                    stateCourse === COURSE_REPROVED && "text-red-600"
                  } text-xl`}
                >
                  {project.projectscore}
                </span>
              </div>
              <div className="mt-4 flex flex-col">
                <Strong>Comentario del docente:</Strong>
                <span className="italic">{project.comment}</span>
              </div>
            </>
          )}

          {user_course && stateCourse === COURSE_REPROVED && !project && (
            <>
              <div className="italic flex items-center gap-2 text-red-600">
                <FaSadCry className=" text-xl" />
                No ha subido su proyecto a tiempo y por tanto ha sido reprobado
                del curso
              </div>
              <div className="mt-4">
                {`Su proyecto fue asignado el día ${getDateString(
                  user_course.date_project_assigned
                )}
              y la fecha máxima de entrega fue hasta el dia  ${getDateString(
                user_course.date_project_send_max
              )}`}
              </div>
            </>
          )}
        </div>
        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button onClick={handleClick} variant="soft">
              Aceptar
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default CourseProgressDetail;
