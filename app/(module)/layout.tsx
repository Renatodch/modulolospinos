"use server"
import { NextAuthProvider } from "../providers";
//import { UserContext } from "../context";
import {getUserByEmail, getUserById} from "@/lib/user-controller";
import { useContext, useEffect, useState } from "react";
import { getServerSession } from "next-auth/next";
import {authConfig} from "@/lib/login-controller";
import { User } from "@/entities/entities";
import { UserContextProvider } from "../context";
import { Session } from "next-auth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default async function Layout({ children }: { children: any }) {
  let session= await getServerSession(authConfig);
  let res

  if(session){
    let _session:Session & {isGoogle:boolean, id:string} = (session as Session & {isGoogle:boolean, id:string})
    if(_session?.isGoogle){
      res = await getUserByEmail(_session.user?.email!)
    }else{
      res = await getUserById(_session.id!)
    }
  }

  const user:User = {
    password:"",
    id:""+(res?.id || ""),
    name:res?.name || "",
    type:res?.type || "",
    email:res?.email || "",
  }

  return (
    <UserContextProvider _user={user}>
      <Navbar/>
        <main>
          {children}
        </main>
      <Footer/>
    </UserContextProvider>
  );
}