import {
  APPROVED,
  Activity,
  IN_PROGRESS,
  NOT_INIT,
  REPROVED,
  RubricDetail,
  Score,
  ScoreRubricDetail,
  Subject,
  Task,
  TaskActivityDetail,
  User,
  User_Course,
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
  if (subjects.length === 0) return [];

  const activitySubjects: (Activity & { value_subject: number })[] = [];
  activities.forEach((a) => {
    const value_subject = subjects.findIndex((s) => s.id === a.id_subject);
    value_subject !== -1 && activitySubjects.push({ ...a, value_subject });
  });

  const _progress = progress ?? subjects.length - 1;
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
        activity_url: a.url,
        date_upload: task?.date_upload ?? null,
        date_max: a.date_max,
        evaluated: !(task?.score === null || task?.score === undefined),
        score: task?.score,
        image: task?.image1,
        task_title: task?.title ?? "",
        task_description: task?.description ?? null,
        activity_rubric: a.rubric,
      };
    });
  return tasksDetail;
};

export const getFormatedScore = (score: number) =>
  Number.isInteger(score)
    ? score.toString().padStart(2, "0")
    : score.toFixed(1);

export const getStudents = (users: User[]) =>
  users.filter((u) => isStudent(u.type));
export const getTeachers = (users: User[]) =>
  users.filter((u) => isTeacher(u.type));

export const isUserCourseNotInit = (
  user_course: User_Course | undefined | null
) => !!user_course && user_course.state === NOT_INIT;
export const isUserCourseInProgress = (
  user_course: User_Course | undefined | null
) => !!user_course && user_course.state === IN_PROGRESS;
export const isUserCourseCompleted = (
  user_course: User_Course | undefined | null
) =>
  !!user_course &&
  (user_course.state === APPROVED || user_course.state === REPROVED);
export const isUserCourseReproved = (
  user_course: User_Course | undefined | null
) => !!user_course && user_course.state === REPROVED;
export const isUserCourseApproved = (
  user_course: User_Course | undefined | null
) => !!user_course && user_course.state === APPROVED;

export const isUserCourseInit = (user_course: User_Course | undefined | null) =>
  !!user_course && user_course.state > NOT_INIT;

export const getScoreListSummary = (scores: Score[]) => {
  const valueSet = new Set<number>();
  const _scoreListSummary: Score[] = [];
  for (let score of scores) {
    if (!valueSet.has(score.order)) {
      valueSet.add(score.order);
      _scoreListSummary.push(score);
    }
  }
  return _scoreListSummary;
};

export const getScores = (scoresJson: string[]) => {
  const scores: ScoreRubricDetail[] = scoresJson.map((e) => JSON.parse(e));
  return scores.map((score: ScoreRubricDetail) => +score.value);
};
export const getScoreObjects = (scoresJson: string[]) =>
  scoresJson.map((e) => JSON.parse(e) as ScoreRubricDetail);
export const getRubricDetailObjects = (rubricJson: string[]) =>
  rubricJson.map((e) => JSON.parse(e) as RubricDetail);
