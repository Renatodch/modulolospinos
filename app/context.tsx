"use client";
import { User, User_Course } from "@/model/types";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { Toaster } from "sonner";

interface UserContextProps {
  user?: User | null | undefined;
  setUser: Dispatch<SetStateAction<User | null | undefined>>;
  user_course?: User_Course | null | undefined;
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
  _user?: User | null | undefined;
  _user_course?: User_Course | null | undefined;
}) => {
  const [user, setUser] = useState(props._user);
  const [user_course, setUserCourse] = useState(props._user_course);

  return (
    <UserContext.Provider value={{ user, setUser, user_course, setUserCourse }}>
      {props.children}
      <Toaster richColors visibleToasts={7} />
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
