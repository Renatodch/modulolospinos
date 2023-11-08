"use client";
import { COURSE_IN_PROCESS, Project, User_Course } from "@/types/types";
import { Button, Flex, Inset, Slider } from "@radix-ui/themes";
import Link from "next/link";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BiRefresh } from "react-icons/bi";
import { PiStudentBold } from "react-icons/pi";
import { TbAntennaBars5 } from "react-icons/tb";
import CourseProgressDetail from "./courseProgressDetail";

interface Props {
  userCourse: User_Course | undefined | null;
  project: Project | undefined | null;
  numberUsers: number;
}
const CourseDetail = ({ userCourse, project, numberUsers }: Props) => {
  //const { user_course } = useUserContext();
  //const _user_course = userCourse ?? user_course;
  //const { project } = useUserContext();

  const progress = userCourse?.progress || 0;
  const state = userCourse?.state || 0;
  const progrePercent = 20 * (progress + +(state === 1));

  return (
    <div className="lg:w-1/3 w-full flex-col self-stretch border-4 border-gray-300 rounded-md ">
      <div className="bg-gray-200 box-border px-8 py-12 w-full h-3/5">
        <Inset className="flex flex-col" side="top" pb="current">
          <p className="font-bold text-lg mb-4 flex justify-between">
            Progreso del curso{" "}
            <CourseProgressDetail project={project} user_course={userCourse} />
          </p>
          <p className="flex justify-between mb-4 flex-col">
            <span>{progress + +(state === 1)}/5</span>
            <span>{progrePercent}% Completado</span>
          </p>
          <Slider
            color={state === 1 ? "green" : state === 2 ? "red" : "blue"}
            value={[progrePercent]}
            className="mb-8"
          />
          <Button
            size="3"
            disabled={Boolean(
              userCourse && userCourse?.state > COURSE_IN_PROCESS
            )}
          >
            <Link
              href="/curso/clases"
              style={{
                pointerEvents:
                  userCourse && userCourse?.state > COURSE_IN_PROCESS
                    ? "none"
                    : "all",
              }}
            >
              {!userCourse || userCourse.state > COURSE_IN_PROCESS
                ? "Empezar el aprendizaje"
                : "Continuar el aprendizaje"}
            </Link>
          </Button>
        </Inset>
      </div>
      <div className="p-4 w-full h-2/5 flex flex-col items-center justify-center overflow-hidden">
        <div>
          <Flex justify="between" height={"6"}>
            <div style={{ width: "40px", height: "20px" }}>
              <TbAntennaBars5 size="20" className="inline-block" />
            </div>

            <p className="mr-auto">Principiante</p>
          </Flex>
          <Flex justify="between" height={"6"}>
            <div style={{ width: "40px", height: "20px" }}>
              <PiStudentBold size="20" className="inline-block" />
            </div>

            <p className="mr-auto">{numberUsers} Total de inscritos</p>
          </Flex>
          <Flex justify="between" height={"6"}>
            <div style={{ width: "40px", height: "20px" }}>
              <AiOutlineClockCircle size="20" className="inline-block" />
            </div>
            <p className="mr-auto">1 hora Duracion</p>
          </Flex>
          <Flex justify="between" height={"6"}>
            <div style={{ width: "40px", height: "20px" }}>
              <BiRefresh size="20" className="inline-block" />
            </div>
            <p className="mr-auto">
              28 de octubre de 2023 Última actualización
            </p>
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
