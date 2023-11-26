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
  NOT_INIT,
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
  const [loadedSubject, setLoadedSubject] = useState<boolean>(false);
  const [initCourse, setInitCourse] = useState<boolean>(true);
  const [tasksDetail, setTasksDetail] = useState<TaskActivityDetail[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [selected, setSelected] = useState<number | undefined>(0);
  const id_user = user?.id!;

  useEffect(() => {
    const updateData = async () => {
      const _index = props.searchParams.index;

      let userCourse = await getUserCourseByUserId(id_user);
      setInitCourse(!(!userCourse || userCourse.state === NOT_INIT));

      const _progress = userCourse?.progress!;
      const _subjects = await getSubjects();
      const value_subject = _subjects.findIndex(
        (s, index) => index === _progress
      );
      const _subject = _subjects[value_subject];
      const id_subject = _subject?.id;

      const _activities = id_subject
        ? await getActivitiesBySubject(_index ? +_index : id_subject)
        : [];
      const tasks = await getTasksByUserId(id_user);
      const _tasksDetail = getTasksActivityDetail(
        _activities,
        tasks,
        _subjects
      );

      setSubjects(_subjects);
      setTasksDetail(_tasksDetail);
      setProgress(value_subject);
      setSelected(_index ? +_index : id_subject);
      setUserCourse(userCourse);
      setLoaded(true);
      setLoadedSubject(true);
    };
    updateData();
  }, []);

  if (user?.type === TEACHER) return <NotAllowed />;

  const HandleClickLink = async (id_subject: number, value_subject: number) => {
    setLoadedSubject(false);
    let userCourse = await getUserCourseByUserId(id_user);
    if (!userCourse || user_course?.state === NOT_INIT) return;

    setSelected(id_subject);
    //const _subjects = await getSubjects();
    const activities = await getActivitiesBySubject(id_subject);
    const tasks = await getTasksByUserId(id_user);
    const _tasksDetail = getTasksActivityDetail(
      activities,
      tasks,
      subjects
    ).filter((t) => t.id_subject === id_subject);

    if (value_subject > userCourse?.progress) {
      userCourse = await saveUserCourse({
        ...userCourse,
        progress: value_subject,
        date_update: new Date(),
      });
    } else {
      value_subject = userCourse.progress;
    }
    //setSubjects(_subjects);
    setTasksDetail(_tasksDetail);
    setProgress(value_subject);
    setUserCourse(userCourse);
    setLoadedSubject(true);
  };

  const loader = (
    <PuffLoader
      color={PRIMARY_COLOR}
      loading={!(loaded && loadedSubject)}
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
              inprogress={true}
              subjects={subjects}
              onClickLink={HandleClickLink}
            />
          </div>
          {loadedSubject ? (
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
          ) : (
            <div
              className="w-2/3 flex justify-center items-center"
              style={{ height: "500px" }}
            >
              {loader}
            </div>
          )}
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
