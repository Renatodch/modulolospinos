import AnswerList from "@/components/answerList";
import { getActivitiesAnswer } from "@/controllers/activity.controller";
import { getTasks } from "@/controllers/task.controller";
import { getUsers } from "@/controllers/user.controller";

import { loginIsRequiredServer } from "@/lib/auth-config";
import { getStudents } from "@/lib/utils";
import { ANSWER, Answer, QuestionAnswers } from "@/model/types";

const QuestionPage = async () => {
  await loginIsRequiredServer();
  const activities = await getActivitiesAnswer();
  const tasks = await getTasks(ANSWER);
  const res = await getUsers();
  const users = getStudents(res);

  const questionAnswers: QuestionAnswers[] = [];
  activities.forEach((a) => {
    const answers: Answer[] = [];
    tasks.forEach((t) => {
      if (a.id === t.id_activity) {
        const user = users.find((u) => u.id === t.id_user);
        const student = user?.name;
        answers.push({
          ...t,
          student,
        });
      }
    });
    questionAnswers.push({
      title: a.title,
      question: a.description,
      date_max: a.date_max,
      subject: a.subject,
      answers,
    });
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
