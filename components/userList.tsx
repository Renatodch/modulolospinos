"use client";
import { useUserContext } from "@/app/context";
import { deleteUserById, getUserById } from "@/controllers/user.controller";
import {
  TOAST_BD_ERROR,
  TOAST_DELETING,
  TOAST_USER_DELETE_ERROR_1,
  TOAST_USER_DELETE_SUCCESS,
  User,
  getFormatId,
} from "@/model/types";
import { Button, Table } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { toast } from "sonner";
import UserForm from "./userForm";

const UserList = ({ users }: { users: User[] }) => {
  return (
    <Table.Root className="w-full">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Código</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Nombres Completos</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Modificar</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Borrar</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {users.map((user) => (
          <React.Fragment key={user.id}>
            <UserListRow _user={user} key={user.id} />
          </React.Fragment>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const UserListRow = ({ _user }: { _user: User }) => {
  const { user } = useUserContext();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const id_user = user?.id!;
  const handleDelete = () => {
    const id = _user.id;
    setDeleting(true);

    toast.promise(
      new Promise((resolve, reject) => {
        getUserById(id)
          .then((res) => {
            if (res && res?.id === id_user) {
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

  return (
    <Table.Row key={_user.id}>
      <Table.RowHeaderCell width={100}>
        {getFormatId(_user.id)}
      </Table.RowHeaderCell>
      <Table.Cell width={300}>{_user.name}</Table.Cell>
      <Table.Cell width={250}>{_user.email}</Table.Cell>
      <Table.Cell width={100}>
        <UserForm target={_user} />
      </Table.Cell>
      <Table.Cell width={100}>
        <Button disabled={deleting} onClick={handleDelete} color="red" size="3">
          <AiFillDelete />
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

export default UserList;
