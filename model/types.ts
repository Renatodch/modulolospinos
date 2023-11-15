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
  state: number;
  progress: number;
  average: number | null;
  id_user: number | null;
}
export interface Activity {
  id: number;
  title: string;
  description: string;
  rubric: string | null;
  subject: number;
  type: number;
  date_max: Date | null;
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

export interface TaskActivityDetail {
  done: boolean;
  id_activity: number;
  subject: number;
  activity_title: string;
  activity_description: string | null;
  activity_type: number;
  date_max: Date | null;
  date_upload: Date | null;
  evaluated: boolean;
  score?: number | null;
  rubric?: string | null;
}

export interface User_Progress {
  id: number | null;
  state: number;
  avgFinal: number | null;
}
export interface QuestionAnswers {
  title: string;
  question: string;
  answers: Task[];
}

export const REPROVED = 2;
export const APPROVED = 1;
export const IN_PROGRESS = 0;
export const NOT_INIT = -1;

export const USER_PROGRESS = [
  { value: NOT_INIT, label: "NO INICIADO" },
  { value: IN_PROGRESS, label: "EN PROGRESO" },
  { value: 1, label: "COMPLETO EVALUADO" },
];

export const PRIMARY_COLOR = "#98bf64";
export const APPROVED_COLOR_CLASS = "text-blue-600";
export const REPROVED_COLOR_CLASS = "text-red-600";

export const MIN_NOTE_APPROVED = 10.5;
export const COURSE_LAST_ITEM_INDEX = 4;
export const COURSE_ITEMS_LENGHT = 5;
export const COMPLETED = 1;
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
    weight: 10,
  },
  {
    title: "Introducción a fracciones",
    value: 1,
    url: "https://www.youtube.com/embed/grlbI4ZgzXA?si=cwo501nM1bxquX2R",
    description: "Descripcion del video 2",
    weight: 10,
  },
  {
    title: "Suma y resta de fracciones con denominadores comunes",
    value: 2,
    url: "https://www.youtube.com/embed/qJtoI1ipxs8?si=3lhYpUKrMrkFhmtb",
    description: "Descripcion del video 3",
    weight: 25,
  },
  {
    title: "Suma y resta de fracciones con denominadores diferentes",
    value: 3,
    url: "https://www.youtube.com/embed/Ew9yAW7bf7U?si=xU_jO-6wOf2_5jTF",
    description: "Descripcion del video 4",
    weight: 20,
  },
  {
    title: "Seccion final",
    value: 4,
    url: "",
    description:
      "En hora buena!, has llegado al final del curso. A continuación tendrás que resolver las actividades final aplicando todo lo aprendido",
    weight: 35,
  },
];

export const TOAST_USER_DELETE_SUCCESS = "Usuario borrado con éxito";
export const TOAST_USER_SAVE_SUCCESS = "Usuario guardado con éxito";

export const TOAST_TASK_EVALUATED = "Se calificó la tarea";
export const TOAST_PROJECT_SAVE_SUCCESS = "Proyecto subido con éxito";
export const TOAST_ANSWER_SAVE_SUCCESS = "Se envió su respuesta";

export const TOAST_ACTIVITY_DELETE_SUCCESS = "Actividad borrada con éxito";
export const TOAST_ACTIVITY_SAVE_SUCCESS = "Actitividad guardada con éxito";

export const TOAST_BD_ERROR = "Ocurrió un error con la operación";

export const TOAST_TASKS_PENDING =
  "Tiene tareas pendientes para las siguientes actividades";
export const TOAST_USER_COURSE_NOT_STARTED =
  "El estudiante aun no inicia el curso";
export const TOAST_USER_COURSE_SAVE_NOTE_NOT_CHANGE =
  "No hubieron cambios en el promedio";
export const TOAST_USER_COURSE_SAVE_NOTE_SUCCESS =
  "Se calculó el promedio con éxito";
export const getToastPendingProject = (date?: Date | null) =>
  `Tiene pendiente el envio de su proyecto hasta el día ${getDateString(date)}`;
