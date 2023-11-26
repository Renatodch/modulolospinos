"use server";
import { Subject } from "@/model/types";
import { prisma } from "../prisma/prisma";

export const deleteSubjectById = async (id: number) => {
  const subjects = await prisma.subject.delete({
    where: {
      id,
    },
  });

  return subjects;
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

export const getSubjectById = async (id?: number) => {
  try {
    const subject = await prisma.subject.findUnique({
      where: {
        id,
      },
    });
    return subject;
  } catch (e) {}
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
