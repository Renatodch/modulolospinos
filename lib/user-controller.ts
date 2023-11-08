"use server";
import { User, User_Course } from "@/types/types";
import { prisma } from "../prisma/prisma";
import { deleteProjectsByUserId } from "./project-controller";

export const saveUser = async (user: User) => {
  const data = {
    name: user.name || "",
    password: user.password,
    type: user.type,
    email: user.email || "",
  };
  try {
    const res =
      user.id === 0
        ? await prisma.usuario.create({
            data,
          })
        : await prisma.usuario.update({
            where: {
              id: +user.id,
            },
            data: data,
          });

    return res;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const getUsers = async () => {
  let res: User[] = [];
  try {
    const users = await prisma.usuario.findMany({
      orderBy: {
        id: "asc",
      },
    });
    res = users;
  } catch (e) {
    console.log("Error: ", e);
  }
  return res;
};

export const deleteUserById = async (id: number) => {
  try {
    let user: User | undefined;
    const user_course = await getUserCourseByUserId(id);
    if (user_course) {
      const user_courses = await deleteUserCoursesByUserId(id);
      const projects = await deleteProjectsByUserId(id);

      user_courses.count > 0 &&
        projects.count > 0 &&
        (user = await prisma.usuario.delete({
          where: {
            id,
          },
        }));
    } else {
      user = await prisma.usuario.delete({
        where: {
          id,
        },
      });
    }

    return user;
  } catch (e) {}
};
export const deleteUserCoursesByUserId = async (id_user: number) => {
  const user_courses = await prisma.usuario_curso.deleteMany({
    where: {
      id_user,
    },
  });

  return user_courses;
};

export const getUserById = async (id: number) => {
  try {
    const res = await prisma.usuario.findUnique({
      where: {
        id,
      },
    });
    return res;
  } catch (e) {}
};

export const getUserByEmail = async (email: string) => {
  try {
    const res = await prisma.usuario.findFirst({
      where: {
        email,
      },
    });

    if (res) {
      return res;
    }
  } catch (e) {}
};

export const getUserCourseByUserId = async (id_user: number | null) => {
  try {
    const res = await prisma.usuario_curso.findFirst({
      where: {
        id_user,
      },
    });
    return res;
  } catch (e) {}
};

export const getUserCourses = async () => {
  let usuario_curso: User_Course[] = [];
  try {
    const res = await prisma.usuario_curso.findMany({
      where: {
        state: 0,
      },
      distinct: ["id_user"],
    });
    usuario_curso = res;
  } catch (e) {}
  return usuario_curso;
};

export const getCurrentNumberUserCourses = async () => {
  let num = 0;
  try {
    const res = await prisma.usuario_curso.findMany({
      where: {
        state: 0,
      },
      distinct: ["id_user"],
    });
    num = res.length;
  } catch (e) {}
  return num;
};

export const saveUserCourse = async (user_course: User_Course) => {
  const { id, ...data } = { ...user_course };
  try {
    const res =
      id === 0
        ? await prisma.usuario_curso.create({
            data,
          })
        : await prisma.usuario_curso.update({
            where: {
              id,
            },
            data,
          });
    return res;
  } catch (e) {
    console.log("Error: ", e);
  }
};
