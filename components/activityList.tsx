"use client";
import { deleteActivityById } from "@/controllers/activity.controller";
import { getTasks } from "@/controllers/task.controller";
import {
  ACTIVITY_TYPES,
  Activity,
  SUBJECTS_COURSE,
  TOAST_ACTIVITY_DELETE_ERROR,
  TOAST_ACTIVITY_DELETE_SUCCESS,
} from "@/model/types";
import { Button, Table } from "@radix-ui/themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { toast } from "sonner";
import ActivityForm from "./activityForm";

const ActivityList = ({ activities }: { activities: Activity[] }) => {
  const router = useRouter();
  const [onDelete, setOnDelete] = useState<boolean>(false);
  const [deletedIndex, setDeletedIndex] = useState<number | null>(null);
  const handleDeleteActivity = async (id: number) => {
    setDeletedIndex(id);
    setOnDelete(true);

    const tasks = await getTasks(undefined, undefined, id);
    if (tasks.length > 0) {
      toast.error(TOAST_ACTIVITY_DELETE_ERROR);
    } else {
      await deleteActivityById(id);
      toast.success(TOAST_ACTIVITY_DELETE_SUCCESS);
    }
    setOnDelete(false);
    setDeletedIndex(null);
    router.refresh();
  };
  return (
    <Table.Root className="w-full">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Id</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Título</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Tipo</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Tema</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Rubrica</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Modificar</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Borrar</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {activities.map((activity) => {
          return (
            <Table.Row key={activity.id}>
              <Table.RowHeaderCell width={100}>
                {activity.id}
              </Table.RowHeaderCell>
              <Table.Cell width={300}>{activity.title}</Table.Cell>
              <Table.Cell width={250}>
                {ACTIVITY_TYPES.find((a) => a.value === activity.type)?.name}
              </Table.Cell>
              <Table.Cell width={250}>
                {
                  SUBJECTS_COURSE.find((s) => s.value === activity.subject)
                    ?.title
                }
              </Table.Cell>
              <Table.Cell width={250}>
                {activity.rubric ? (
                  <Link href={activity.rubric} className="rubric_link">
                    DESCARGAR RUBRICA
                  </Link>
                ) : (
                  <span className="italic">Sin Rúbrica</span>
                )}
              </Table.Cell>
              <Table.Cell width={100}>
                <ActivityForm target={activity} />
              </Table.Cell>
              <Table.Cell width={100}>
                <Button
                  disabled={onDelete && activity.id === deletedIndex}
                  onClick={() => handleDeleteActivity(activity.id)}
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

export default ActivityList;
