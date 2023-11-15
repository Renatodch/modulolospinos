"use client";
import { getDateString } from "@/lib/date-lib";
import { Activity, PROJECT, SUBJECTS_COURSE, TaskDone } from "@/model/types";
import { ScrollArea } from "@radix-ui/themes";
import AnswerForm from "./answerForm";
import ProjectForm from "./projectForm";

interface Props {
  item: number;
  activities?: Activity[] | null;
  maxDateToSend?: Date;
  dateAssigned?: Date;
  tasksDone?: TaskDone[];
}
const ClassItem = ({
  item,
  activities,
  maxDateToSend,
  dateAssigned,
  tasksDone,
}: Props) => {
  const subject = SUBJECTS_COURSE[item];
  return (
    <ScrollArea
      className="px-3 py-3 shadow-sm shadow-gray-400"
      style={{ height: "560px" }}
      type="always"
      scrollbars="vertical"
    >
      <div
        style={{ height: "800px" }}
        className=" w-full   flex flex-col justify-center items-center "
      >
        <div className="font-semibold text-xl mb-2">{subject.title}</div>
        {subject.url && (
          <iframe
            style={{ width: "100%", height: "100%" }}
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
        <div className="font-semibold text-xl m-4">Actividades</div>

        {activities?.map((a, index) => (
          <div key={index} className="w-full">
            <TaskActivity
              isdone={tasksDone?.find((t) => t.id_activity === a.id)?.done}
              activity={a}
              maxDateToSend={maxDateToSend}
              dateAssigned={dateAssigned}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

const TaskActivity = ({
  activity,
  maxDateToSend,
  dateAssigned,
  isdone,
}: {
  activity: Activity;
  maxDateToSend?: Date;
  dateAssigned?: Date;
  isdone?: boolean;
}) => {
  return (
    <div className=" w-full flex flex-col justify-center items-center mb-4 pt-4 border-t-4">
      <div className=" font-semibold text-md w-full mb-2">{activity.title}</div>
      <div className=" w-full text-md mb-4">{activity.description}</div>
      <div className=" w-full flex  justify-end items-center ">
        {activity.type === PROJECT ? (
          <ProjectForm activity={activity} isdone />
        ) : (
          <AnswerForm activity={activity} isdone />
        )}
      </div>
      <div className=" w-full flex flex-col items-start text-xs ">
        <span>
          <strong>Fecha asignada:&nbsp;</strong>
          {getDateString(dateAssigned)}
        </span>
        <span>
          <strong>Fecha máxima:&nbsp;</strong>
          {getDateString(maxDateToSend)}
        </span>
      </div>
    </div>
  );
};

export default ClassItem;
