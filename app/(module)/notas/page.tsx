"use server";
import NotAllowed from "@/components/notAllowed";
import { getActivities } from "@/controllers/activity.controller";

import { getTasksByUserId } from "@/controllers/task.controller";
import { getUserCourseByUserId } from "@/controllers/user-course.controller";
import { getSession, loginIsRequiredServer } from "@/lib/auth-config";
import { getTasksActivityDetail } from "@/lib/utils";
import {
  MIN_NOTE_APPROVED,
  PRIMARY_COLOR,
  SUBJECTS_COURSE,
  TEACHER,
} from "@/model/types";
import { Table } from "@radix-ui/themes";

const CalificationPage = async () => {
  await loginIsRequiredServer();
  const { _user } = await getSession();
  if (_user?.type === TEACHER) return <NotAllowed />;

  const user_course = await getUserCourseByUserId(_user!.id);
  const tasks = await getTasksByUserId(_user!.id);
  const activities = await getActivities();
  const tasksDetail = getTasksActivityDetail(activities, tasks);
  const cellStyle = { borderWidth: "2px", borderColor: "#000" };
  let avgFinal = 0;
  return (
    <div className="flex flex-col items-center justify-center w-full py-8 px-16">
      <Table.Root variant="surface">
        <Table.Header style={{ backgroundColor: PRIMARY_COLOR }}>
          <Table.Row>
            <Table.ColumnHeaderCell justify={"center"} style={cellStyle}>
              Peso(%)
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell justify={"center"} style={cellStyle}>
              Tema
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell justify={"center"} style={cellStyle}>
              Actividades
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell justify={"center"} style={cellStyle}>
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

            const pc = (s.weight / 100) * avg;
            avgFinal += pc;
            return (
              <Table.Row key={i}>
                <Table.RowHeaderCell justify={"center"} style={cellStyle}>
                  {s.weight}%
                </Table.RowHeaderCell>
                <Table.Cell justify="center" style={cellStyle}>
                  {s.title}
                </Table.Cell>
                <Table.Cell
                  justify="center"
                  style={{ ...cellStyle, padding: 0 }}
                >
                  <Table.Root>
                    <Table.Body>
                      {tasksDetailBySubject.map((t, index) => {
                        return (
                          <Table.Row
                            key={index}
                            className="border-black border-b-2"
                          >
                            <Table.Cell
                              justify="center"
                              style={{ padding: 10 }}
                            >
                              {t.activity_title}
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                      <Table.Row>
                        <Table.Cell justify="center">PC {i + 1}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Root>
                </Table.Cell>

                <Table.Cell
                  justify="center"
                  style={{ ...cellStyle, padding: 0 }}
                >
                  <Table.Root>
                    <Table.Body>
                      {tasksDetailBySubject.map((t, index) => {
                        return (
                          <Table.Row
                            key={index}
                            className="border-black border-b-2"
                          >
                            <Table.Cell
                              justify="center"
                              style={{ padding: 12 }}
                            >
                              {t.score}
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                      <Table.Row>
                        <Table.Cell
                          justify="center"
                          className={`${
                            pc >= MIN_NOTE_APPROVED
                              ? "text-blue-600"
                              : "text-red-600"
                          } font-semibold text-center`}
                        >
                          {pc.toFixed(1)}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Root>
                </Table.Cell>
              </Table.Row>
            );
          })}
          <Table.Row>
            <Table.Cell justify="center" colSpan={3} style={cellStyle}>
              <strong>
                PROMEDIO FINAL (10% PC1 + 10% PC2 + 25% PC3 + 20% PC4 + 35% PC5)
              </strong>
            </Table.Cell>
            <Table.Cell
              justify="center"
              style={cellStyle}
              className={`${
                avgFinal >= MIN_NOTE_APPROVED ? "text-blue-600" : "text-red-600"
              } font-semibold text-lg text-center`}
            >
              {user_course ? avgFinal.toFixed(1) : ""}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default CalificationPage;
