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
  state: number;
  tryouts: number | null;
  progress: number;
  id_user: number | null;
}
export interface Project {
  id: number;
  title: string;
  description: string | null;
  image1: string | null;
  image2: string | null;
  date_upload: Date;
  projectscore: number | null;
  state: number;
  id_user: number | null;
}
