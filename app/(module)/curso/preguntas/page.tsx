import ActivityQuestionList from "@/components/activityQuestionList";
import { getActivitiesQuestion } from "@/controllers/activity.controller";

import { loginIsRequiredServer } from "@/lib/auth-config";

const QuestionPage = async () => {
  await loginIsRequiredServer();
  const activities = await getActivitiesQuestion();
  return (
    <div className="flex flex-col items-center justify-center w-full py-8 px-16">
      <div className="flex flex-col items-center justify-center w-full">
        <ActivityQuestionList activities={activities} />
      </div>
    </div>
  );
};

export default QuestionPage;
