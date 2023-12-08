import { getDateString } from "@/lib/date-lib";

export interface User {
  id: number;
  password: string;
  type: number;
  email: string;
  name: string;
}

export interface User_Course {
  id: number;
  date_start: Date | null;
  date_end: Date | null;
  date_update: Date | null;
  state: number;
  progress: number;
  average: number | null;
  id_user: number | null;
}
export interface Activity {
  id: number;
  title: string;
  description: string;
  type: number;
  date_max: Date | null;
  url: string | null;
  rubric: string[];
  id_subject: number | null;
}
export interface Score {
  id: number;
  activity: string | null;
  subject: string;
  value: number;
  order: number;
  id_user: number | null;
}
export interface Subject {
  id: number;
  title: string;
  description: string | null;
}
export interface Task {
  id: number;
  title: string | null;
  description: string | null;
  image1: string | null;
  date_upload: Date;
  score: number | null;
  scores: string[];
  comment: string | null;
  type: number;
  id_activity: number | null;
  id_user: number | null;
}
/*********************************************************************** */
export interface RubricDetail {
  title: string;
  maxPoints: number;
  items: RubricItemDetail[];
}
export interface RubricItemDetail {
  quality: Quality;
  descriptions: string[];
}
export interface ScoreRubricDetail {
  titleRubricDetail: string;
  value: number;
}
export interface TaskActivityDetail {
  done: boolean;
  id_task: number;
  id_activity: number;
  id_subject: number | null;
  value_subject: number;
  activity_title: string;
  activity_description: string | null;
  activity_type: number;
  date_max: Date | null;
  date_upload: Date | null;
  evaluated: boolean;
  score?: number | null;
  image?: string | null;
  task_title: string;
  activity_url: string | null;
  task_description: string | null;
  activity_rubric: string[];
}

export type Answer = Task & { user_name?: string };
export interface QuestionAnswers {
  activity_title: string;
  activity_description?: string;
  activity_id: number;
  subject_title?: string;
  date_max?: Date | null;
  activity_rubric: string[];
  answers: Answer[];
}

export interface ScoreActivityDetail {
  activity: string | null;
  score: number;
}
export interface ScoreSubjectDetail {
  id: number;
  activities: ScoreActivityDetail[];
  subject: string;
  order: number;
  id_user: number | null;
}

export const NOT_INIT = -1;
export const IN_PROGRESS = 0;

export const REPROVED = 2;
export const APPROVED = 1;

export const USER_PROGRESS = [
  { value: NOT_INIT, label: "NO INICIADO" },
  { value: IN_PROGRESS, label: "EN PROGRESO" },
  { value: APPROVED, label: "APROBADO" },
  { value: REPROVED, label: "REPROBADO" },
];

export const PRIMARY_COLOR = "#98bf64";

export const QUALITY_EXCELENT = "Excelente";
export const QUALITY_BAD = "Malo";
export const QUALITY_INSUFICIENT = "Insuficiente";
export type Quality = "Excelente" | "Malo" | "Insuficiente";

export const MIN_SCORE_APPROVED = 10.5;
export const COURSE_ITEMS_LENGHT = 5;
export const DEVELOPER = 2;
export const TEACHER = 1;
export const STUDENT = 0;
export const PROJECT = 1;
export const QUESTION = 0;
export const MIN_SCORE_BY_ITEM = 2;

export function isStudent(type: number | null | undefined) {
  return type === STUDENT || type === DEVELOPER;
}
export function isTeacher(type: number | null | undefined) {
  return type === TEACHER || type === DEVELOPER;
}
export function isAdmin(type: number | null | undefined) {
  return type === DEVELOPER;
}

export const ACTIVITY_TYPES = [
  { name: "Proyecto", value: PROJECT },
  { name: "Pregunta", value: QUESTION },
];

export const USER_TYPES = [
  { name: "Estudiante", value: STUDENT },
  { name: "Profesor", value: TEACHER },
  { name: "Administrador", value: DEVELOPER },
];

