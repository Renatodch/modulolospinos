"use client";
import {
  MIN_SCORE_APPROVED,
  PRIMARY_COLOR,
  Task,
  isTeacher,
} from "@/model/types";
import TaskFormEval from "./taskFormEval";

const TaskEvalDetail = ({ task, type }: { task: Task; type: number }) => {
  return (
    <>
      <hr style={{ borderColor: PRIMARY_COLOR }} className="border-3" />
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
        {isTeacher(type) && task && <TaskFormEval target={task as Task} />}
      </div>
      {task?.comment && (
        <div className="w-full p-4">
          <span>
            <strong>Comentario:&nbsp;</strong>
            {task?.comment}
          </span>
        </div>
      )}
    </>
  );
};

export default TaskEvalDetail;
