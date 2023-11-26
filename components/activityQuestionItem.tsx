"use client";
import { useUserContext } from "@/app/context";
import { getDateString } from "@/lib/date-lib";
import { NO_DATE_MAX_MESSAGE_TASK, QuestionAnswers, Task } from "@/model/types";
import { ScrollArea } from "@radix-ui/themes";
import Rubric from "./rubric";
import RubricLink from "./rubricLink";
import TaskEvalDetail from "./taskEvalDetail";
const ActivityQuestionItem = ({
  questionAnswers,
}: {
  questionAnswers: QuestionAnswers;
}) => {
  const { user } = useUserContext();
  const titleClases = "font-bold uppercase text-lg text-left mt-4 mb-2 italic";
  return (
    <div className="w-full px-12">
      <div className="w-full pt-8 pb-2 flex flex-col items-start justify-start mb-4 italic text-md">
        <div className="flex flex-col">
          <span className={titleClases}>Datos de la actividad</span>
          <span>
            <strong>Título: &nbsp;</strong> {questionAnswers?.activity_title}
          </span>
          <span>
            <strong>Descripcion: &nbsp;</strong>{" "}
            {questionAnswers?.activity_description}
          </span>
          <span>
            <strong>iD: &nbsp;</strong> {questionAnswers?.activity_id}
          </span>
          <span>
            <strong>Tema al que pertenece: &nbsp;</strong>
            {questionAnswers?.subject_title}
          </span>
          {questionAnswers.date_max ? (
            <span>
              <strong className="text-black">
                Fecha de vencimiento: &nbsp;
              </strong>
              {getDateString(questionAnswers?.date_max)}
            </span>
          ) : (
            <span>
              <strong>{NO_DATE_MAX_MESSAGE_TASK}</strong>
            </span>
          )}
          <RubricLink url={questionAnswers.rubric} />
        </div>
      </div>
      <hr className="border-gray-400" />
      <p className={titleClases}>
        {questionAnswers.answers.length > 1 ? "Respuestas" : "Respuesta"}
      </p>

      <ScrollArea
        type="always"
        scrollbars="vertical"
        className="px-4 mt-8"
        style={{ maxHeight: "500px" }}
      >
        {questionAnswers.answers.map((a) => {
          return (
            <div
              key={a.id}
              className="flex items-center shadow-gray-400 shadow-md rounded-xl w-full mb-4"
            >
              <div className="w-full flex-col justify-center items-center">
                <div className="flex w-full justify-between">
                  <div className="text-xs italic p-4 flex flex-col">
                    <span>
                      <strong>Estudiante:&nbsp;</strong> {a.user_name}
                    </span>
                    <span>
                      <strong>id:&nbsp;</strong> {a.id_user}
                    </span>
                  </div>
                  <div className="text-xs italic p-4 ">
                    <span
                      className={`${
                        questionAnswers.date_max &&
                        a.date_upload > questionAnswers.date_max
                          ? "text-red-600"
                          : "text-black"
                      }`}
                    >
                      {getDateString(a.date_upload)}
                    </span>
                  </div>
                </div>
                <div className="mb-4 pb-2  w-full p-4">{a.description}</div>

                <TaskEvalDetail type={user?.type!} task={a as Task} />
              </div>
            </div>
          );
        })}
      </ScrollArea>
      {questionAnswers.rubric && (
        <Rubric titleClases={titleClases} rubric={questionAnswers.rubric} />
      )}
    </div>
  );
};

export default ActivityQuestionItem;
