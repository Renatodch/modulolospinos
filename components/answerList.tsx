"use client";
import { useUserContext } from "@/app/context";
import {
  MIN_NOTE_APPROVED,
  PRIMARY_COLOR,
  QuestionAnswers,
  Task,
  isTeacher,
} from "@/model/types";
import { Strong } from "@radix-ui/themes";
import TaskFormEval from "./taskFormEval";
const AnswerList = ({
  questionAnswers,
}: {
  questionAnswers: QuestionAnswers[];
}) => {
  const { user } = useUserContext();
  return (
    <div className="flex flex-wrap gap-16 w-full">
      {questionAnswers.map(
        (
          p: { title: string; question: string; answers: Array<Task> },
          index: number
        ) => (
          <div key={index} style={{ minWidth: "440px", maxWidth: "440px" }}>
            <p
              className="text-justify mt-4 mb-4"
              style={{
                display: "-webkit-box",
                textOverflow: "ellipsis",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                WebkitLineClamp: 1,
                height: "25px",
              }}
            >
              <Strong className="text-xl mb-4">{p.title}</Strong>
            </p>
            <p
              className=" border-b-4"
              style={{
                display: "-webkit-box",
                textOverflow: "ellipsis",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                WebkitLineClamp: 3,
                height: "72px",
              }}
            >
              {p.question}
            </p>
            <div className="border-b-4 py-4 mb-4 font-semibold">Respuestas</div>
            {p.answers.map((a) => {
              return (
                <div
                  key={a.id}
                  className="w-full flex  items-center border-4 rounded-xl"
                  style={{ borderColor: PRIMARY_COLOR }}
                >
                  <div className="w-full flex-col justify-center items-center">
                    <div className="mb-4 pb-2  w-full p-4">{a.description}</div>
                    <hr
                      style={{ borderColor: PRIMARY_COLOR }}
                      className="border-3"
                    />
                    <div className="w-full flex justify-between items-center p-4">
                      {a.score === null && (
                        <p className="text-base">Pendiente</p>
                      )}
                      {a.score && (
                        <p
                          className={`${
                            a.score >= MIN_NOTE_APPROVED
                              ? "text-blue-600"
                              : "text-red-600"
                          } text-base`}
                        >
                          {a.score}/20
                        </p>
                      )}
                      {isTeacher(user?.type) && (
                        <TaskFormEval target={a as Task} />
                      )}
                    </div>
                    {a.comment && (
                      <div className="w-full p-4">
                        <span>
                          <strong>Comentario:&nbsp;</strong>
                          {a.comment}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};

export default AnswerList;
