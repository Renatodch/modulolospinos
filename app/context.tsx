"use client";
import { Project, User, User_Course } from "@/types/types";
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
  project?: Project | null;
  setProject: Dispatch<SetStateAction<Project | null | undefined>>;
}

const UserContext = createContext<UserContextProps>({
  user: undefined,
  setUser: () => undefined,
  user_course: undefined,
  setUserCourse: () => undefined,
  project: undefined,
  setProject: () => undefined,
});

export const UserContextProvider = (props: {
  children: any;
  _user?: User | null;
  _user_course?: User_Course | null;
  _project?: Project | null;
}) => {
  const [user, setUser] = useState(props._user);
  const [user_course, setUserCourse] = useState(props._user_course);
  const [project, setProject] = useState(props._project);
  return (
    <UserContext.Provider
      value={{ user, setUser, user_course, setUserCourse, project, setProject }}
    >
      {props.children}
      <Toaster richColors />
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
