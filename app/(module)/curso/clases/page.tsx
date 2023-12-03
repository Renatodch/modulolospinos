"use client";

import { useUserContext } from "@/app/context";
import ClassItem from "@/components/classItem";
import CourseContentItems from "@/components/courseContentItems";
import FinishCourse from "@/components/finishCourse";
import LoadingGeneric from "@/components/loadingGeneric";
import NotAllowed from "@/components/notAllowed";
import NotInitCourse from "@/components/notInitCourse";
import { getActivitiesBySubject } from "@/controllers/activity.controller";
import { getSubjects } from "@/controllers/subject.controller";
import { getTasksByUserId } from "@/controllers/task.controller";
import {
  getUserCourseByUserId,
  saveUserCourse,
} from "@/controllers/user-course.controller";
import {
  getTasksActivityDetail,
  isUserCourseCompleted,
  isUserCourseNotInit,
} from "@/lib/utils";

import {
  Subject,
  TEACHER,
  TaskActivityDetail,
  User_Course,
} from "@/model/types";
import { useEffect, useState } from "react";

export default function ClasesPage(props: any) {
  const { user } = useUserContext();
  const [userCourse, setUserCourse] = useState<User_Course | undefined | null>(
    undefined
  );
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loadedSubject, setLoadedSubject] = useState<boolean>(false);
  const [initCourse, setInitCourse] = useState<boolean>(true);
  const [finisCourse, setFinishCourse] = useState<boolean>(true);
  const [tasksDetail, setTasksDetail] = useState<TaskActivityDetail[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [selected, setSelected] = useState<number | undefined>(0);
  const id_user = user?.id!;

  useEffect(() => {
    const updateData = async () => {
      const _index = props.searchParams.index;

      let userCourse = await getUserCourseByUserId(id_user);
      const notinit = isUserCourseNotInit(userCourse);
      const completed = isUserCourseCompleted(userCourse);
      const isTeacher = user?.type === TEACHER;
      setInitCourse(!notinit);
      setFinishCourse(completed);
      if (notinit || completed || isTeacher) {
        setLoaded(true);
        return;
      }

      const _subjects = await getSubjects();
      const courseLastItemIndex = _subjects.length - 1;

      const _progress =
        userCourse?.progress! > courseLastItemIndex
          ? courseLastItemIndex
          : userCourse?.progress!;

      const _subject = _subjects[_progress];
      const id_subject = _index ? +_index : _subject.id;

      const _activities = await getActivitiesBySubject(id_subject);

      const tasks = await getTasksByUserId(id_user);
      const _tasksDetail = getTasksActivityDetail(
        _activities,
        tasks,
        _subjects
      );

      setSubjects(_subjects);
      setTasksDetail(_tasksDetail);
      setProgress(_progress);
      setSelected(id_subject);
      setUserCourse(userCourse);
      setLoadedSubject(true);
      setLoaded(true);
    };
    updateData();
  }, []);

  if (user?.type === TEACHER) return <NotAllowed />;

  const HandleClickLink = async (id_subject: number, value_subject: number) => {
    setLoadedSubject(false);
    let user_course = await getUserCourseByUserId(id_user);
    const notinit = isUserCourseNotInit(userCourse);
    const completed = isUserCourseCompleted(userCourse);
    setInitCourse(!notinit);
    setFinishCourse(completed);
    if (notinit || completed || !user_course) {
      setLoadedSubject(true);
      return;
    }

    //const _subjects = await getSubjects();
    const _activities = await getActivitiesBySubject(id_subject);
    const tasks = await getTasksByUserId(id_user);
    const _tasksDetail = getTasksActivityDetail(
      _activities,
      tasks,
      subjects
    ).filter((t) => t.id_subject === id_subject);

    if (value_subject > user_course?.progress) {
      user_course = await saveUserCourse({
        ...user_course,
        progress: value_subject,
        date_update: new Date(),
      });
    } else {
      value_subject = user_course.progress;
    }
    //setSubjects(_subjects);
    setTasksDetail(_tasksDetail);
    setProgress(value_subject);
    setSelected(id_subject);
    setUserCourse(user_course);
    setLoadedSubject(true);
  };

  return loaded ? (
    <div className="flex items-start justify-center w-full px-16 py-8 gap-6">
      {initCourse && !finisCourse ? (
        <>
          <div className=" w-1/3 h-max" style={{ height: "300px" }}>
            <CourseContentItems
              interactive
              progress={progress}
              selected={selected}
              inprogress={initCourse}
              subjects={subjects}
              onClickLink={HandleClickLink}
            />
          </div>
          <div className=" w-2/3 ">
            {loadedSubject ? (
              <ClassItem
                tasksDetail={tasksDetail}
                userCourse={userCourse}
                subject={subjects.find((s) => s.id === selected)}
                noActivities={
                  !tasksDetail?.some((t) => t.id_subject === selected)
                }
              />
            ) : (
              <div style={{ height: 460 }}>
                <LoadingGeneric />
              </div>
            )}
          </div>
        </>
      ) : finisCourse ? (
        <FinishCourse />
      ) : (
        <NotInitCourse />
      )}
    </div>
  ) : (
    <div style={{ height: 460 }}>
      <LoadingGeneric />
    </div>
  );
}
