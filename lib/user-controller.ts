"use server";
import { User, User_Course } from "@/types/types";
import { prisma } from "../prisma/prisma";

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
        ? prisma.usuario.create({
            data,
          })
        : prisma.usuario.update({
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
    res = [...users];
  } catch (e) {
    console.log("Error: ", e);
  }
  return res;
};

export const deleteUserById = async (id: number) => {
  try {
    let user: User | undefined;
    const user_course = await prisma.usuario_curso.findFirst({
      where: {
        id_user: id,
      },
    });
    if (user_course) {
      const user_course = await prisma.usuario_curso.deleteMany({
        where: {
          id_user: id,
        },
      });
      user_course.count > 0 &&
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

export const getUserCourseByUserId = async (id_user: number) => {
  try {
    const res = await prisma.usuario_curso.findFirst({
      where: {
        id_user,
      },
    });
    return res;
  } catch (e) {}
};

export const saveUserCourse = async (user_course: User_Course) => {
  const { id, ...data } = { ...user_course };
  try {
    const res =
      id === 0
        ? prisma.usuario_curso.create({
            data,
          })
        : prisma.usuario_curso.update({
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
