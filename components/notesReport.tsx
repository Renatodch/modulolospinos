"use client";
import { getActivities } from "@/controllers/activity.controller";
import { getTasksByUserId } from "@/controllers/task.controller";
import { getFormatedNote, getTasksActivityDetail } from "@/lib/utils";
import {
  MIN_NOTE_APPROVED,
  PRIMARY_COLOR,
  SUBJECTS_COURSE,
  TaskActivityDetail,
  User,
  User_Course,
} from "@/model/types";
import { Button, Dialog, Flex, Table } from "@radix-ui/themes";
import React, { useState } from "react";
import { CgNotes } from "react-icons/cg";
import { PuffLoader } from "react-spinners";

const NotesReport = ({
  user,
  user_course,
}: {
  user: User;
  user_course: User_Course | undefined | null;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [tasksDetail, setTasksDetail] = useState<TaskActivityDetail[]>([]);
  const cellStyle = "border-black border-2";
  let avgFinal = 0;
  const handleOpenChange = async (open: boolean) => {
    if (open) {
      const activities = await getActivities();
      const userTasks = await getTasksByUserId(user.id);
      const _tasksDetail = getTasksActivityDetail(activities, userTasks);
      setTasksDetail(_tasksDetail);
      setLoaded(true);
    } else {
      avgFinal = 0;
      setLoaded(false);
    }
  };
  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <Flex justify={"start"}>
          <Button
            size="3"
            style={{
              backgroundColor: user_course ? PRIMARY_COLOR : "#f0f0f0",
            }}
            disabled={!user_course}
          >
            <CgNotes size="20" />
          </Button>
        </Flex>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 650 }}>
        <Dialog.Title align={"center"}>Reporte de notas</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          <div className="mb-4 flex flex-col ">
            <strong className="uppercase mb-2">Datos del estudiante</strong>
            <span>
              <strong className="text-black">Nombre: &nbsp;</strong>
              {user?.name}
            </span>
            <span>
              <strong className="text-black">iD: &nbsp;</strong>
              {user?.id}
            </span>
          </div>
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
              {SUBJECTS_COURSE.map((s, i) => {
                const tasksDetailBySubject = tasksDetail.filter(
                  (t) => t.subject === s.value
                );
                const len = tasksDetailBySubject.length;
                const notes = tasksDetailBySubject.map((n) =>
                  n.score === null || n.score === undefined ? 0 : n.score
                );
                const avg: number =
                  len > 0
                    ? notes.reduce((acc, current) => acc + current, 0) / len
                    : user_course && user_course?.progress >= s.value
                    ? 20
                    : 0;

                const pc = avg;
                avgFinal += pc / SUBJECTS_COURSE.length;
                return (
                  <React.Fragment key={i}>
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
                    <Table.Row>
                      <Table.Cell justify="center" className={cellStyle}>
                        PC {i + 1}
                      </Table.Cell>
                      <Table.Cell
                        justify="center"
                        className={`${
                          pc >= MIN_NOTE_APPROVED
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
              <Table.Row>
                <Table.Cell justify="center" colSpan={2} className={cellStyle}>
                  <strong>
                    PROMEDIO FINAL &nbsp; (PC1 + PC2 + PC3 + PC4 + PC5)/#Temas
                  </strong>
                </Table.Cell>
                <Table.Cell
                  justify="center"
                  className={`${cellStyle} ${
                    avgFinal >= MIN_NOTE_APPROVED
                      ? "text-blue-600"
                      : "text-red-600"
                  } font-semibold text-lg text-center`}
                >
                  {user_course && getFormatedNote(avgFinal)}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        ) : (
          <div
            className="w-full flex justify-center items-center"
            style={{ height: "500px" }}
          >
            <PuffLoader
              color={PRIMARY_COLOR}
              loading={!loaded}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default NotesReport;
