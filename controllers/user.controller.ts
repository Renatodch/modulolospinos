"use server";

import { User } from "@/model/types";
import { prisma } from "../prisma/prisma";
import { deleteScoresByUserId } from "./score.controller";
import { deleteTasksByUserId } from "./task.controller";
import {
  deleteUserCoursesByUserId,
  getUserCourseByUserId,
} from "./user-course.controller";

export const loginUserById = async (id: number, password: string) => {
  try {
    const res = await prisma.user.findFirst({
      where: {
        id,
        password,
      },
    });
    if (res) {
      return res;
    }
  } catch (e) {}
};
export const loginUserByEmail = async (email: string, password: string) => {
  try {
    const res = await prisma.user.findFirst({
      where: {
        email: `${email}`,
        password,
      },
    });
    if (res) {
      return res;
    }
  } catch (e) {}
};

export const saveUser = async (user: User) => {
  const { id, ...data } = user;
  try {
    const res =
      id === 0
        ? await prisma.user.create({
            data,
          })
        : await prisma.user.update({
            where: {
              id,
            },
            data: data,
          });

    return res;
  } catch (e) {}
};

export const getUsers = async () => {
  let res: User[] = [];
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        id: "asc",
      },
    });
    res = users;
  } catch (e) {}
  return res;
};

export const deleteUserById = async (id: number) => {
  try {
    let user: User | undefined;
    const user_course = await getUserCourseByUserId(id);
    if (user_course) {
      await deleteUserCoursesByUserId(id);
      await deleteTasksByUserId(id);
      await deleteScoresByUserId(id);
    }
    user = await prisma.user.delete({
      where: {
        id,
      },
    });

    return user;
  } catch (e) {}
};

export const getUserById = async (id?: number) => {
  try {
    const res = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return res;
  } catch (e) {}
};

export const getUserByEmail = async (email: string) => {
  try {
    const res = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (res) {
      return res;
    }
  } catch (e) {}
};
