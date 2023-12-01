"use client";
import { getScoresByUserId } from "@/controllers/score.controller";
import { getUserCourseByUserId } from "@/controllers/user-course.controller";
import { getFormatedScore, getScoreListSummary } from "@/lib/utils";
import {
  MIN_SCORE_APPROVED,
  PRIMARY_COLOR,
  Score,
  ScoreActivityDetail,
  ScoreSubjectDetail,
  User,
} from "@/model/types";
import { Button, Dialog, Flex, Table } from "@radix-ui/themes";
import React, { useState } from "react";
import { CgNotes } from "react-icons/cg";
import LoadingGeneric from "./loadingGeneric";

const ScoreHistory = ({ user }: { user: User }) => {
  const [scoreSubjectDetail, setScoreDetail] = useState<ScoreSubjectDetail[]>(
    []
  );
  const [loaded, setLoaded] = useState(false);
  const [avgFinalComponents, setAvgFinalComponents] = useState("");
  const [avgFinal, setAvgFinal] = useState<number>(0);
  const cellStyle = "border-black border-2";

  const handleOpen = async (open: boolean) => {
    if (open) {
      const user_course = await getUserCourseByUserId(user.id);
      const _scores = await getScoresByUserId(user.id);
      const _scoreSubjectDetail: ScoreSubjectDetail[] = [];
      const _scoreListSummary: Score[] = getScoreListSummary(_scores);

      _scoreListSummary
        .sort((s) => s.order)
        .forEach((score: Score) => {
          const _activities: ScoreActivityDetail[] = [];
          const detail = _scores.filter((s) => s.order === score.order);
          for (let d of detail) {
            _activities.push({
              activity: d.activity,
              score: d.value,
            });
          }
          _scoreSubjectDetail.push({
            activities: _activities,
            id: score.id,
            subject: score.subject,
            order: score.value,
            id_user: user.id,
          });
        });

      const _avgFinalComponents = _scoreSubjectDetail
        .map((detail, index) => `PC${index + 1}`)
        .join("+");
      if (user_course?.average !== undefined && user_course?.average !== null) {
        setAvgFinalComponents(_avgFinalComponents);
        setAvgFinal(user_course?.average);
        setScoreDetail(_scoreSubjectDetail);
        setLoaded(true);
      }
    } else {
      setLoaded(false);
    }
  };

  return (
    <Dialog.Root onOpenChange={handleOpen}>
      <Dialog.Trigger>
        <Flex justify={"start"}>
          <Button
            size="3"
            style={{
              backgroundColor: PRIMARY_COLOR,
            }}
          >
            <CgNotes size="20" />
          </Button>
        </Flex>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 650 }}>
        <Dialog.Title align={"center"}>Historial de notas</Dialog.Title>
        <Dialog.Description size="2" mb="4" className="flex flex-col ">
          <strong className="uppercase mb-2">Datos del estudiante</strong>
          <span>
            <strong className="text-black">Nombre: &nbsp;</strong>
            {user?.name}
          </span>
          <span>
            <strong className="text-black">iD: &nbsp;</strong>
            {user?.id}
          </span>
        </Dialog.Description>
        {loaded ? (
          <Table.Root variant="surface">
            <Table.Header style={{ backgroundColor: PRIMARY_COLOR }}>
              <Table.Row>
                <Table.ColumnHeaderCell
                  justify={"center"}
                  className={cellStyle}
                >
                  Tema
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell
                  justify={"center"}
                  className={cellStyle}
                >
                  Actividades
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell
                  justify={"center"}
                  className={cellStyle}
                >
                  Notas
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {scoreSubjectDetail
                .sort((s) => s.order)
                .map((s, index) => {
                  let len = s.activities.length;
                  const scores = s.activities.map((n) => n.score);
                  len = s.activities.some((a) => a.activity === null) ? 0 : len;
                  const pc: number =
                    len > 0
                      ? scores.reduce((acc, current) => acc + current, 0) / len
                      : 20;

                  return (
                    <React.Fragment key={index}>
                      <Table.Row align={"center"}>
                        <Table.Cell
                          rowSpan={len + 2}
                          justify="center"
                          className={cellStyle}
                        >
                          {s.subject}
                        </Table.Cell>
                      </Table.Row>
                      {len > 0 &&
                        s.activities.map((t, index) => (
                          <Table.Row key={index} align={"center"}>
                            <Table.Cell justify="center" className={cellStyle}>
                              {t.activity}
                            </Table.Cell>

                            <Table.Cell justify="center" className={cellStyle}>
                              {t.score?.toString().padStart(2, "0")}
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      <Table.Row align={"center"}>
                        <Table.Cell justify="center" className={cellStyle}>
                          PC {index + 1}
                        </Table.Cell>
                        <Table.Cell
                          justify="center"
                          className={`${
                            pc >= MIN_SCORE_APPROVED
                              ? "text-blue-600"
                              : "text-red-600"
                          } font-semibold text-center ${cellStyle}`}
                        >
                          {pc.toFixed(1).padStart(2, "0")}
                        </Table.Cell>
                      </Table.Row>
                    </React.Fragment>
                  );
                })}
              <Table.Row align={"center"}>
                <Table.Cell justify="center" colSpan={2} className={cellStyle}>
                  <strong>
                    PROMEDIO FINAL = ({avgFinalComponents})/#Temas
                  </strong>
                </Table.Cell>
                <Table.Cell
                  justify="center"
                  className={`${cellStyle} ${
                    avgFinal >= MIN_SCORE_APPROVED
                      ? "text-blue-600"
                      : "text-red-600"
                  } font-semibold text-lg text-center`}
                >
                  {getFormatedScore(avgFinal)}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        ) : (
          <div style={{ height: 300 }}>
            <LoadingGeneric />
          </div>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ScoreHistory;