export const TOAST_USER_DELETE_ERROR_1 = "No puedes borrar tu usuario";
export const TOAST_USER_DELETE_SUCCESS = "Usuario borrado con éxito";
export const TOAST_USER_SAVE_SUCCESS = "Usuario guardado con éxito";
export const TOAST_USER_SAVE_ERROR_EMAIL = "El email ingresado ya existe";

export const TOAST_SUBJECT_DELETE_SUCCESS = "Tema borrado con éxito";
export const TOAST_SUBJECT_DELETE_ERROR_ACTIVITIES =
  "Tema no se puede borrar porque hay actividades que lo utilizan";
export const TOAST_SUBJECT_DELETE_ERROR_MIN =
  "Tema no se puede borrar porque debe haber al menos un tema en el curso";
export const TOAST_SUBJECT_SAVE_SUCCESS = "Tema guardado con éxito";

export const TOAST_TASK_EVALUATED = "Se evaluó la tarea";
export const TOAST_PROJECT_SAVE_SUCCESS = "Proyecto subido con éxito";
export const TOAST_PROJECT_SAVE_ERROR_1 =
  "Ya tiene un proyecto subido para esta actividad";
export const TOAST_PROJECT_SAVE_ERROR_IMAGE =
  "Ocurrió un error subiendo la image";

export const TOAST_ANSWER_SAVE_SUCCESS = "Se envió su respuesta";
export const TOAST_ANSWER_SAVE_ERROR_1 =
  "Ya tiene una respuesta subida para esta actividad";

export const TOAST_ACTIVITY_DELETE_ERROR =
  "Actividad no se puede borrar porque hay tareas hechas para ella";
export const TOAST_ACTIVITY_DELETE_SUCCESS = "Actividad borrada con éxito";
export const TOAST_ACTIVITY_SAVE_SUCCESS = "Actitividad guardada con éxito";
export const TOAST_RUBRIC_SAVE_SUCCESS = "Rúbrica guardada con éxito";
export const TOAST_SAVE_ERROR_RUBRIC = "Ocurrió un error subiendo la rúbrica";
export const TOAST_RUBRIC_SAVE_ERROR_POINTS =
  "Los puntos acumulados en la rúbrica no acumulan 20";

export const TOAST_BD_ERROR = "Ocurrió un error con la operación";

export const TOAST_COURSE_START_SUCCESS =
  "Inició el curso Fracciones para principiantes";
export const TOAST_COURSE_START_FAILED =
  "Falló en iniciar el curso Fracciones para principiantes";

export const getToastPendingTasksAlert = (len: number) => {
  const many = len > 1 ? "s" : "";
  return `Tiene ${len} tarea${many} pendiente${many}`;
};
//ALERTAS
export const TOAST_TASKS_PENDING =
  "Tiene tareas pendientes para las siguientes actividades";
export const TOAST_USER_COURSE_NOT_STARTED =
  "El usuario no ha iniciado el curso";
export const TOAST_USER_COURSE_NOT_COMPLETED =
  "El usuario aun no completa el curso, le faltan tareas o no esta al día con el tema";
export const TOAST_USER_COURSE_SAVE_SCORE_SUCCESS =
  "Se registró el promedio final con éxito";

export const TOAST_LOADING = "Subiendo...";
export const TOAST_DELETING = "Borrando...";
export const TOAST_VALIDATE_PROGRESS = "Validando progreso del estudiante...";

export const NO_DATE_MAX_MESSAGE_TASK =
  "No hay límite de tiempo para esta tarea";

export const getToastPendingActivities = (
  taskDetail: TaskActivityDetail,
  subjects: Subject[]
) =>
  `${ACTIVITY_TYPES.find((a) => a.value === taskDetail.activity_type)?.name} "${
    taskDetail.activity_title
  }" del tema "${
    subjects.find((s) => s.id === taskDetail.id_subject)?.title
  }" vence el dia ${getDateString(taskDetail.date_max)}`;

export const getFormatId = (id: number) => id.toString().padStart(4, "0");
export const DeleteUserTitle = "Eliminación de usuario";
export const DeleteUserStudentMessage = (id: number) =>
  `Estas seguro que deseas eliminar al estudiante ${getFormatId(id)}?`;
