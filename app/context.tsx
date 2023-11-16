"use client";
import { User } from "@/model/types";
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
  visibleToasts?: number | null | undefined;
  setVisibleToasts: Dispatch<SetStateAction<number | null | undefined>>;
}

const UserContext = createContext<UserContextProps>({
  user: undefined,
  setUser: () => undefined,
  visibleToasts: null,
  setVisibleToasts: () => undefined,
});

export const UserContextProvider = (props: {
  children: any;
  _user?: User | null | undefined;
  _visibleToasts?: number | null;
}) => {
  const [user, setUser] = useState(props._user);
  const [visibleToasts, setVisibleToasts] = useState(props._visibleToasts);

  return (
    <UserContext.Provider
      value={{ user, setUser, visibleToasts, setVisibleToasts }}
    >
      {props.children}
      <Toaster richColors visibleToasts={7} />
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
