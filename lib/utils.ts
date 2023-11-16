import {
  APPROVED_COLOR_CLASS,
  Activity,
  MIN_NOTE_APPROVED,
  REPROVED_COLOR_CLASS,
  Task,
  TaskActivityDetail,
} from "@/model/types";

export const getTasksActivityDetail = (
  activities: Activity[],
  tasks: Task[]
) => {
  const tasksDetail: TaskActivityDetail[] = activities.map((a) => {
    const task = tasks.find((t) => t.id_activity === a.id);
    return {
      done: !!task,
      id_task: task?.id ?? 0,
      id_activity: a.id,
      subject: a.subject,
      activity_title: a.title,
      activity_description: a.description,
      activity_type: a.type,
      date_upload: task?.date_upload ?? null,
      date_max: a.date_max,
      evaluated: !(task?.score === null || task?.score === undefined),
      score: task?.score,
      rubric: a.rubric,
      image: task?.image1,
      task_title: task?.title ?? "",
      task_description: task?.description ?? null,
    };
  });
  return tasksDetail;
};

export const getNoteColorClass = (score?: number | null) =>
  score != null && score != undefined && score >= MIN_NOTE_APPROVED
    ? APPROVED_COLOR_CLASS
    : REPROVED_COLOR_CLASS;
