"use server";
import { Activity } from "@/model/types";
import { del } from "@vercel/blob";
import { prisma } from "../prisma/prisma";

export const deleteRubricsByUserId = async (id_user: number) => {
  let urls: string[] = [];
  try {
    const activities = await prisma.activity.findMany({
      where: {
        id_user,
      },
      select: {
        rubric: true,
      },
    });
    activities.forEach((p) => p.rubric && urls.push(p.rubric));
    await del(urls);
  } catch (e) {}
};

export const deleteRubricById = async (id: number) => {
  try {
    const activity = await prisma.activity.findUnique({
      where: {
        id,
      },
      select: {
        rubric: true,
      },
    });
    activity?.rubric && (await del(activity?.rubric));
  } catch (e) {}
};

export const deleteActivityById = async (id: number) => {
  await deleteRubricById(id);

  const activities = await prisma.activity.delete({
    where: {
      id,
    },
  });

  return activities;
};
export const deleteActivitiesByUserId = async (id_user: number) => {
  await deleteRubricsByUserId(id_user);
  const activities = await prisma.activity.deleteMany({
    where: {
      id_user,
    },
  });

  return activities;
};
export const getActivities = async () => {
  let res: Activity[] = [];
  try {
    const activities = await prisma.activity.findMany({
      orderBy: {
        subject: "asc",
      },
    });
    res = activities;
  } catch (e) {}
  return res;
};
export const getActivitiesAnswer = async () => {
  let res: Activity[] = [];
  try {
    const activities = await prisma.activity.findMany({
      orderBy: {
        id: "asc",
      },
      where: {
        type: 0,
      },
    });
    res = activities;
  } catch (e) {}
  return res;
};
export const getActivitiesBySubject = async (subject: number) => {
  let res: Activity[] = [];
  try {
    const activities = await prisma.activity.findMany({
      orderBy: {
        id: "asc",
      },
      where: {
        subject,
      },
    });
    res = activities;
  } catch (e) {}
  return res;
};
export const getActivityById = async (id: number) => {
  const activity = await prisma.activity.findUnique({
    where: {
      id,
    },
  });
  return activity;
};
export const getActivityByUserId = async (id_user: number) => {
  const activity = await prisma.activity.findFirst({
    where: {
      id_user,
    },
  });
  return activity;
};

export const saveActivity = async (activity: Activity) => {
  const { id, ...data } = activity;
  try {
    const res =
      id === 0
        ? await prisma.activity.create({
            data,
          })
        : await prisma.activity.update({
            where: {
              id,
            },
            data,
          });

    return res;
  } catch (e) {
    console.log(e);
  }
};
