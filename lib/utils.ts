import {
  Activity,
  Subject,
  Task,
  TaskActivityDetail,
  User,
  isStudent,
  isTeacher,
} from "@/model/types";

export const getActivitySubjectDetail = () => {
  return;
};

export const getTasksActivityDetail = (
  activities: Activity[],
  tasks: Task[],
  subjects: Subject[],
  progress?: number
) => {
  const activitySubjects: (Activity & { value_subject: number })[] =
    activities.map((a) => {
      const value_subject = subjects.find((s) => s.id === a.id_subject)?.value!;
      return { ...a, value_subject };
    });
  const _progress = progress ?? subjects.length - 1; // COURSE_MAX_ITEM_INDEX
  const tasksDetail: TaskActivityDetail[] = activitySubjects
    .filter((a) => a.value_subject <= _progress)
    .map((a) => {
      const task = tasks.find((t) => t.id_activity === a.id);
      return {
        done: !!task,
        id_task: task?.id ?? 0,
        id_activity: a.id,
        id_subject: a.id_subject,
        value_subject: a.value_subject,
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

export const getFormatedNote = (note: number) =>
  Number.isInteger(note) ? note.toString().padStart(2, "0") : note.toFixed(1);

export const getStudents = (users: User[]) =>
  users.filter((u) => isStudent(u.type));
export const getTeachers = (users: User[]) =>
  users.filter((u) => isTeacher(u.type));
