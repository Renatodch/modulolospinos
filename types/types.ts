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
  date_last_entry: Date;
  date_end: Date | null;
  date_project_assigned: Date | null;
  date_project_send_max: Date | null;
  state: number;
  progress: number;
  id_user: number | null;
}
export interface Project {
  id: number;
  title: string;
  description: string | null;
  image1: string | null;
  date_upload: Date;
  projectscore: number | null;
  comment: string | null;
  id_user: number | null;
}

export type REPROVED = 2;
export type APPROVED = 1;
export type IN_PROGRESS = 0;

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

export function isStudent(type: number | null | undefined) {
  const _type = type || STUDENT;
  return _type === STUDENT || _type === DEVELOPER;
}
export function isTeacher(type: number | null | undefined) {
  const _type = type || STUDENT;
  return _type === TEACHER || _type === DEVELOPER;
}

export const TOAST_USER_DELETE_SUCCESS = "Usuario borrado con éxito";
export const TOAST_USER_SAVE_SUCCESS = "Usuario guardado con éxito";
export const TOAST_PROJECT_EVALUATED = "Se calificó el proyecto";
export const TOAST_PROJECT_SAVE_SUCCESS = "Proyecto subido con éxito";
export const TOAST_BD_ERROR = "Ocurrió un error con la operación";
export const TOAST_PROJECT_PENDING = "Tiene pendiente subir un proyecto";

export const getToastPendingProject = (date?: Date | null) =>
  `Tiene pendiente el envio de su proyecto hasta el día ${getDateString(date)}`;
