"use client";
import { useUserContext } from "@/app/context";
import { getDateString } from "@/lib/date-lib";
import {
  Activity,
  NO_DATE_MAX_MESSAGE_TASK,
  PRIMARY_COLOR,
  Subject,
  Task,
  User,
} from "@/model/types";
import { Strong } from "@radix-ui/themes";
import Image from "next/image";
import Rubric from "./rubric";
import RubricLink from "./rubricLink";
import TaskEvalDetail from "./taskEvalDetail";
const ProjectItem = ({
  student,
  project,
  activity,
  subject,
}: {
  student: User | null | undefined;
  project: Task | null | undefined;
  activity: Activity | null | undefined;
  subject: Subject | null | undefined;
}) => {
  const { user } = useUserContext();
  const titleClases = "font-bold uppercase text-lg text-left mt-4 mb-2 italic";
  return !project ? (
    <div className="w-full flex justify-center mt-16">
      <Strong>El proyecto no existe</Strong>
    </div>
  ) : (
    <div className="w-full px-12">
      <div className="w-full italic pt-8 pb-2 flex justify-between text-md mb-4">
        <div className="flex flex-col">
          <strong className={titleClases}>Datos de la actividad</strong>

          <span>
            <strong>Título: &nbsp;</strong> {activity?.title}
          </span>
          <span>
            <strong>iD: &nbsp;</strong> {activity?.id}
          </span>
          <span>
            <strong>Tema al que pertenece: &nbsp;</strong>
            {subject?.title}
          </span>
          {activity?.date_max ? (
            <span
              className={`${
                project.date_upload > activity?.date_max
                  ? "text-red-600"
                  : "text-black"
              }`}
            >
              <strong className="text-black">
                Fecha de vencimiento: &nbsp;
              </strong>
              {getDateString(activity?.date_max)}
            </span>
          ) : (
            <span>
              <strong>{NO_DATE_MAX_MESSAGE_TASK}</strong>
            </span>
          )}
          <RubricLink url={activity?.rubric} text={"RUBRICA DE LA ACTIVIDAD"} />
        </div>

        <div className="flex flex-col">
          <strong className={titleClases}>Datos del estudiante</strong>
          <span>
            <strong className="text-black">Nombre: &nbsp;</strong>
            {student?.name}
          </span>
          <span>
            <strong className="text-black">iD: &nbsp;</strong>
            {student?.id}
          </span>
          <span
            className={`${
              activity?.date_max && project.date_upload > activity.date_max
                ? "text-red-600"
                : "text-black"
            }`}
          >
            <strong className="text-black">Lo subió el: &nbsp;</strong>
            {getDateString(project.date_upload)}
          </span>
        </div>
      </div>

      <hr className="border-gray-400" />
      <p className={titleClases}>Proyecto</p>

      <div className="w-full pt-0 pb-2 flex flex-col items-start justify-start mb-4 mt-8">
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
              alt={project?.title ?? ""}
              className="mb-4"
            />
          </div>
        )}

        <p className="text-base w-full mb-4">{project?.description}</p>
      </div>

      <hr style={{ borderColor: PRIMARY_COLOR }} className="border-3" />
      <div className="mb-16">
        <TaskEvalDetail
          type={user?.type!}
          task={project as Task}
          isrubric={!!activity?.rubric}
        />
      </div>
      {project.rubric && (
        <Rubric
          titleClases={titleClases}
          rubric={project.rubric}
          title={"Rubrica de Evaluación"}
        />
      )}
    </div>
  );
};

export default ProjectItem;
