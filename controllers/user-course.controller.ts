"use server";
import { User_Course } from "@/model/types";
import { prisma } from "../prisma/prisma";

export const deleteUserCoursesByUserId = async (id_user: number) => {
  const user_courses = await prisma.user_course.deleteMany({
    where: {
      id_user,
    },
  });

  return user_courses;
};

export const getUserCourseByUserId = async (id_user: number | null) => {
  try {
    const res = await prisma.user_course.findFirst({
      where: {
        id_user,
      },
    });
    return res;
  } catch (e) {}
};

export const getUserCourses = async () => {
  let user_courses: User_Course[] = [];
  try {
    const res = await prisma.user_course.findMany({
      distinct: ["id_user"],
    });
    user_courses = res;
  } catch (e) {}
  return user_courses;
};

export const saveUserCourse = async (user_course: User_Course) => {
  const { id, ...data } = { ...user_course };
  try {
    const res =
      id === 0
        ? await prisma.user_course.create({
            data,
          })
        : await prisma.user_course.update({
            where: {
              id,
            },
            data,
          });
    return res;
  } catch (e) {}
};
