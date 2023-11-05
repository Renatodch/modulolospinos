"use client";
import { User, User_Course } from "@/types/types";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface UserContextProps {
  user?: User | null;
  setUser: Dispatch<SetStateAction<User | null | undefined>>;
  user_course?: User_Course | null;
  setUserCourse: Dispatch<SetStateAction<User_Course | null | undefined>>;
}
interface UserCourseContextProps {
  user?: User | null;
  setUser: Dispatch<SetStateAction<User | null | undefined>>;
  user_course?: User_Course | null;
  setUserCourse: Dispatch<SetStateAction<User_Course | null | undefined>>;
}

const UserContext = createContext<UserContextProps>({
  user: undefined,
  setUser: () => undefined,
  user_course: undefined,
  setUserCourse: () => undefined,
});

export const UserContextProvider = (props: {
  children: any;
  _user?: User | null;
  _user_course?: User_Course | null;
}) => {
  const [user, setUser] = useState(props._user);
  const [user_course, setUserCourse] = useState(props._user_course);
  return (
    <UserContext.Provider value={{ user, setUser, user_course, setUserCourse }}>
      {props.children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
