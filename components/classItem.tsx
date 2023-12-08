"use client";
import { getDateString } from "@/lib/date-lib";
import {
  NO_DATE_MAX_MESSAGE_TASK,
  PROJECT,
  Subject,
  TaskActivityDetail,
  User_Course,
} from "@/model/types";
import { ScrollArea } from "@radix-ui/themes";
import AnswerForm from "./answerForm";
import ProjectForm from "./projectForm";
import Rubric from "./rubric";

interface Props {
  tasksDetail?: TaskActivityDetail[];
  userCourse?: User_Course | undefined | null;
  subject: Subject | null | undefined;
  noActivities: boolean;
}
const ClassItem = ({
  tasksDetail,
  userCourse,
  subject,
  noActivities,
}: Props) => {
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
        <div className="font-semibold text-xl mb-2">{subject?.title}</div>
        {subject?.description && (
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
      <div className=" font-semibold text-md w-full mb-4">
        {task.activity_title}
      </div>
      {task?.activity_url && (
        <iframe
          style={{ width: "100%", height: "350px" }}
          width="560"
          height="315"
          src={task?.activity_url}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      )}

      <div className=" w-full text-md my-4">{task.activity_description}</div>
      <div className=" w-full flex  justify-between items-center ">
        {task.activity_rubric.length > 0 ? (
          <Rubric
            preview
            title="Rúbrica de Actividad"
            rubric={{ data: task.activity_rubric }}
          />
        ) : (
          <span className="text-center italic">Sin Rúbrica</span>
        )}
        <div>
          {task.activity_type === PROJECT ? (
            <ProjectForm taskActivityDetail={task} />
          ) : (
            <AnswerForm taskActivityDetail={task} />
          )}
        </div>
      </div>
      <div className=" w-full flex flex-col items-start text-xs mt-3">
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
