"use client";
import { MIN_SCORE_APPROVED, Task, isTeacher } from "@/model/types";
import TaskFormEval from "./taskFormEval";

const TaskEvalDetail = ({
  task,
  type,
  isrubric,
}: {
  task: Task;
  type: number;
  isrubric: boolean;
}) => {
  return (
    <div className="flex flex-col w-full">
      <div className="w-full flex justify-between items-center p-4">
        {task?.score === null && <p className="text-base">Pendiente</p>}
        {task?.score !== null && task?.score !== undefined && (
          <p
            className={`${
              task?.score >= MIN_SCORE_APPROVED
                ? "text-blue-600"
                : "text-red-600"
            } text-base`}
          >
            {task?.score}/20
          </p>
        )}
        {isTeacher(type) && task && (
          <TaskFormEval target={task as Task} isrubric={isrubric} />
        )}
      </div>
      {task?.comment && (
        <div className="w-full p-4">
          <span>
            <strong>Comentario:&nbsp;</strong>
            {task?.comment}
          </span>
        </div>
      )}
    </div>
  );
};

export default TaskEvalDetail;
