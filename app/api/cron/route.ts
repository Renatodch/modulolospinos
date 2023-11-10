import { getProjectByUserId } from "@/lib/project-controller";
import { getUserCourses } from "@/lib/user-controller";
import {
  IN_PROGRESS,
  PROJECT_PENDING,
  PROJECT_REPROVED,
  REPROVED,
  User_Course,
} from "@/types/types";
import { NextResponse } from "next/server";
export async function GET() {
  const user_courses = await getUserCourses();
  const late_user_courses: User_Course[] = [];

  return NextResponse.json({ ok: true });

  /*   for (const uc of user_courses) {
    console.log("today: ", new Date());
    console.log("dateSendMax: ", uc.date_project_send_max);
    if (
      !uc.id_user ||
      uc.progress < COURSE_LAST_ITEM_INDEX ||
      uc.state > COURSE_IN_PROCESS
    )
      continue;

    const dateSendMax = uc?.date_project_send_max;
    const state = await EvaluateProjectByDate(uc.id_user, dateSendMax);
    if (state === COURSE_REPROVED) {
      const late = await saveUserCourse({ ...uc, state });
      late && late_user_courses.push(late);
    }
  }

  return NextResponse.json(late_user_courses); */
}

async function EvaluateProjectByDate(
  id_user: number,
  dateSendMax?: Date | null
): Promise<IN_PROGRESS | REPROVED> {
  if (!dateSendMax) return 0;

  const project = await getProjectByUserId(id_user);
  if (project) return 0;

  const today = new Date();

  return today > dateSendMax ? PROJECT_REPROVED : PROJECT_PENDING;
}
