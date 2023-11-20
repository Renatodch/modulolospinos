"use client";
import { useUserContext } from "@/app/context";
import CourseContentItems from "@/components/courseContentItems";
import CourseDetail from "@/components/courseDetail";
import { getActivities } from "@/controllers/activity.controller";
import { getTasksByUserId } from "@/controllers/task.controller";
import {
  getCurrentNumberUserCourses,
  getUserCourseByUserId,
} from "@/controllers/user-course.controller";
import { getTasksActivityDetail } from "@/lib/utils";
import {
  PRIMARY_COLOR,
  Task,
  TaskActivityDetail,
  User_Course,
  isStudent,
} from "@/model/types";
import { Avatar, Box, Flex, Heading, Text } from "@radix-ui/themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { PuffLoader } from "react-spinners";
import mainPicture from "../../../public/curso.jpg";

const CoursePage = () => {
  const [loaded, setLoaded] = useState(false);
  const [numberUsers, setNumberUsers] = useState(0);
  const [tasksDetail, setTasksDetail] = useState<TaskActivityDetail[]>([]);
  const [userCourse, setUserCourse] = useState<User_Course | null | undefined>(
    undefined
  );
  const { user } = useUserContext();
  const id = user?.id || 0;
  const type = user?.type || 1;
  const stars = new Array(5).fill(0);

  useEffect(() => {
    const getData = async () => {
      const number_users = await getCurrentNumberUserCourses();
      const user_course: User_Course | null | undefined =
        await getUserCourseByUserId(id);

      const tasks: Task[] | null | undefined = await getTasksByUserId(id);
      const activities = await getActivities();
      const _tasksDetail = getTasksActivityDetail(activities, tasks);

      setUserCourse(user_course);
      setTasksDetail(_tasksDetail);
      setNumberUsers(number_users);
      setLoaded(true);
    };
    getData();
  }, []);

  const handleStart = async () => {
    setLoaded(false);

    const number_users = await getCurrentNumberUserCourses();
    const user_course: User_Course | null | undefined =
      await getUserCourseByUserId(id);

    const tasks: Task[] | null | undefined = await getTasksByUserId(id);
    const activities = await getActivities();
    const _tasksDetail = getTasksActivityDetail(activities, tasks);

    setUserCourse(user_course);
    setTasksDetail(_tasksDetail);
    setNumberUsers(number_users);
    setLoaded(true);
  };

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
        {isStudent(type) && (
          <CourseDetail
            onStart={handleStart}
            id_user={id}
            number_users={numberUsers}
            tasksDetail={tasksDetail}
          />
        )}
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
                &quot;legible&quot; and &quot;readable&quot; are often used
                synonymously, typographically they are separate but related
                concepts.
              </Text>
            </Flex>
            <Heading size="4" mb="2" trim="start">
              ¿Qué Aprenderás?
            </Heading>
            <Flex direction="column" gap="4" mb="5">
              <Text as="p">
                Three fundamental aspects of typography are legibility,
                readability, and aesthetics. Although in a non-technical sense
                &quot;legible&quot; and &quot;readable&quot; are often used
                synonymously, typographically they are separate but related
                concepts.
              </Text>
            </Flex>
            <Heading size="4" mb="5" trim="start">
              Contenido del curso
            </Heading>
            {loaded ? (
              <CourseContentItems
                progress={userCourse?.progress}
                selected={userCourse?.progress}
              />
            ) : (
              <div
                className="w-full flex justify-center items-center"
                style={{ height: "300px" }}
              >
                <PuffLoader
                  color={PRIMARY_COLOR}
                  loading={!loaded}
                  size={150}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            )}
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
                  &quot;Nuestra meta es fomentar y enriquecer tu proceso de
                  aprendizaje en el área de las matemáticas&quot;
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
