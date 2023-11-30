"use client";
import { useUserContext } from "@/app/context";
import {
  deleteScoresByUserId,
  getScoresByUserId,
  saveScores,
} from "@/controllers/score.controller";
import { getTasksByUserId } from "@/controllers/task.controller";
import { saveUserCourse } from "@/controllers/user-course.controller";
import { deleteUserById, getUserById } from "@/controllers/user.controller";
import {
  getTasksActivityDetail,
  isUserCourseCompleted,
  isUserCourseNotInit,
} from "@/lib/utils";
import {
  APPROVED,
  Activity,
  DeleteUserStudentMessage,
  DeleteUserTitle,
  MIN_SCORE_APPROVED,
  NOT_INIT,
  REPROVED,
  STUDENT,
  Score,
  Subject,
  TOAST_BD_ERROR,
  TOAST_DELETING,
  TOAST_USER_COURSE_NOT_COMPLETED,
  TOAST_USER_COURSE_NOT_STARTED,
  TOAST_USER_COURSE_SAVE_SCORE_SUCCESS,
  TOAST_USER_DELETE_ERROR_1,
  TOAST_USER_DELETE_SUCCESS,
  TaskActivityDetail,
  USER_PROGRESS,
  User,
  User_Course,
} from "@/model/types";
import { Button, Table } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdCalculate } from "react-icons/md";
import { toast } from "sonner";
import DeleteModal from "./deleteModal";
import LoadingGeneric from "./loadingGeneric";
import ScoreHistory from "./scoreHistory";
import ScoreReport from "./scoreReport";
import UserForm from "./userForm";

const StudentList = ({
  users,
  user_courses,
  subjects,
  activities,
}: {
  users: User[];
  user_courses: User_Course[];
  subjects: Subject[];
  activities: Activity[];
}) => {
  return (
    <Table.Root className="w-full">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Id</Table.ColumnHeaderCell>
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
              <StudentListRow
                user_course={user_course}
                _user={user}
                subjects={subjects}
                activities={activities}
              />
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
  subjects,
  activities,
}: {
  _user: User;
  user_course: User_Course | undefined;
  subjects: Subject[];
  activities: Activity[];
}) => {
  const { user } = useUserContext();

  const router = useRouter();
  const [onCompute, setOnCompute] = useState<boolean>(false);
  const [deleting, setDeleting] = useState(false);
  const [scores, setScores] = useState<Score[]>([]);
  const [tasksDetail, setTasksDetail] = useState<TaskActivityDetail[]>([]);
  const [reportReady, setReportReady] = useState<boolean>(false);

  const state =
    USER_PROGRESS.find((u) => u.value === user_course?.state) ??
    USER_PROGRESS.find((u) => u.value === NOT_INIT)!;
  const avgFinal = user_course?.average ?? -1;

  useEffect(() => {
    const getData = async () => {
      const id = _user.id;
      const tasks = await getTasksByUserId(id);
      const _tasksDetail = getTasksActivityDetail(activities, tasks, subjects);

      if (isUserCourseCompleted(user_course)) {
        const _scores = await getScoresByUserId(id);
        setScores(_scores);
      }

      setTasksDetail(_tasksDetail);
      setReportReady(true);
    };
    getData();
  }, [activities, subjects, _user, user_course]);

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

  const handleCompute = () => {
    if (!user_course || isUserCourseNotInit(user_course)) {
      toast.error(TOAST_USER_COURSE_NOT_STARTED);
      return;
    }

    const courseLastItemIndex = subjects.length - 1;
    if (
      user_course.progress < courseLastItemIndex ||
      tasksDetail.some((t) => !t.done || !t.evaluated)
    ) {
      toast.error(TOAST_USER_COURSE_NOT_COMPLETED, { duration: 5000 });
      return;
    }

    const id = _user.id;
    setOnCompute(true);

    toast.promise(
      new Promise((resolve, reject) => {
        const scoreList: Omit<Score, "id">[] = [];
        let avgFinal = 0;

        subjects.forEach((subject, index) => {
          const scores = tasksDetail
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
          avgFinal += pc / subjects.length;
        });

        saveUserCourse({
          ...user_course,
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
      <Table.RowHeaderCell width={100}>{_user.id}</Table.RowHeaderCell>
      <Table.Cell width={300}>{_user.name}</Table.Cell>
      <Table.Cell width={250}>{_user.email}</Table.Cell>
      <Table.Cell width={250}>{state.label}</Table.Cell>
      <Table.Cell
        justify={"center"}
        width={250}
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
        {reportReady ? (
          <Button
            disabled={onCompute || state.value === NOT_INIT}
            onClick={handleCompute}
            size="3"
          >
            <MdCalculate />
          </Button>
        ) : (
          <LoadingGeneric size={20} />
        )}
      </Table.Cell>
      <Table.Cell width={100}>
        {reportReady ? (
          isUserCourseCompleted(user_course) ? (
            <ScoreHistory
              user={_user}
              avgFinalSaved={user_course?.average!}
              scores={scores}
            />
          ) : (
            <ScoreReport
              user={_user}
              progress={user_course?.progress!}
              notInit={isUserCourseNotInit(user_course)}
              subjects={subjects}
              tasksDetail={tasksDetail}
            />
          )
        ) : (
          <LoadingGeneric size={20} />
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
