"use client";
import { Task, User, User_Course } from "@/model/types";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { Toaster } from "sonner";

interface UserContextProps {
  user?: User | null;
  setUser: Dispatch<SetStateAction<User | null | undefined>>;
  user_course?: User_Course | null;
  setUserCourse: Dispatch<SetStateAction<User_Course | null | undefined>>;
  task?: Task | null;
  setTask: Dispatch<SetStateAction<Task | null | undefined>>;
}

const UserContext = createContext<UserContextProps>({
  user: undefined,
  setUser: () => undefined,
  user_course: undefined,
  setUserCourse: () => undefined,
  task: undefined,
  setTask: () => undefined,
});

export const UserContextProvider = (props: {
  children: any;
  _user?: User | null;
  _user_course?: User_Course | null;
  _task?: Task | null;
}) => {
  const [user, setUser] = useState(props._user);
  const [user_course, setUserCourse] = useState(props._user_course);
  const [task, setTask] = useState(props._task);

  return (
    <UserContext.Provider
      value={{ user, setUser, user_course, setUserCourse, task, setTask }}
    >
      {props.children}
      <Toaster richColors visibleToasts={1} />
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
