"use client";
import { useUserContext } from "@/app/context";
import { MIN_NOTE_APPROVED, Project, isTeacher } from "@/types/types";
import { Strong } from "@radix-ui/themes";
import Image from "next/image";
import ProjectFormEval from "./projectFormEval";
const ProjectItem = ({ project }: { project: Project | null | undefined }) => {
  const { user } = useUserContext();

  return project ? (
    <div className="w-full px-16 py-8 flex flex-col items-start justify-start">
      <p className="font-bold text-3xl w-full text-center mb-4">
        {project?.title}
      </p>
      <p className="text-base w-full mb-4">{project?.description}</p>

      {project?.image1 && (
        <Image
          src={project?.image1}
          alt="Bold typography"
          className="mb-4"
          style={{
            display: "block",
            width: "100%",
            height: "500px",
            backgroundColor: "gray",
          }}
        />
      )}

      <div className="flex justify-between w-full lg:flex-row flex-col lg:gap-0 gap-6">
        {isTeacher(user?.type) && <ProjectFormEval target={project} />}
        <div className="flex flex-col w-96">
          {project.projectscore && (
            <p className="text-xl">
              <Strong>Nota:&nbsp;</Strong>
              <span
                className={`${
                  project.projectscore > MIN_NOTE_APPROVED
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {project.projectscore}
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
