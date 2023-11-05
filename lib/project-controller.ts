"use server";

import { prisma } from "../prisma/prisma";
import { Project, User } from "@/types/types";

export const getProjects = async () => {
  let res: Project[] = [];
  try {
    const projects = await prisma.proyecto.findMany({
      orderBy: {
        id: "asc",
      },
    });
    res = [...projects];
  } catch (e) {
    console.log("Error: ", e);
  }
  return res;
};

export const saveProject = async (project: Project) => {
  const { id, ...data } = { ...project, date_update: new Date() };
  try {
    const res =
      id === 0
        ? prisma.proyecto.create({
            data: data,
          })
        : prisma.proyecto.update({
            where: {
              id,
            },
            data: data,
          });

    return res;
  } catch (e) {
    console.log("Error: ", e);
  }
};
