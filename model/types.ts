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
  date_start: Date;
  date_update: Date;
  date_project_assigned: Date | null;
  date_project_send_max: Date | null;
  state: number;
  progress: number;
  id_user: number | null;
}
export interface Activity {
  id: number;
  title: string;
  description: string;
  rubric: string | null;
  subject: number;
  type: number;
  id_user: number | null;
}
export interface Task {
  id: number;
  title: string;
  description: string | null;
  image1: string | null;
  date_upload: Date;
  score: number | null;
  comment: string | null;
  type: number;
  id_activity: number | null;
  id_user: number | null;
}

export interface TaskDone {
  done: boolean;
  id_activity: number;
}

export interface QuestionAnswers {
  title: string;
  question: string;
  answers: Task[];
}

export type REPROVED = 2;
export type APPROVED = 1;
export type IN_PROGRESS = 0;

export const PRIMARY_COLOR = "#98bf64";

export const MIN_NOTE_APPROVED = 10.5;
export const COURSE_LAST_ITEM_INDEX = 4;
export const COURSE_ITEMS_LENGHT = 5;
export const PROJECT_REPROVED = 2;
export const PROJECT_APPROVED = 1;
export const PROJECT_PENDING = 0;
export const COURSE_REPROVED = 2;
export const COURSE_APPROVED = 1;
export const COURSE_IN_PROCESS = 0;
export const DEVELOPER = 2;
export const TEACHER = 1;
export const STUDENT = 0;
export const PROJECT = 1;
export const ANSWER = 0;

export function isStudent(type: number | null | undefined) {
  const _type = type || STUDENT;
  return _type === STUDENT || _type === DEVELOPER;
}
export function isTeacher(type: number | null | undefined) {
  const _type = type || STUDENT;
  return _type === TEACHER || _type === DEVELOPER;
}

export const ACTIVITY_TYPES = [
  { name: "Proyecto", value: 1 },
  { name: "Pregunta", value: 0 },
];
export const SUBJECTS_COURSE = [
  {
    title: "Qué es una fracción",
    value: 0,
    url: "https://www.youtube.com/embed/g2rI5mAWPeU?si=gaIOzQXC2YIck04Q",
    description: "Descripcion del video 1",
  },
  {
    title: "Introducción a fracciones",
    value: 1,
    url: "https://www.youtube.com/embed/grlbI4ZgzXA?si=cwo501nM1bxquX2R",
    description: "Descripcion del video 2",
  },
  {
    title: "Suma y resta de fracciones con denominadores comunes",
    value: 2,
    url: "https://www.youtube.com/embed/qJtoI1ipxs8?si=3lhYpUKrMrkFhmtb",
    description: "Descripcion del video 3",
  },
  {
    title: "Suma y resta de fracciones con denominadores diferentes",
    value: 3,
    url: "https://www.youtube.com/embed/Ew9yAW7bf7U?si=xU_jO-6wOf2_5jTF",
    description: "Descripcion del video 4",
  },
  {
    title: "Seccion final",
    value: 4,
    url: "",
    description: "",
  },
];

export const TOAST_USER_DELETE_SUCCESS = "Usuario borrado con éxito";
export const TOAST_USER_SAVE_SUCCESS = "Usuario guardado con éxito";
export const TOAST_PROJECT_EVALUATED = "Se calificó el proyecto";
export const TOAST_PROJECT_SAVE_SUCCESS = "Proyecto subido con éxito";
export const TOAST_ANSWER_SAVE_SUCCESS = "Se envió su respuesta";
export const TOAST_ACTIVITY_DELETE_SUCCESS = "Actividad borrada con éxito";
export const TOAST_ACTIVITY_SAVE_SUCCESS = "Actitividad guardada con éxito";
export const TOAST_BD_ERROR = "Ocurrió un error con la operación";
export const TOAST_PROJECT_PENDING = "Tiene pendiente subir un proyecto";

export const getToastPendingProject = (date?: Date | null) =>
  `Tiene pendiente el envio de su proyecto hasta el día ${getDateString(date)}`;
