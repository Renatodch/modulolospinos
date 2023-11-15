import AnswerList from "@/components/answerList";
import { getActivitiesAnswer } from "@/controllers/activity.controller";
import { getTasks } from "@/controllers/task.controller";

import { loginIsRequiredServer } from "@/lib/auth-config";
import { ANSWER, QuestionAnswers } from "@/model/types";

const QuestionPage = async () => {
  await loginIsRequiredServer();
  const activities = await getActivitiesAnswer();
  const tasks = await getTasks(ANSWER);
  const questionAnswers: QuestionAnswers[] = activities.map((a) => {
    return {
      title: a.title,
      question: a.description,
      answers: tasks,
    };
  });
  return (
    <div className="flex flex-col items-center justify-center w-full py-8 px-16">
      <div className="flex flex-col items-center justify-center w-full">
        <AnswerList questionAnswers={questionAnswers} />
      </div>
    </div>
  );
};

export default QuestionPage;
