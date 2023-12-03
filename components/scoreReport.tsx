"use client";
import { getActivities } from "@/controllers/activity.controller";
import { getSubjects } from "@/controllers/subject.controller";
import { getTasksByUserId } from "@/controllers/task.controller";
import { getUserCourseByUserId } from "@/controllers/user-course.controller";
import { getTasksActivityDetail, isUserCourseNotInit } from "@/lib/utils";
import {
  MIN_SCORE_APPROVED,
  PRIMARY_COLOR,
  Subject,
  TaskActivityDetail,
  User,
} from "@/model/types";
import { Button, Dialog, Flex, Table } from "@radix-ui/themes";
import React, { useState } from "react";
import { CgNotes } from "react-icons/cg";
import LoadingGeneric from "./loadingGeneric";

const ScoreReport = ({ user }: { user: User }) => {
  const [progress, setProgress] = useState<number | null>(null);
  const [notInit, setNotInit] = useState(false);
  const [tasksDetail, setTasksDetail] = useState<TaskActivityDetail[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [avgFinalComponents, setAvgFinalComponents] = useState("");

  const cellStyle = "border-black border-2";

  const handleOpen = async (open: boolean) => {
    const user_course = await getUserCourseByUserId(user.id);
    const _notInit = isUserCourseNotInit(user_course);

    if (user_course && open) {
      setNotInit(_notInit);
      setProgress(user_course.progress);

      if (_notInit) {
        setLoaded(true);
        return;
      }

      const _subjects = await getSubjects();
      const _activities = await getActivities();
      const _tasks = await getTasksByUserId(user.id);
      const _tasksDetail = getTasksActivityDetail(
        _activities,
        _tasks,
        _subjects
      );

      const _avgFinalComponents = _subjects
        .map((detail, index) => `PC${index + 1}`)
        .join("+");

      setAvgFinalComponents(_avgFinalComponents);
      setTasksDetail(_tasksDetail);
      setSubjects(_subjects);
      setLoaded(true);
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
        {loaded && progress != null ? (
          !notInit ? (
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
                  const scores = tasksDetailBySubject.map((n) =>
                    n.score === null || n.score === undefined ? 0 : n.score
                  );
                  const pc: number =
                    len > 0
                      ? scores.reduce((acc, current) => acc + current, 0) / len
                      : progress >= index
                      ? 20
                      : 0;

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
                  <Table.Cell
                    justify="center"
                    colSpan={2}
                    className={cellStyle}
                  >
                    <strong>
                      PROMEDIO FINAL = ({avgFinalComponents})/#Temas
                    </strong>
                  </Table.Cell>
                  <Table.Cell className={cellStyle}></Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          ) : (
            <div className="flex justify-center w-full">
              <span className="italic">
                El estudiante aun no ha iniciado el curso
              </span>
            </div>
          )
        ) : (
          <div style={{ height: 300 }}>
            <LoadingGeneric />
          </div>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ScoreReport;
