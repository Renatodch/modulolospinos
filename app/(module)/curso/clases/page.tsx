"use client";

import { useUserContext } from "@/app/context";
import ClassItem from "@/components/classItem";
import CourseContentItems from "@/components/courseContentItems";
import NotAllowed from "@/components/notAllowed";
import NotInitCourse from "@/components/notInitCourse";
import { getActivitiesBySubject } from "@/controllers/activity.controller";
import { getSubjects } from "@/controllers/subject.controller";
import { getTasksByUserId } from "@/controllers/task.controller";
import {
  getUserCourseByUserId,
  saveUserCourse,
} from "@/controllers/user-course.controller";
import { getTasksActivityDetail } from "@/lib/utils";

import {
  PRIMARY_COLOR,
  Subject,
  TEACHER,
  TaskActivityDetail,
  User_Course,
} from "@/model/types";
import { useEffect, useState } from "react";
import PuffLoader from "react-spinners/PuffLoader";

export default function ClasesPage(props: any) {
  const { user } = useUserContext();
  const [user_course, setUserCourse] = useState<User_Course | undefined | null>(
    undefined
  );
  const [loaded, setLoaded] = useState<boolean>(false);
  const [initCourse, setInitCourse] = useState<boolean>(true);
  const [tasksDetail, setTasksDetail] = useState<TaskActivityDetail[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [selected, setSelected] = useState<number>(0);
  const id_user = user?.id || 0;

  useEffect(() => {
    const updateData = async () => {
      const _index = props.searchParams.index;

      let userCourse = await getUserCourseByUserId(id_user);
      if (!userCourse) setInitCourse(false);
      else setInitCourse(true);

      const _progress = userCourse?.progress ?? 0;

      const activities = await getActivitiesBySubject(
        _index ? +_index : _progress
      );
      const tasks = await getTasksByUserId(id_user);
      const _subjects = await getSubjects();
      const _tasksDetail = getTasksActivityDetail(activities, tasks, _subjects);

      setSubjects(_subjects);
      setTasksDetail(_tasksDetail);
      setProgress(_progress);
      setSelected(_index ? +_index : _progress);
      setUserCourse(userCourse);
      setLoaded(true);
    };
    updateData();
  }, [id_user]);

  if (user?.type === TEACHER) return <NotAllowed />;

  const HandleClickLink = async (index: number) => {
    //index= id_subject
    setLoaded(false);
    let userCourse = await getUserCourseByUserId(id_user);
    if (!userCourse) return;

    setSelected(index);
    const _subjects = await getSubjects();
    const activities = await getActivitiesBySubject(index);
    const tasks = await getTasksByUserId(id_user);
    const _tasksDetail = getTasksActivityDetail(
      activities,
      tasks,
      _subjects
    ).filter((t) => t.id_subject === index);

    if (index > userCourse?.progress) {
      userCourse = await saveUserCourse({
        ...userCourse,
        progress: index,
        date_update: new Date(),
      });
    } else {
      index = userCourse.progress;
    }
    setSubjects(_subjects);
    setTasksDetail(_tasksDetail);
    setProgress(index);
    setUserCourse(userCourse);
    setLoaded(true);
  };

  const loader = (
    <PuffLoader
      color={PRIMARY_COLOR}
      loading={!loaded}
      size={150}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );

  return initCourse ? (
    <div className="flex items-start justify-center w-full px-16 py-8 gap-6">
      {loaded ? (
        <>
          <div className=" w-1/3 h-max" style={{ height: "300px" }}>
            <CourseContentItems
              interactive
              progress={progress}
              selected={selected}
              loading={!loaded}
              subjects={subjects}
              onClickLink={HandleClickLink}
            />
          </div>

          <div className=" w-2/3 ">
            <ClassItem
              tasksDetail={tasksDetail}
              userCourse={user_course}
              subject={subjects.find((s) => s.id === selected)}
              noActivities={
                !tasksDetail?.some((t) => t.id_subject === selected)
              }
            />
          </div>
        </>
      ) : (
        <div
          className="w-2/3 flex justify-center items-center"
          style={{ height: "500px" }}
        >
          {loader}
        </div>
      )}
    </div>
  ) : (
    <NotInitCourse />
  );
}
