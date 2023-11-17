"use client";
import { useUserContext } from "@/app/context";
import { getDateString } from "@/lib/date-lib";
import {
  Activity,
  MIN_NOTE_APPROVED,
  NO_DATE_MAX_MESSAGE_TASK,
  SUBJECTS_COURSE,
  Task,
  isTeacher,
} from "@/model/types";
import { Strong } from "@radix-ui/themes";
import Image from "next/image";
import ProjectFormEval from "./taskFormEval";
const ProjectItem = ({
  project,
  activity,
}: {
  project: Task | null | undefined;
  activity: Activity | null | undefined;
}) => {
  const { user } = useUserContext();

  return !project ? (
    <div className="w-full flex justify-center mt-16">
      <Strong>El proyecto no existe</Strong>
    </div>
  ) : (
    <div className="w-full px-16 py-8 flex flex-col items-start justify-start">
      <div className="italic flex justify-between text-md w-full mb-4">
        {activity?.title && activity.id && (
          <div className="flex flex-col">
            <span>
              <strong>Tarea para la actividad: &nbsp;</strong> {activity?.title}
            </span>
            <span>
              <strong>id de actividad: &nbsp;</strong> {activity?.id}
            </span>
          </div>
        )}
        {activity?.subject && (
          <div>
            <span>
              <strong>Tema: &nbsp;</strong>
              {
                SUBJECTS_COURSE.find((s) => s.value === activity?.subject)
                  ?.title
              }
            </span>
          </div>
        )}
        {activity?.date_max ? (
          <div className="flex flex-col">
            <span
              className={`${
                project.date_upload > activity.date_max
                  ? "text-red-600"
                  : "text-black"
              }`}
            >
              <strong className="text-black">Subido el: &nbsp;</strong>
              {getDateString(project.date_upload)}
            </span>
            <span
              className={`${
                project.date_upload > activity.date_max
                  ? "text-red-600"
                  : "text-black"
              }`}
            >
              <strong className="text-black">
                Fecha de vencimiento: &nbsp;
              </strong>
              {getDateString(activity?.date_max)}
            </span>
          </div>
        ) : (
          <div className="flex flex-col">
            <span>
              <strong className="text-black">Subido el: &nbsp;</strong>
              {getDateString(project.date_upload)}
            </span>
            <span>
              <strong>{NO_DATE_MAX_MESSAGE_TASK}</strong>
            </span>
          </div>
        )}
      </div>
      <p className="font-bold text-3xl w-full text-center mb-4">
        {project?.title}
      </p>
      {project?.image1 && (
        <div
          style={{
            height: "500px",
            backgroundColor: "gray",
            position: "relative",
            width: "100%",
          }}
        >
          <Image
            src={project?.image1}
            fill
            alt={project.title}
            className="mb-4"
          />
        </div>
      )}

      <p className="text-base w-full mb-4">{project?.description}</p>

      <div className="flex justify-between w-full lg:flex-row flex-col lg:gap-0 gap-6">
        {isTeacher(user?.type) && <ProjectFormEval target={project} />}
        <div className="flex flex-col w-96">
          {project.score != null && project.score != undefined && (
            <p className="text-xl">
              <Strong>Nota:&nbsp;</Strong>
              <span
                className={`${
                  project.score >= MIN_NOTE_APPROVED
                    ? "text-blue-600"
                    : "text-red-600"
                }`}
              >
                {project.score}/20
              </span>
            </p>
          )}
          {project.comment && (
            <p className="text-xl">
              <Strong>Comentario:&nbsp;</Strong>
              {project.comment}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectItem;
