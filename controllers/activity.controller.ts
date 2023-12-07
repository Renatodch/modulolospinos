"use server";
import { Activity, PROJECT, QUESTION } from "@/model/types";
import { prisma } from "../prisma/prisma";

export const deleteActivityById = async (id: number) => {
  const activities = await prisma.activity.delete({
    where: {
      id,
    },
  });

  return activities;
};

export const getActivities = async (id_subject?: number) => {
  let res: Activity[] = [];
  try {
    const activities = await prisma.activity.findMany({
      orderBy: {
        id_subject: "asc",
      },
      where: {
        id_subject,
      },
    });
    res = activities;
  } catch (e) {}
  return res;
};
export const getActivitiesQuestion = async () => {
  let res: Activity[] = [];
  try {
    const activities = await prisma.activity.findMany({
      orderBy: {
        id: "asc",
      },
      where: {
        type: QUESTION,
      },
    });
    res = activities;
  } catch (e) {}
  return res;
};

export const getActivityQuestionById = async (id_activity: number) => {
  try {
    const activity = await prisma.activity.findUnique({
      where: {
        id: id_activity,
        type: QUESTION,
      },
    });
    return activity;
  } catch (e) {}
};

export const getActivitiesProject = async () => {
  let res: Activity[] = [];
  try {
    const activities = await prisma.activity.findMany({
      orderBy: {
        id: "asc",
      },
      where: {
        type: PROJECT,
      },
    });
    res = activities;
  } catch (e) {}
  return res;
};
export const getActivitiesBySubject = async (id_subject: number) => {
  let res: Activity[] = [];
  try {
    const activities = await prisma.activity.findMany({
      orderBy: {
        id: "asc",
      },
      where: {
        id_subject,
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
  } catch (e) {}
};
