"use server";

import { Task } from "@/model/types";
import { del } from "@vercel/blob";
import { prisma } from "../prisma/prisma";

export const deleteImagesByUserId = async (id_user: number) => {
  let urls: string[] = [];
  try {
    const tasks = await prisma.task.findMany({
      where: {
        id_user,
      },
      select: {
        image1: true,
      },
    });
    tasks.forEach((p) => p.image1 && urls.push(p.image1));
    await del(urls);
  } catch (e) {}
};

export const deleteTasksByUserId = async (id_user: number) => {
  await deleteImagesByUserId(id_user);

  const tasks = await prisma.task.deleteMany({
    where: {
      id_user,
    },
  });

  return tasks;
};

export const getTasks = async (
  type?: number,
  id_user?: number,
  id_activity?: number
) => {
  let res: Task[] = [];
  try {
    const tasks = await prisma.task.findMany({
      where: {
        type,
        id_user,
        id_activity,
      },
      orderBy: {
        id: "asc",
      },
    });
    res = tasks;
  } catch (e) {}
  return res;
};
export const getTaskById = async (id: number) => {
  const project = await prisma.task.findUnique({
    where: {
      id,
    },
  });
  return project;
};

export const getTasksByUserId = async (id_user: number, type?: number) => {
  let res: Task[] = [];
  try {
    const tasks = await prisma.task.findMany({
      where: {
        type,
        id_user,
      },
      orderBy: {
        id: "asc",
      },
    });
    res = tasks;
  } catch (e) {}
  return res;
};
export const getTaskByUserIdAndActivityId = async (
  id_user?: number,
  id_activity?: number
) => {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id_activity,
        id_user,
      },
      orderBy: {
        id: "asc",
      },
    });
    return task;
  } catch (e) {}
};

export const getTaskByUserId = async (id_user: number, type?: number) => {
  const project = await prisma.task.findFirst({
    where: {
      id_user,
      type,
    },
  });
  return project;
};

export const saveTask = async (project: Task) => {
  const { id, ...data } = project;

  try {
    const res =
      id === 0
        ? await prisma.task.create({
            data,
          })
        : await prisma.task.update({
            where: {
              id,
            },
            data,
          });

    return res;
  } catch (e) {}
};
