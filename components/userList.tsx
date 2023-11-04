"use client";
import { User } from "@/entities/entities";
import { deleteUserById, getUsers } from "@/lib/user-controller";
import { Button, Table, TextField } from "@radix-ui/themes";
import React, { useState } from "react";
import { AiFillDelete, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import UserForm from "./userForm";
import { useRouter } from "next/navigation";

const UserList = ({ users }: { users: User[] }) => {
  const router = useRouter();
  const [onDelete, setOnDelete] = useState<boolean>(false);
  const [deletedIndex, setDeletedIndex] = useState<number | null>(null);
  const handleDelete = async (id: string) => {
    setDeletedIndex(parseInt(id));
    setOnDelete(true);
    await deleteUserById(id);
    setOnDelete(false);
    setDeletedIndex(null);
    router.refresh();
  };
  return (
    <Table.Root className="w-full">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Id</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Nombres Completos</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Contraseña</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Modificar</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Borrar</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {users.map((user, index) => {
          return (
            <Table.Row key={user.id}>
              <Table.RowHeaderCell width={100}>{user.id}</Table.RowHeaderCell>
              <Table.Cell width={300}>{user.name}</Table.Cell>
              <Table.Cell width={250}>{user.email}</Table.Cell>
              <Table.Cell width={250}>
                <PasswordField password={user.password} />
              </Table.Cell>
              <Table.Cell width={100}>
                <UserForm target={user} />
              </Table.Cell>
              <Table.Cell width={100}>
                <Button
                  disabled={onDelete && parseInt(user.id) === deletedIndex}
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

const PasswordField = (props: { password: string }) => {
  const [passHidden, setPassHidden] = useState<boolean | null>(true);
  const togglePassword = () => {
    setPassHidden(!passHidden);
  };
  return (
    <TextField.Root>
      <TextField.Input
        readOnly
        value={props.password}
        size="2"
        type={passHidden ? "password" : "text"}
        color="gray"
        variant="surface"
        placeholder="Contraseña*"
      />
      <TextField.Slot>
        <Button type="button" variant="ghost" onClick={togglePassword}>
          {passHidden ? (
            <AiFillEye size={20} />
          ) : (
            <AiFillEyeInvisible size={20} />
          )}
        </Button>
      </TextField.Slot>
    </TextField.Root>
  );
};

export default UserList;