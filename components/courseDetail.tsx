"use client";
import { getDateString } from "@/lib/date-lib";
import {
  IN_PROGRESS,
  PRIMARY_COLOR,
  TaskActivityDetail,
  User_Course,
} from "@/model/types";
import { Button, Flex, Inset, Slider } from "@radix-ui/themes";
import Link from "next/link";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BiRefresh } from "react-icons/bi";
import { PiStudentBold } from "react-icons/pi";
import { TbAntennaBars5 } from "react-icons/tb";
import CourseProgressDetail from "./courseProgressDetail";

const CourseDetail = ({
  user_course,
  number_users,
  tasksDetail,
}: {
  number_users: number;
  user_course: User_Course | null | undefined;
  tasksDetail: TaskActivityDetail[];
}) => {
  const state = user_course?.state ?? 0;
  const progress = user_course?.progress ?? 0;
  const progressPercent = 20 * (progress + +(state === 1));

  return (
    <div className="lg:w-1/3 w-full flex-col self-stretch border-4 border-gray-300 rounded-md ">
      <div className="bg-gray-200 box-border px-8 py-12 w-full h-3/5">
        <Inset className="flex flex-col" side="top" pb="current">
          <p className="font-bold text-lg mb-4 flex justify-between">
            Progreso del curso{" "}
            <CourseProgressDetail
              user_course={user_course}
              tasksDetail={tasksDetail}
            />
          </p>
          <p className="flex justify-between mb-4 flex-col">
            <span>{progress + +(state === 1)}/5</span>
            <span>{progressPercent}% Completado</span>
          </p>
          <Slider
            color={state === 1 ? "green" : state === 2 ? "red" : "blue"}
            value={[progressPercent]}
            className="mb-8"
          />
          <Button
            size="3"
            disabled={Boolean(user_course && user_course?.state > IN_PROGRESS)}
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            <Link
              href="/curso/clases"
              style={{
                pointerEvents: Boolean(
                  user_course && user_course?.state > IN_PROGRESS
                )
                  ? "none"
                  : "all",
              }}
            >
              {Boolean(!user_course || user_course?.state > IN_PROGRESS)
                ? "Empezar el aprendizaje"
                : "Continuar el aprendizaje"}
            </Link>
          </Button>
          {user_course?.date_start && (
            <span className="italic text-sm mt-2">
              Empezó el día {getDateString(user_course?.date_start)}
            </span>
          )}
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

            <p className="mr-auto">{number_users} Total de inscritos</p>
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
