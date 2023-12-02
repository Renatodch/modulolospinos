"use client";
import { useUserContext } from "@/app/context";
import { getActivities } from "@/controllers/activity.controller";
import {
  deleteScoresByUserId,
  saveScores,
} from "@/controllers/score.controller";
import { getSubjects } from "@/controllers/subject.controller";
import { getTasksByUserId } from "@/controllers/task.controller";
import {
  getUserCourseByUserId,
  saveUserCourse,
} from "@/controllers/user-course.controller";
import { deleteUserById, getUserById } from "@/controllers/user.controller";
import {
  getTasksActivityDetail,
  isUserCourseCompleted,
  isUserCourseNotInit,
} from "@/lib/utils";
import {
  APPROVED,
  DeleteUserStudentMessage,
  DeleteUserTitle,
  MIN_SCORE_APPROVED,
  NOT_INIT,
  REPROVED,
  STUDENT,
  Score,
  TOAST_BD_ERROR,
  TOAST_DELETING,
  TOAST_USER_COURSE_NOT_COMPLETED,
  TOAST_USER_COURSE_NOT_STARTED,
  TOAST_USER_COURSE_SAVE_SCORE_SUCCESS,
  TOAST_USER_DELETE_ERROR_1,
  TOAST_USER_DELETE_SUCCESS,
  TOAST_VALIDATE_PROGRESS,
  USER_PROGRESS,
  User,
  User_Course,
  getFormatId,
} from "@/model/types";
import { Button, Table } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { MdCalculate } from "react-icons/md";
import { toast } from "sonner";
import DeleteModal from "./deleteModal";
import ScoreHistory from "./scoreHistory";
import ScoreReport from "./scoreReport";
import UserForm from "./userForm";

const StudentList = ({
  users,
  user_courses,
}: {
  users: User[];
  user_courses: User_Course[];
}) => {
  return (
    <Table.Root className="w-full">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Código</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Nombres Completos</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Estado Curso</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Promedio Final</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Registrar Notas</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Reporte Notas</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Modificar</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Borrar</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {users.map((user) => {
          const user_course = user_courses.find((u) => u.id_user === user.id);
          return (
            <React.Fragment key={user.id}>
              <StudentListRow user_course={user_course} _user={user} />
            </React.Fragment>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
};

const StudentListRow = ({
  _user,
  user_course,
}: {
  _user: User;
  user_course: User_Course | undefined;
}) => {
  const { user } = useUserContext();

  const router = useRouter();
  const [onCompute, setOnCompute] = useState<boolean>(false);
  const [deleting, setDeleting] = useState(false);

  const state =
    USER_PROGRESS.find((u) => u.value === user_course?.state) ??
    USER_PROGRESS.find((u) => u.value === NOT_INIT)!;
  const avgFinal = user_course?.average ?? -1;

  const handleDelete = () => {
    const id = _user.id;
    setDeleting(true);
    toast.promise(
      new Promise((resolve, reject) => {
        getUserById(id)
          .then((res) => {
            if (res && id === user?.id!) {
              reject(1);
              return;
            }
            return deleteUserById(id);
          })
          .then(resolve)
          .catch(reject);
      }),
      {
        loading: TOAST_DELETING,
        success: () => {
          return TOAST_USER_DELETE_SUCCESS;
        },
        error: (val) => {
          setDeleting(false);
          return val === 1 ? TOAST_USER_DELETE_ERROR_1 : TOAST_BD_ERROR;
        },
        finally: () => {
          router.refresh();
        },
      }
    );
  };

  const handleCompute = async () => {
    const id = _user.id;
    setOnCompute(true);
    const toast_id = toast.loading(TOAST_VALIDATE_PROGRESS, {
      duration: 10000,
    });

    const _user_course = await getUserCourseByUserId(_user.id);
    if (!_user_course || isUserCourseNotInit(_user_course)) {
      setOnCompute(false);
      toast.error(TOAST_USER_COURSE_NOT_STARTED);
      return;
    }

    const _subjects = await getSubjects();
    const _activities = await getActivities();
    const _tasks = await getTasksByUserId(id);
    const _tasksDetail = getTasksActivityDetail(_activities, _tasks, _subjects);

    const courseLastItemIndex = _subjects.length - 1;
    toast.dismiss(toast_id);
    if (
      _user_course.progress < courseLastItemIndex ||
      _tasksDetail.some((t) => !t.done || !t.evaluated)
    ) {
      setOnCompute(false);
      toast.error(TOAST_USER_COURSE_NOT_COMPLETED, { duration: 5000 });
      return;
    }

    toast.promise(
      new Promise((resolve, reject) => {
        const scoreList: Omit<Score, "id">[] = [];
        let avgFinal = 0;

        _subjects.forEach((subject, index) => {
          const scores = _tasksDetail
            .filter((t) => t.id_subject === subject.id)
            .map((n) => {
              const score = n.score ?? 0;
              scoreList.push({
                id_user: id,
                subject: subject.title,
                order: n.value_subject,
                activity: n.activity_title,
                value: score,
              });

              return score;
            });
          const len = scores.length;
          let pc = 20;
          if (len > 0) {
            pc = scores.reduce((acc, current) => acc + current, 0) / len;
          } else {
            scoreList.push({
              id_user: id,
              subject: subject.title,
              order: index,
              activity: null,
              value: pc,
            });
          }
          avgFinal += pc / _subjects.length;
        });

        saveUserCourse({
          ..._user_course,
          date_end: new Date(),
          average: Math.round(avgFinal),
          state: avgFinal >= MIN_SCORE_APPROVED ? APPROVED : REPROVED,
        })
          .then(() => deleteScoresByUserId(id))
          .then(() => saveScores(scoreList))
          .then(resolve)
          .catch(reject);
      }),
      {
        loading: "Calculando promedio final...",
        success: () => TOAST_USER_COURSE_SAVE_SCORE_SUCCESS,
        error: () => TOAST_BD_ERROR,
        finally: () => {
          setOnCompute(false);
          router.refresh();
        },
      }
    );
  };
  return (
    <Table.Row>
      <Table.RowHeaderCell width={100}>
        {getFormatId(_user.id)}
      </Table.RowHeaderCell>
      <Table.Cell width={300}>{_user.name}</Table.Cell>
      <Table.Cell width={250}>{_user.email}</Table.Cell>
      <Table.Cell width={250}>{state.label}</Table.Cell>
      <Table.Cell
        align="center"
        width={200}
        className={`font-semibold ${
          avgFinal != -1
            ? avgFinal >= MIN_SCORE_APPROVED
              ? "text-blue-600"
              : "text-red-600"
            : ""
        }`}
      >
        {avgFinal != -1 ? avgFinal.toString().padStart(2, "0") : ""}
      </Table.Cell>
      <Table.Cell width={100}>
        <Button disabled={onCompute} onClick={handleCompute} size="3">
          <MdCalculate />
        </Button>
      </Table.Cell>
      <Table.Cell width={100}>
        {isUserCourseCompleted(user_course) ? (
          <ScoreHistory user={_user} />
        ) : (
          <ScoreReport user={_user} />
        )}
      </Table.Cell>
      <Table.Cell width={100}>
        <UserForm target={_user} user_type={STUDENT} />
      </Table.Cell>
      <Table.Cell width={100}>
        <DeleteModal
          title={DeleteUserTitle}
          message={DeleteUserStudentMessage(_user.id)}
          deleting={deleting}
          deleteHandler={handleDelete}
        />
      </Table.Cell>
    </Table.Row>
  );
};

export default StudentList;
