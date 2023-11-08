"use server";

import { Project } from "@/types/types";
import { del } from "@vercel/blob";
import { prisma } from "../prisma/prisma";

export const getProjects = async () => {
  let res: Project[] = [];
  try {
    const projects = await prisma.proyecto.findMany({
      orderBy: {
        id: "asc",
      },
    });
    res = projects;
  } catch (e) {
    console.log("Error: ", e);
  }
  return res;
};

export const deleteImagesByUserId = async (id_user: number) => {
  let urls: string[] = [];
  try {
    const projects = await prisma.proyecto.findMany({
      where: {
        id_user,
      },
      select: {
        image1: true,
      },
    });
    projects.forEach((p) => p.image1 && urls.push(p.image1));
    await del(urls);
  } catch (e) {
    console.log("Error: ", e);
  }
};
export const getProjectById = async (id: number) => {
  const project = await prisma.proyecto.findUnique({
    where: {
      id,
    },
  });
  return project;
};
export const getProjectByUserId = async (id_user: number) => {
  const project = await prisma.proyecto.findFirst({
    where: {
      id_user,
    },
  });
  return project;
};

export const saveProject = async (project: Project) => {
  const { id, ...data } = project;
  try {
    const res =
      id === 0
        ? await prisma.proyecto.create({
            data,
          })
        : await prisma.proyecto.update({
            where: {
              id,
            },
            data,
          });

    return res;
  } catch (e) {
    console.log("ERROR: ", e);
  }
};

export const deleteProjectsByUserId = async (id_user: number) => {
  await deleteImagesByUserId(id_user);

  const projects = await prisma.proyecto.deleteMany({
    where: {
      id_user,
    },
  });

  return projects;
};
