"use client";
import { getFormatedScore } from "@/lib/utils";
import {
  MIN_SCORE_APPROVED,
  PRIMARY_COLOR,
  Subject,
  TaskActivityDetail,
  User,
} from "@/model/types";
import { Button, Dialog, Flex, Table } from "@radix-ui/themes";
import React from "react";
import { CgNotes } from "react-icons/cg";

const ScoreReport = ({
  user,
  progress,
  notInit,
  tasksDetail,
  subjects,
}: {
  user: User;
  progress: number;
  notInit: boolean;
  tasksDetail: TaskActivityDetail[];
  subjects: Subject[];
}) => {
  const cellStyle = "border-black border-2";
  let avgFinal = 0,
    avgFinalComponents = "";
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Flex justify={"start"}>
          <Button
            size="3"
            style={{
              backgroundColor: notInit ? "#f0f0f0" : PRIMARY_COLOR,
            }}
            disabled={notInit}
          >
            <CgNotes size="20" />
          </Button>
        </Flex>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 650 }}>
        <Dialog.Title align={"center"}>Reporte de notas</Dialog.Title>
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
        <Table.Root variant="surface">
          <Table.Header style={{ backgroundColor: PRIMARY_COLOR }}>
            <Table.Row>
              <Table.ColumnHeaderCell justify={"center"} className={cellStyle}>
                Tema
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell justify={"center"} className={cellStyle}>
                Actividades
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell justify={"center"} className={cellStyle}>
                Notas
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {subjects.map((s, index) => {
              const tasksDetailBySubject = tasksDetail.filter(
                (t) => t.id_subject === s.id
              );
              const len = tasksDetailBySubject.length;
              const scores = tasksDetailBySubject.map((n) =>
                n.score === null || n.score === undefined ? 0 : n.score
              );
              const pc: number =
                len > 0
                  ? scores.reduce((acc, current) => acc + current, 0) / len
                  : progress >= index
                  ? 20
                  : 0;

              avgFinalComponents = subjects
                .map((detail, index) => `PC${index + 1}`)
                .join("+");

              avgFinal += pc / subjects.length;
              return (
                <React.Fragment key={index}>
                  <Table.Row align={"center"}>
                    <Table.Cell
                      rowSpan={len + 2}
                      justify="center"
                      className={cellStyle}
                    >
                      {s.title}
                    </Table.Cell>
                  </Table.Row>
                  {tasksDetailBySubject.map((t, index) => (
                    <Table.Row key={index} align={"center"}>
                      <Table.Cell justify="center" className={cellStyle}>
                        {t.activity_title}
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
                <strong>PROMEDIO FINAL = ({avgFinalComponents})/#Temas</strong>
              </Table.Cell>
              <Table.Cell
                justify="center"
                className={`${cellStyle} ${
                  avgFinal >= MIN_SCORE_APPROVED
                    ? "text-blue-600"
                    : "text-red-600"
                } font-semibold text-lg text-center`}
              >
                {!notInit && false && getFormatedScore(avgFinal)}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ScoreReport;
