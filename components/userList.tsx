"use client";
import { getActivities } from "@/controllers/activity.controller";
import { getTasksByUserId } from "@/controllers/task.controller";
import {
  getUserCourseByUserId,
  saveUserCourse,
} from "@/controllers/user-course.controller";
import { deleteUserById } from "@/controllers/user.controller";
import { getTasksActivityDetail } from "@/lib/utils";
import {
  APPROVED,
  COURSE_LAST_ITEM_INDEX,
  MIN_NOTE_APPROVED,
  NOT_INIT,
  REPROVED,
  SUBJECTS_COURSE,
  TOAST_BD_ERROR,
  TOAST_USER_COURSE_NOT_COMPLETED,
  TOAST_USER_COURSE_NOT_STARTED,
  TOAST_USER_COURSE_SAVE_NOTE_NOT_CHANGE,
  TOAST_USER_COURSE_SAVE_NOTE_SUCCESS,
  TOAST_USER_DELETE_SUCCESS,
  USER_PROGRESS,
  User,
  User_Course,
} from "@/model/types";
import { Button, Table } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { MdCalculate } from "react-icons/md";
import { toast } from "sonner";
import UserForm from "./userForm";

const UserList = ({
  users,
  user_courses,
}: {
  users: User[];
  user_courses: User_Course[];
}) => {
  const router = useRouter();
  const [onDelete, setOnDelete] = useState<boolean>(false);
  const [onCompute, setOnCompute] = useState<boolean>(false);
  const [deletedIndex, setDeletedIndex] = useState<number | null>(null);
  const [computedIndex, setComputedIndex] = useState<number | null>(null);
  const handleDelete = async (id: number) => {
    setDeletedIndex(id);
    setOnDelete(true);
    await deleteUserById(id);
    setOnDelete(false);
    setDeletedIndex(null);
    toast.success(TOAST_USER_DELETE_SUCCESS);
    router.refresh();
  };
  const handleCompute = async (id: number) => {
    setComputedIndex(id);
    setOnCompute(true);
    toast.loading("Calculando promedio final...");

    try {
      let temp = await getUserCourseByUserId(id);
      if (!temp) {
        toast.error(TOAST_USER_COURSE_NOT_STARTED);
        reset();
        return;
      }
      const activities = await getActivities();
      const userTasks = await getTasksByUserId(id);
      const tasksDetail = getTasksActivityDetail(activities, userTasks);

      if (
        temp.progress < COURSE_LAST_ITEM_INDEX ||
        tasksDetail.some((t) => !t.done || !t.evaluated)
      ) {
        toast.error(TOAST_USER_COURSE_NOT_COMPLETED, { duration: 5000 });
        reset();
        return;
      }

      let avgFinal = 0;
      for (let s of SUBJECTS_COURSE) {
        const notes = tasksDetail
          .filter((t) => t.subject === s.value)
          .map((n) =>
            n.score === null || n.score === undefined ? 0 : n.score
          );
        const len = notes.length;
        const avg = notes.reduce((acc, current) => acc + current, 0) / len;
        const pc = (s.weight / 100) * (len > 0 ? avg : 20);
        avgFinal += pc;
      }
      toast.dismiss();
      const change = Math.round(avgFinal) !== temp?.average;
      if (temp && change) {
        temp = {
          ...temp,
          average: Math.round(avgFinal),
          state: avgFinal >= MIN_NOTE_APPROVED ? APPROVED : REPROVED,
        };
        temp = await saveUserCourse(temp);
        temp
          ? toast.success(TOAST_USER_COURSE_SAVE_NOTE_SUCCESS)
          : toast.success(TOAST_BD_ERROR);
      }
      !change && toast.info(TOAST_USER_COURSE_SAVE_NOTE_NOT_CHANGE);
    } catch (e) {
      toast.success(TOAST_BD_ERROR);
    }
    reset();
  };
  const reset = () => {
    setOnCompute(false);
    setComputedIndex(null);
    router.refresh();
  };

  return (
    <Table.Root className="w-full">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Id</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Nombres Completos</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Estado Curso</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Promedio Final</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Calcular Promedio</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Modificar</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Borrar</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {users.map((user) => {
          const uc = user_courses.find((u) => u.id_user === user.id);
          const avgFinal = uc?.average ?? -1;
          const state =
            USER_PROGRESS.find((u) => u.value === uc?.state) ??
            USER_PROGRESS.find((u) => u.value === NOT_INIT)!;
          return (
            <Table.Row key={user.id}>
              <Table.RowHeaderCell width={100}>{user.id}</Table.RowHeaderCell>
              <Table.Cell width={300}>{user.name}</Table.Cell>
              <Table.Cell width={250}>{user.email}</Table.Cell>
              <Table.Cell width={250}>{state.label}</Table.Cell>
              <Table.Cell
                justify={"center"}
                width={250}
                className={`font-semibold ${
                  avgFinal != -1
                    ? avgFinal >= MIN_NOTE_APPROVED
                      ? "text-blue-600"
                      : "text-red-600"
                    : ""
                }`}
              >
                {avgFinal != -1 ? avgFinal.toString().padStart(2, "0") : ""}
              </Table.Cell>
              <Table.Cell width={100}>
                <Button
                  disabled={
                    (onCompute && user.id === computedIndex) ||
                    state.value === NOT_INIT
                  }
                  onClick={() => handleCompute(user.id)}
                  color="green"
                  size="3"
                >
                  <MdCalculate />
                </Button>
              </Table.Cell>
              <Table.Cell width={100}>
                <UserForm target={user} />
              </Table.Cell>
              <Table.Cell width={100}>
                <Button
                  disabled={onDelete && user.id === deletedIndex}
                  onClick={() => handleDelete(user.id)}
                  color="red"
                  size="3"
                >
                  <AiFillDelete />
                </Button>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
};

export default UserList;
