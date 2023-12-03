"use client";
import { deleteActivityById } from "@/controllers/activity.controller";
import { getTasks } from "@/controllers/task.controller";
import {
  ACTIVITY_TYPES,
  Activity,
  Subject,
  TOAST_ACTIVITY_DELETE_ERROR,
  TOAST_ACTIVITY_DELETE_SUCCESS,
  TOAST_BD_ERROR,
  TOAST_DELETING,
} from "@/model/types";
import { Button, Table } from "@radix-ui/themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { toast } from "sonner";
import ActivityForm from "./activityForm";

const ActivityList = ({
  activities,
  subjects,
}: {
  activities: Activity[];
  subjects: Subject[];
}) => {
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
        {activities.map((activity) => (
          <React.Fragment key={activity.id}>
            <ActivityListRow activity={activity} subjects={subjects} />
          </React.Fragment>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const ActivityListRow = ({
  activity,
  subjects,
}: {
  activity: Activity;
  subjects: Subject[];
}) => {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDeleteActivity = () => {
    const id = activity.id;
    setDeleting(true);

    toast.promise(
      new Promise((resolve, reject) => {
        getTasks(undefined, undefined, id)
          .then((tasks) => {
            if (tasks.length > 0) {
              reject(1);
              return;
            }
            return deleteActivityById(id);
          })
          .then(resolve)
          .catch(reject);
      }),
      {
        loading: TOAST_DELETING,
        success: () => {
          return TOAST_ACTIVITY_DELETE_SUCCESS;
        },
        error: (val: number) => {
          setDeleting(false);
          return val === 1 ? TOAST_ACTIVITY_DELETE_ERROR : TOAST_BD_ERROR;
        },
        finally: () => {
          router.refresh();
        },
      }
    );
  };

  return (
    <Table.Row key={activity.id}>
      <Table.RowHeaderCell width={100}>{activity.id}</Table.RowHeaderCell>
      <Table.Cell width={300}>{activity.title}</Table.Cell>
      <Table.Cell width={250}>
        {ACTIVITY_TYPES.find((a) => a.value === activity.type)?.name}
      </Table.Cell>
      <Table.Cell width={250}>
        {subjects.find((s) => s.id === activity.id_subject)?.title}
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
          disabled={deleting}
          onClick={handleDeleteActivity}
          color="red"
          size="3"
        >
          <AiFillDelete />
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

export default ActivityList;
