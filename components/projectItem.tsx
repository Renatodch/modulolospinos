"use client";
import { useUserContext } from "@/app/context";
import { getNoteColorClass } from "@/lib/utils";
import { Task, isTeacher } from "@/model/types";
import { Strong } from "@radix-ui/themes";
import Image from "next/image";
import ProjectFormEval from "./taskFormEval";
const ProjectItem = ({ project }: { project: Task | null | undefined }) => {
  const { user } = useUserContext();

  return project ? (
    <div className="w-full px-16 py-8 flex flex-col items-start justify-start">
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
          {project.score && (
            <p className="text-xl">
              <Strong>Nota:&nbsp;</Strong>
              <span className={`${getNoteColorClass(project.score)}`}>
                {project.score}
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
  ) : (
    <div className="w-full flex justify-center mt-16">
      <Strong>El proyecto no existe</Strong>
    </div>
  );
};

export default ProjectItem;
