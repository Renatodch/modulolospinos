"use client";
import { saveUserCourse } from "@/controllers/user-course.controller";
import { getDateString } from "@/lib/date-lib";
import {
  APPROVED,
  IN_PROGRESS,
  NOT_INIT,
  PRIMARY_COLOR,
  Subject,
  TOAST_COURSE_START_FAILED,
  TOAST_COURSE_START_SUCCESS,
  TaskActivityDetail,
  User,
  User_Course,
} from "@/model/types";
import { Button, Flex, Slider } from "@radix-ui/themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BiRefresh } from "react-icons/bi";
import { PiStudentBold } from "react-icons/pi";
import { TbAntennaBars5 } from "react-icons/tb";
import { PuffLoader } from "react-spinners";
import { toast } from "sonner";
import CourseProgressDetail from "./courseProgressDetail";
import NotesReport from "./notesReport";

const CourseDetail = ({
  number_users,
  tasksDetail,
  subjects,
  user,
  onStart,
  user_course,
}: {
  number_users: number;
  tasksDetail: TaskActivityDetail[];
  subjects: Subject[];
  user: User;
  onStart: () => void;
  user_course: User_Course | null | undefined;
}) => {
  const router = useRouter();
  const [clicked, setClicked] = useState(false);
  const [uc, setUc] = useState<User_Course | undefined | null>(undefined);

  const [ste, setSte] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);

  const id_user = user.id;

  useEffect(() => {
    const update = async () => {
      setUc(user_course);
      setSte(user_course?.state ?? -1);
      setProgress(user_course?.progress ?? 0);
      const value =
        20 *
        ((user_course?.progress ?? 0) + +(user_course?.state === APPROVED));
      setProgressPercent(value);
      setLoaded(!!user_course);
    };
    update();
  }, [user, user_course]);

  const handleStartCourseClick = async () => {
    //const user_course = await getUserCourseByUserId(id_user);
    if (!uc) {
      toast.error(TOAST_COURSE_START_FAILED);
      return;
    }
    if (uc?.state! > NOT_INIT) {
      toast.error("Usted ya inició el curso");
      return;
    }
    setClicked(true);
    toast.loading("Iniciando...");
    let userCourse;
    try {
      userCourse = await saveUserCourse({
        ...uc,
        date_start: new Date(),
        date_update: new Date(),
        state: IN_PROGRESS,
        progress: 0,
      });
      toast.dismiss();
      userCourse
        ? toast.success(TOAST_COURSE_START_SUCCESS)
        : toast.error(TOAST_COURSE_START_FAILED);
    } catch (e) {
      toast.dismiss();
      toast.error(TOAST_COURSE_START_FAILED);
    }
    setLoaded(false);
    setUc(userCourse);
    router.refresh();
    onStart();
    setClicked(false);
  };
  return (
    <div className="lg:w-1/3 w-full flex-col self-stretch border-4 border-gray-300 rounded-md ">
      <div className="bg-gray-200 box-border px-8 py-12 w-full h-3/5">
        {loaded ? (
          <div className="flex flex-col h-full">
            <p className="font-bold text-lg mb-4 flex justify-between">
              Progreso del curso{" "}
              <CourseProgressDetail
                user_course={uc}
                tasksDetail={tasksDetail}
                subjects={subjects}
              />
            </p>
            <p className="flex justify-between mb-4 flex-col">
              <span>{progress + +(ste === APPROVED)}/5</span>
              <span>{progressPercent}% Completado</span>
            </p>
            <Slider
              color={ste === 1 ? "green" : ste === 2 ? "red" : "blue"}
              value={[progressPercent]}
              className="mb-8"
            />

            {ste === IN_PROGRESS && (
              <Button
                size="3"
                disabled={Boolean(uc && ste > IN_PROGRESS)}
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                <Link href="/curso/clases">Continuar el aprendizaje</Link>
              </Button>
            )}
            {(ste === NOT_INIT || ste > IN_PROGRESS) && (
              <Button
                size="3"
                disabled={Boolean((uc && ste > IN_PROGRESS) || clicked)}
                style={{ backgroundColor: PRIMARY_COLOR }}
                onClick={handleStartCourseClick}
              >
                Empezar el aprendizaje
              </Button>
            )}

            {uc?.date_start && (
              <span className="italic text-sm mt-2">
                Empezó el día {getDateString(uc?.date_start)}
              </span>
            )}
            {ste > NOT_INIT && (
              <div className="flex w-full gap-4 my-2 justify-end items-center">
                <strong>Reporte de Notas</strong>
                <NotesReport user={user} user_course={uc} />
              </div>
            )}
          </div>
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
          <p className="mr-auto">28 de octubre de 2023 Última actualización</p>
        </Flex>
      </div>
    </div>
  );
};

export default CourseDetail;
