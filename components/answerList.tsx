"use client";
import { useUserContext } from "@/app/context";
import { getDateString } from "@/lib/date-lib";
import {
  MIN_NOTE_APPROVED,
  NO_DATE_MAX_MESSAGE_TASK,
  PRIMARY_COLOR,
  QuestionAnswers,
  SUBJECTS_COURSE,
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
      {questionAnswers.map((p: QuestionAnswers, index: number) => (
        <div key={index} style={{ minWidth: "440px", maxWidth: "440px" }}>
          <div className="flex justify-between items-start mb-6">
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
            <div className="flex flex-col w-1/2">
              <p className="w-full text-xs italic">
                {
                  <>
                    <strong>Tema al que pertenece:&nbsp;</strong>
                    {SUBJECTS_COURSE.find((s) => s.value === p.subject)?.title}
                  </>
                }
              </p>
              <p className="w-full text-xs italic">
                {p.date_max ? (
                  <>
                    <strong>Fecha de vencimiento:&nbsp;</strong>
                    {getDateString(p.date_max)}
                  </>
                ) : (
                  NO_DATE_MAX_MESSAGE_TASK
                )}
              </p>
            </div>
          </div>
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
                className="w-full flex  items-center shadow-gray-400 shadow-lg rounded-xl"
              >
                <div className="w-full flex-col justify-center items-center">
                  <div className="flex justify-between">
                    <div className="text-xs italic p-4 flex flex-col">
                      <span>
                        <strong>Estudiante:&nbsp;</strong> {a.student}
                      </span>
                      <span>
                        <strong>id:&nbsp;</strong> {a.id_user}
                      </span>
                    </div>
                    <div className="text-xs italic p-4 w-1/2">
                      <span
                        className={`${
                          p.date_max && a.date_upload > p.date_max
                            ? "text-red-600"
                            : "text-black"
                        }`}
                      >
                        {getDateString(a.date_upload)}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4 pb-2  w-full p-4">{a.description}</div>

                  <hr
                    style={{ borderColor: PRIMARY_COLOR }}
                    className="border-3"
                  />
                  <div className="w-full flex justify-between items-center p-4">
                    {a.score === null && <p className="text-base">Pendiente</p>}
                    {a.score !== null && a.score !== undefined && (
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
      ))}
    </div>
  );
};

export default AnswerList;
