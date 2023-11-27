"use client";
import { getActivities } from "@/controllers/activity.controller";
import { getSubjects } from "@/controllers/subject.controller";
import { getTasksByUserId } from "@/controllers/task.controller";
import { getUserCourseByUserId } from "@/controllers/user-course.controller";
import {
  getFormatedNote,
  getTasksActivityDetail,
  isUserCourseNotInit,
} from "@/lib/utils";
import {
  MIN_NOTE_APPROVED,
  PRIMARY_COLOR,
  Subject,
  TaskActivityDetail,
  User,
} from "@/model/types";
import { Button, Dialog, Flex, Table } from "@radix-ui/themes";
import React, { useState } from "react";
import { CgNotes } from "react-icons/cg";
import LoadingGeneric from "./loadingGeneric";

const NotesReport = ({ user }: { user: User }) => {
  const [progress, setProgress] = useState(0);
  const [notInit, setNotInit] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [tasksDetail, setTasksDetail] = useState<TaskActivityDetail[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const cellStyle = "border-black border-2";
  let avgFinal = 0,
    avgFinalComponents = "";

  const handleOpenChange = async (open: boolean) => {
    if (open) {
      const user_course = await getUserCourseByUserId(user.id);
      const _subjects = await getSubjects();
      const activities = await getActivities();
      const userTasks = await getTasksByUserId(user.id);
      const _tasksDetail = getTasksActivityDetail(
        activities,
        userTasks,
        _subjects
      );
      setProgress(user_course?.progress || 0);
      setNotInit(isUserCourseNotInit(user_course));
      setTasksDetail(_tasksDetail);
      setSubjects(_subjects);
      setLoaded(true);
    } else {
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
              backgroundColor: notInit ? "#f0f0f0" : PRIMARY_COLOR,
            }}
            disabled={notInit}
          >
            <CgNotes size="20" />
          </Button>
        </Flex>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 650 }}>
        <Dialog.Title align={"center"}>
          Reporte Actualizado de notas
        </Dialog.Title>
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
              {subjects.map((s, index) => {
                const tasksDetailBySubject = tasksDetail.filter(
                  (t) => t.id_subject === s.id
                );
                const len = tasksDetailBySubject.length;
                const notes = tasksDetailBySubject.map((n) =>
                  n.score === null || n.score === undefined ? 0 : n.score
                );
                const pc: number =
                  len > 0
                    ? notes.reduce((acc, current) => acc + current, 0) / len
                    : progress >= index
                    ? 20
                    : 0;

                avgFinalComponents += `PC${index + 1} ${
                  index < subjects.length - 1 ? "+" : ""
                }`;
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
              <Table.Row align={"center"}>
                <Table.Cell justify="center" colSpan={2} className={cellStyle}>
                  <strong>
                    PROMEDIO FINAL &nbsp; ({avgFinalComponents})/#Temas
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
                  {!notInit && getFormatedNote(avgFinal)}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        ) : (
          <div style={{ height: 500 }}>
            <LoadingGeneric />
          </div>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default NotesReport;
