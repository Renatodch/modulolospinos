"use client";
import { getDateString } from "@/lib/date-lib";
import {
  NO_DATE_MAX_MESSAGE_TASK,
  PROJECT,
  SUBJECTS_COURSE,
  TaskActivityDetail,
  User_Course,
} from "@/model/types";
import { ScrollArea } from "@radix-ui/themes";
import AnswerForm from "./answerForm";
import ProjectForm from "./projectForm";
import RubricLink from "./rubricLink";

interface Props {
  item: number;
  tasksDetail?: TaskActivityDetail[];
  userCourse?: User_Course | undefined | null;
}
const ClassItem = ({ item, tasksDetail, userCourse }: Props) => {
  const subject =
    SUBJECTS_COURSE.find((s) => s.value === item) || SUBJECTS_COURSE[0];
  const noActivities = !tasksDetail?.some((t) => t.subject === item);

  return (
    <ScrollArea
      className="px-3 py-3 shadow-sm shadow-gray-400"
      style={{ height: "560px" }}
      type="always"
      scrollbars="vertical"
    >
      <div className=" w-full   flex flex-col justify-start items-center ">
        <div className="w-full italic text-xs flex justify.end mb-4">
          <span>
            Empezó el curso el día {getDateString(userCourse?.date_start)}
          </span>
        </div>
        <div className="font-semibold text-xl mb-2">{subject.title}</div>
        {subject.url && (
          <iframe
            style={{ width: "100%", height: "350px" }}
            width="560"
            height="315"
            src={subject.url}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe>
        )}
        {subject.description && (
          <div className="m-4 w-full text-justify pr-2">
            {subject.description}
          </div>
        )}
        {!noActivities ? (
          <>
            <div className="font-semibold text-xl m-4">Actividades</div>

            {tasksDetail?.map((a, index) => (
              <div key={index} className="w-full">
                <TaskActivity task={a} />
              </div>
            ))}
          </>
        ) : (
          <span className="italic text-xl m-4">
            No existen actividades para este tema
          </span>
        )}
      </div>
    </ScrollArea>
  );
};

const TaskActivity = ({ task }: { task: TaskActivityDetail }) => {
  return (
    <div className=" w-full flex flex-col justify-center items-center mb-4 pt-4 border-t-4">
      <div className=" font-semibold text-md w-full mb-2">
        {task.activity_title}
      </div>
      <div className=" w-full text-md mb-4">{task.activity_description}</div>
      <div className=" w-full flex  justify-between items-center ">
        <RubricLink url={task.rubric} />
        <div>
          {task.activity_type === PROJECT ? (
            <ProjectForm taskActivityDetail={task} />
          ) : (
            <AnswerForm taskActivityDetail={task} />
          )}
        </div>
      </div>
      <div className=" w-full flex flex-col items-start text-xs ">
        <span>
          {task.date_max ? (
            <>
              <strong>Fecha de vencimiento:&nbsp;</strong>
              {getDateString(task.date_max)}
            </>
          ) : (
            <strong>{NO_DATE_MAX_MESSAGE_TASK}</strong>
          )}
        </span>
      </div>
    </div>
  );
};

export default ClassItem;
