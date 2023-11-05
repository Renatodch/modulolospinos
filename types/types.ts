export interface User {
  id: number;
  password: string;
  type: string;
  email: string;
  name: string;
}

export interface Project {
  id: number;
  title: string;
  description: string | null;
  image1: string | null;
  image2: string | null;
  date_update: Date;
  approved: boolean;
  projectscore: number | null;
  id_user: number | null;
}

export interface User_Course {
  id: number;
  date_start: Date;
  date_last_entry: Date;
  date_end: Date | null;
  progress: number;
  id_user: number | null;
}
