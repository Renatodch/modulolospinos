import ActivityQuestionItem from "@/components/activityQuestionItem";
import ErrorData from "@/components/errorData";
import { getActivityById } from "@/controllers/activity.controller";
import { getSubjectById } from "@/controllers/subject.controller";
import { getTasks, getTasksByUserId } from "@/controllers/task.controller";
import { getUsers } from "@/controllers/user.controller";
import { getSession, loginIsRequiredServer } from "@/lib/auth-config";
import { getStudents } from "@/lib/utils";
import {
  Answer,
  QUESTION,
  QuestionAnswers,
  STUDENT,
  Task,
  User,
} from "@/model/types";

const ActivityQuestionPage = async (props: any) => {
  await loginIsRequiredServer();
  const { _user } = await getSession();

  const id = +(props.params.activity || 0);
  const type = _user?.type!;

  const activity = await getActivityById(id);
  const subject = await getSubjectById(activity?.id_subject ?? undefined);

  if (activity) {
    let users: User[] = [];
    let tasks: Task[] = [];
    if (type === STUDENT) {
      tasks = await getTasksByUserId(_user?.id!, QUESTION);
      users.push(_user!);
    } else {
      tasks = await getTasks(QUESTION);
      const res = await getUsers();
      users = getStudents(res);
    }

    const answers: Answer[] = [];
    tasks.forEach((t) => {
      const user = users.find((u) => u.id === t.id_user);

      t.id_activity === activity?.id &&
        answers.push({
          ...t,
          user_name: user?.name,
        });
    });

    const questionAnswers: QuestionAnswers = {
      activity_title: activity.title,
      activity_description: activity.description,
      activity_id: activity.id,
      subject_title: subject?.title,
      date_max: activity.date_max,
      activity_rubric: activity.rubric ?? [],
      answers,
    };

    return <ActivityQuestionItem questionAnswers={questionAnswers} />;
  } else {
    return <ErrorData msg="La actividad no existe" />;
  }
};

export default ActivityQuestionPage;
