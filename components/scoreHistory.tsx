"use client";
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
import React, { useEffect, useState } from "react";
import { CgNotes } from "react-icons/cg";
import LoadingGeneric from "./loadingGeneric";

const ScoreHistory = ({
  user,
  avgFinalSaved,
  scores,
}: {
  user: User;
  avgFinalSaved: number;
  scores: Score[];
}) => {
  const [scoreSubjectDetail, setScoreDetail] = useState<ScoreSubjectDetail[]>(
    []
  );
  const [loaded, setLoaded] = useState(false);

  const cellStyle = "border-black border-2";
  let avgFinalComponents = "";

  useEffect(() => {
    const getData = () => {
      const _scoreSubjectDetail: ScoreSubjectDetail[] = [];
      const _scoreListSummary: Score[] = getScoreListSummary(scores);

      _scoreListSummary
        .sort((s) => s.order)
        .forEach((score: Score) => {
          const _activities: ScoreActivityDetail[] = [];
          const detail = scores.filter((s) => s.order === score.order);
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
      setScoreDetail(_scoreSubjectDetail);
      setLoaded(true);
    };
    getData();
  }, [user, scores]);

  return (
    <Dialog.Root>
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

                  avgFinalComponents = scoreSubjectDetail
                    .map((detail, index) => `PC${index + 1}`)
                    .join("+");

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
                    avgFinalSaved >= MIN_SCORE_APPROVED
                      ? "text-blue-600"
                      : "text-red-600"
                  } font-semibold text-lg text-center`}
                >
                  {getFormatedScore(avgFinalSaved)}
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
