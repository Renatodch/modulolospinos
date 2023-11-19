"use client";

import { useUserContext } from "@/app/context";
import ClassItem from "@/components/classItem";
import CourseContentItems from "@/components/courseContentItems";
import NotAllowed from "@/components/notAllowed";
import NotInitCourse from "@/components/notInitCourse";
import { getActivitiesBySubject } from "@/controllers/activity.controller";
import { getTasksByUserId } from "@/controllers/task.controller";
import {
  getUserCourseByUserId,
  saveUserCourse,
} from "@/controllers/user-course.controller";
import { getTasksActivityDetail } from "@/lib/utils";

import {
  PRIMARY_COLOR,
  TEACHER,
  TaskActivityDetail,
  User_Course,
} from "@/model/types";
import { useEffect, useState } from "react";
import PuffLoader from "react-spinners/PuffLoader";

export default function ClasesPage() {
  const { user } = useUserContext();
  const [user_course, setUserCourse] = useState<User_Course | undefined | null>(
    undefined
  );
  const [loaded, setLoaded] = useState<boolean>(false);
  const [initCourse, setInitCourse] = useState<boolean>(true);
  const [tasksDetail, setTasksDetail] = useState<TaskActivityDetail[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [selected, setSelected] = useState<number>(0);
  const id_user = user?.id || 0;

  useEffect(() => {
    const updateData = async () => {
      let userCourse = await getUserCourseByUserId(id_user);
      if (!userCourse) setInitCourse(false);
      else setInitCourse(true);

      const _progress = userCourse?.progress ?? 0;

      const activities = await getActivitiesBySubject(_progress);
      const tasks = await getTasksByUserId(id_user);
      const _tasksDetail = getTasksActivityDetail(activities, tasks).filter(
        (t) => t.subject === _progress
      );

      setTasksDetail(_tasksDetail);
      setProgress(_progress);
      setSelected(_progress);
      setUserCourse(userCourse);
      setLoaded(true);
    };
    updateData();
  }, [id_user]);

  if (user?.type === TEACHER) return <NotAllowed />;

  const HandleClickLink = async (index: number) => {
    setLoaded(false);
    let userCourse = await getUserCourseByUserId(id_user);
    if (!userCourse) return;

    setSelected(index);
    const activities = await getActivitiesBySubject(index);
    const tasks = await getTasksByUserId(id_user);
    const _tasksDetail = getTasksActivityDetail(activities, tasks).filter(
      (t) => t.subject === index
    );

    if (index > userCourse?.progress) {
      userCourse = await saveUserCourse({
        ...userCourse,
        progress: index,
        date_update: new Date(),
      });
    } else {
      index = userCourse.progress;
    }

    setTasksDetail(_tasksDetail);
    setProgress(index);
    setUserCourse(userCourse);
    setLoaded(true);
  };

  return initCourse ? (
    <div className="flex items-start justify-center w-full px-16 py-8 gap-6">
      <div className=" w-1/3 h-max" style={{ height: "300px" }}>
        <CourseContentItems
          interactive
          progress={progress}
          selected={selected}
          loading={!loaded}
          onClickLink={HandleClickLink}
        />
      </div>
      {loaded ? (
        <div className=" w-2/3 ">
          <ClassItem
            item={selected}
            tasksDetail={tasksDetail}
            userCourse={user_course}
          />
        </div>
      ) : (
        <div
          className="w-2/3 flex justify-center items-center"
          style={{ height: "500px" }}
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
    </div>
  ) : (
    <NotInitCourse />
  );
}
