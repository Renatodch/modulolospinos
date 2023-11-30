"use server";

import { Score } from "@/model/types";
import { prisma } from "../prisma/prisma";

export const getScoresByUserId = async (id_user: number) => {
  let scores: Score[] = [];
  try {
    const res = await prisma.score.findMany({
      where: {
        id_user,
      },
    });
    scores = res;
  } catch (e) {}
  return scores;
};

export const saveScores = async (scores: Omit<Score, "id">[]) => {
  try {
    const res = await prisma.score.createMany({
      data: scores,
    });

    return res;
  } catch (e) {}
};

export const deleteScoresByUserId = async (id_user: number) => {
  try {
    const users = await prisma.score.deleteMany({
      where: {
        id_user,
      },
    });
  } catch (e) {}
};
