import CourseDetail from "@/components/courseDetail";
import { getSession, loginIsRequiredServer } from "@/lib/login-controller";
import React from "react";
import { AiFillStar, AiFillYoutube } from "react-icons/ai";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";
import Image from "next/image";
import mainPicture from "../../../public/curso.jpg";
import { getUserCourseByUserId } from "@/lib/user-controller";
import { User_Course } from "@/types/types";
import {
  Avatar,
  Box,
  Button,
  DropdownMenu,
  Flex,
  Heading,
  Inset,
  ScrollArea,
  Text,
} from "@radix-ui/themes";
import CourseContentItems from "@/components/courseContentItems";

const CoursePage = async () => {
  await loginIsRequiredServer();
  const stars = new Array(5).fill(0);
  const { _user } = await getSession();
  const id = _user?.id || 0;
  const isStudent = +(_user?.type || 0) === 0;
  const user_course: User_Course | null | undefined =
    await getUserCourseByUserId(id);
  return (
    <div className="flex flex-col items-center justify-center w-full px-16 py-8 gap-6">
      <div className="flex flex-col items-start justify-center w-full">
        <p className="font-bold text-2xl flex mb-8">
          {stars.map((s, index) => (
            <AiFillStar key={index} className="text-yellow-400" />
          ))}
        </p>
        <p className="font-bold text-2xl mb-8">Fracciones para principiantes</p>
        <p className="text-base mb-8 text-gray-500">Sin categoria</p>
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-16">
        <Image
          className="lg:w-2/3 w-full"
          src={mainPicture}
          width={700}
          height={400}
          alt="imagen del curso"
        />
        {isStudent && <CourseDetail userCourse={user_course} />}
      </div>
      <div className="flex flex-col lg:flex-row items-start justify-center w-full gap-16">
        <div className="lg:w-2/3 w-full">
          <p className="font-bold text-xl mb-4">Información del curso</p>
          <hr />
          <Box p="2" pr="8">
            <Heading size="4" mb="2" trim="start">
              Acerca de este curso
            </Heading>
            <Flex direction="column" gap="4" mb="5">
              <Text as="p">
                Three fundamental aspects of typography are legibility,
                readability, and aesthetics. Although in a non-technical sense
                “legible” and “readable” are often used synonymously,
                typographically they are separate but related concepts.
              </Text>
            </Flex>
            <Heading size="4" mb="2" trim="start">
              ¿Qué Aprenderás?
            </Heading>
            <Flex direction="column" gap="4" mb="5">
              <Text as="p">
                Three fundamental aspects of typography are legibility,
                readability, and aesthetics. Although in a non-technical sense
                “legible” and “readable” are often used synonymously,
                typographically they are separate but related concepts.
              </Text>
            </Flex>
            <Heading size="4" mb="5" trim="start">
              Contenido del curso
            </Heading>
            <CourseContentItems />
          </Box>
        </div>
        <div className="lg:w-1/3 w-full flex-col border-4 border-gray-300 rounded-md ">
          <p className="mx-8 mt-8 text-lg">Un curso de</p>
          <div className=" mx-8 mb-12 mt-8  w-full  flex gap-5 items-center">
            <Avatar
              fallback="J"
              color="blue"
              variant="solid"
              style={{ borderRadius: "50%" }}
            />
            <p className="font-bold text-lg">Juan Juancino</p>
          </div>
          <hr />
          <div className="p-4 w-full flex flex-col items-center justify-center overflow-hidden">
            <div>
              <ul className="list-outside">
                <p className="font-bold text-lg mx-8 mt-8 list-none">
                  Audiencia
                </p>
                <li className="text-justify mx-8 mb-12 mt-8 list-disc">
                  "Nuestra meta es fomentar y enriquecer tu proceso de
                  aprendizaje en el área de las matemáticas"
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
