"use client";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { User } from "@/entities/entities";

interface UserContextProps {
  user?: User;
  setUser: Dispatch<SetStateAction<User>>;
}

const UserContext = createContext<UserContextProps>({
  user: undefined,
  setUser: () => undefined,
});

export const UserContextProvider = (props: { children: any; _user: User }) => {
  const [user, setUser] = useState(props._user);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
