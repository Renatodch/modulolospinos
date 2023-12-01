"use client";
import { getActivities } from "@/controllers/activity.controller";
import {
  deleteSubjectById,
  getSubjects,
} from "@/controllers/subject.controller";
import {
  Subject,
  TOAST_BD_ERROR,
  TOAST_DELETING,
  TOAST_SUBJECT_DELETE_ERROR_ACTIVITIES,
  TOAST_SUBJECT_DELETE_ERROR_MIN,
  TOAST_SUBJECT_DELETE_SUCCESS,
} from "@/model/types";
import { Button, Table } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { toast } from "sonner";
import SubjectForm from "./subjectForm";

const SubjectList = ({ subjects }: { subjects: Subject[] }) => {
  return (
    <Table.Root className="w-full">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Id</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Orden</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Título</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Modificar</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Borrar</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {subjects.map((subject, index) => (
          <React.Fragment key={subject.id}>
            <SubjectListRow subject={subject} index={index} />
          </React.Fragment>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const SubjectListRow = ({
  subject,
  index,
}: {
  subject: Subject;
  index: number;
}) => {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = () => {
    const id_subject = subject.id;

    setDeleting(true);

    toast.promise(
      new Promise((resolve, reject) => {
        getSubjects()
          .then((subjects) => {
            if (subjects.length <= 1) {
              reject(2);
              return;
            }
            return getActivities(id_subject);
          })
          .then((res) => {
            if (res && res.length > 0) {
              reject(1);
              return;
            }
            return deleteSubjectById(id_subject);
          })
          .then(resolve)
          .catch(reject);
      }),
      {
        loading: TOAST_DELETING,
        success: () => {
          return TOAST_SUBJECT_DELETE_SUCCESS;
        },
        error: (val) => {
          setDeleting(false);
          return val === 2
            ? TOAST_SUBJECT_DELETE_ERROR_MIN
            : val === 1
            ? TOAST_SUBJECT_DELETE_ERROR_ACTIVITIES
            : TOAST_BD_ERROR;
        },
        finally: () => {
          router.refresh();
        },
      }
    );
  };

  return (
    <Table.Row key={subject.id}>
      <Table.RowHeaderCell width={100}>{subject.id}</Table.RowHeaderCell>
      <Table.Cell width={100}>#{index + 1}</Table.Cell>
      <Table.Cell width={300}>{subject.title}</Table.Cell>
      <Table.Cell width={100}>
        <SubjectForm target={subject} />
      </Table.Cell>
      <Table.Cell width={100}>
        <Button disabled={deleting} onClick={handleDelete} color="red" size="3">
          <AiFillDelete />
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

export default SubjectList;
