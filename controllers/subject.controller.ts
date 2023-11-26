"use server";
import { Subject } from "@/model/types";
import { prisma } from "../prisma/prisma";

export const deleteSubjectById = async (id: number) => {
  const activities = await prisma.subject.delete({
    where: {
      id,
    },
  });

  return activities;
};

export const getSubjects = async () => {
  let res: Subject[] = [];
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: {
        id: "asc",
      },
    });
    res = subjects;
  } catch (e) {}
  return res;
};

export const saveSubject = async (subject: Subject) => {
  const { id, ...data } = subject;
  try {
    const res =
      id === 0
        ? await prisma.subject.create({
            data,
          })
        : await prisma.subject.update({
            where: {
              id,
            },
            data,
          });

    return res;
  } catch (e) {}
};
