"use client";
import { deleteSubjectById } from "@/controllers/subject.controller";
import { Subject, TOAST_SUBJECT_DELETE_SUCCESS } from "@/model/types";
import { Button, Table } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { toast } from "sonner";
import SubjectForm from "./subjectForm";

const SubjectList = ({ subjects }: { subjects: Subject[] }) => {
  const router = useRouter();
  const [onDelete, setOnDelete] = useState<boolean>(false);
  const [deletedIndex, setDeletedIndex] = useState<number | null>(null);
  const handleDelete = async (id: number) => {
    setDeletedIndex(id);
    setOnDelete(true);
    await deleteSubjectById(id);
    setOnDelete(false);
    setDeletedIndex(null);
    toast.success(TOAST_SUBJECT_DELETE_SUCCESS);
    router.refresh();
  };

  return (
    <Table.Root className="w-full">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Id</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Título</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Orden</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Modificar</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Borrar</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {subjects.map((subject) => {
          return (
            <Table.Row key={subject.id}>
              <Table.RowHeaderCell width={100}>
                {subject.id}
              </Table.RowHeaderCell>
              <Table.Cell width={300}>{subject.title}</Table.Cell>
              <Table.Cell width={250}>{subject.value}</Table.Cell>
              <Table.Cell width={100}>
                <SubjectForm target={subject} />
              </Table.Cell>
              <Table.Cell width={100}>
                <Button
                  disabled={onDelete && subject.id === deletedIndex}
                  onClick={() => handleDelete(subject.id)}
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

export default SubjectList;
