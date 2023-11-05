"use client";
import { useUserContext } from "@/app/context";
import { User_Course } from "@/types/types";
import { Button, Flex, Inset, Slider } from "@radix-ui/themes";
import Link from "next/link";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BiRefresh } from "react-icons/bi";
import { PiStudentBold } from "react-icons/pi";
import { TbAntennaBars5 } from "react-icons/tb";

interface Props {
  userCourse: User_Course | undefined | null;
}
const CourseDetail = ({ userCourse }: Props) => {
  const { user_course } = useUserContext();
  if (!userCourse) {
    userCourse = user_course;
  }

  return (
    <div className="lg:w-1/3 w-full flex-col self-stretch border-4 border-gray-300 rounded-md ">
      <div className="bg-gray-200 box-border px-8 py-12 w-full h-3/5">
        <Inset className="flex flex-col" side="top" pb="current">
          <p className="font-bold text-lg mb-4">Progreso del curso</p>
          <p className="flex justify-between mb-4">
            <span>0/5</span>
            <span>0% Completado</span>
          </p>
          <Slider color="blue" value={[0]} className="mb-8" />
          <Button size="3">
            <Link href="/curso/clases">
              {!user_course
                ? "Empezar el aprendizaje"
                : "Continuar el aprendizaje"}
            </Link>
          </Button>
        </Inset>
      </div>
      <div className="p-4 w-full h-2/5 flex flex-col items-center justify-center overflow-hidden">
        <div>
          <Flex justify="between" height={"6"}>
            <TbAntennaBars5 size="20" className="inline-block mr-6" />
            <p className="mr-auto">Principiante</p>
          </Flex>
          <Flex justify="between" height={"6"}>
            <PiStudentBold size="20" className="inline-block mr-6" />
            <p className="mr-auto">8 Total de inscritos</p>
          </Flex>
          <Flex justify="between" height={"6"}>
            <AiOutlineClockCircle size="20" className="inline-block mr-6" />
            <p className="mr-auto">1 hora Duracion</p>
          </Flex>
          <Flex justify="between" height={"6"}>
            <BiRefresh size="20" className="inline-block mr-6" />
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
