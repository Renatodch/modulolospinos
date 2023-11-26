"use client";
import { useUserContext } from "@/app/context";
import CourseContentItems from "@/components/courseContentItems";
import CourseDetail from "@/components/courseDetail";
import { getActivities } from "@/controllers/activity.controller";
import { getSubjects } from "@/controllers/subject.controller";
import { getTasksByUserId } from "@/controllers/task.controller";
import { getUserCourses } from "@/controllers/user-course.controller";
import { getTasksActivityDetail } from "@/lib/utils";
import {
  IN_PROGRESS,
  PRIMARY_COLOR,
  Subject,
  TaskActivityDetail,
  User_Course,
  isStudent,
} from "@/model/types";
import { Avatar, Box, Flex, Heading, Text } from "@radix-ui/themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiFillStar, AiOutlineClockCircle } from "react-icons/ai";
import { BiRefresh } from "react-icons/bi";
import { PiStudentBold } from "react-icons/pi";
import { TbAntennaBars5 } from "react-icons/tb";
import { PuffLoader } from "react-spinners";
import mainPicture from "../../../public/curso.jpg";

const CoursePage = () => {
  const [loaded, setLoaded] = useState(false);
  const [numberUsers, setNumberUsers] = useState(0);
  const [tasksDetail, setTasksDetail] = useState<TaskActivityDetail[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [userCourse, setUserCourse] = useState<User_Course | null | undefined>(
    undefined
  );
  const { user } = useUserContext();
  const id_user = user?.id!;
  const type = user?.type;
  const stars = new Array(5).fill(0);

  useEffect(() => {
    const getData = async () => {
      const _user_courses = await getUserCourses();
      setNumberUsers(
        _user_courses.filter((uc) => uc.state === IN_PROGRESS).length
      );

      const user_course: User_Course | null | undefined = _user_courses.find(
        (u) => u.id_user === id_user
      );

      const tasks = await getTasksByUserId(id_user);
      const activities = await getActivities();
      const _subjects = await getSubjects();
      const _tasksDetail = getTasksActivityDetail(activities, tasks, _subjects);

      setUserCourse(user_course);
      setSubjects(_subjects);
      setTasksDetail(_tasksDetail);
      setLoaded(true);
    };
    getData();
  }, []);

  const handleStart = async () => {
    setLoaded(false);

    const _user_courses = await getUserCourses();
    setNumberUsers(
      _user_courses.filter((uc) => uc.state === IN_PROGRESS).length
    );

    const user_course: User_Course | null | undefined = _user_courses.find(
      (u) => u.id_user === id_user
    );

    const tasks = await getTasksByUserId(id_user);
    const activities = await getActivities();
    const _subjects = await getSubjects();
    const _tasksDetail = getTasksActivityDetail(activities, tasks, _subjects);

    setUserCourse(user_course);
    setSubjects(_subjects);
    setTasksDetail(_tasksDetail);
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
          <div className="lg:w-1/3 w-full flex-col self-stretch border-4 border-gray-300 rounded-md ">
            <div className="bg-gray-200 box-border px-8 py-12 w-full h-3/5">
              {loaded ? (
                <CourseDetail
                  onStart={handleStart}
                  user={user!}
                  user_course={userCourse}
                  tasksDetail={tasksDetail}
                  subjects={subjects}
                />
              ) : (
                <div className="w-full flex justify-center h-full">
                  <PuffLoader
                    color={PRIMARY_COLOR}
                    loading={!loaded}
                    size={150}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
              )}
            </div>
            <div className="p-8  w-full flex flex-col items-start justify-center overflow-hidden h-2/5">
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
                inprogress={userCourse?.state! >= IN_PROGRESS}
                progress={userCourse?.progress!}
                selected={
                  subjects.find((s, index) => index === userCourse?.progress!)
                    ?.id
                }
                subjects={subjects}
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
