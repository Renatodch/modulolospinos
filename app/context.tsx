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
}

const UserContext = createContext<UserContextProps>({
  user: undefined,
  setUser: () => undefined,
});

export const UserContextProvider = (props: {
  children: any;
  _user?: User | null | undefined;
}) => {
  const [user, setUser] = useState(props._user);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
      <Toaster richColors visibleToasts={7} />
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
