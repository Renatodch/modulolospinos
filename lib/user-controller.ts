"use server";
import { Responses } from "@/utils/responses";


import { NextAuthOptions, getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { Query, sql } from "@vercel/postgres";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { User } from "@/entities/entities";
import { prisma } from "./prisma";

export const saveUser = async (user:User)=>{
  try {
    const res = await sql`INSERT INTO usuario (password, type, email, name)
    VALUES (${user.password}, ${user.type}, ${user.email}, ${user.name});` 
    return res
  } catch (e) {
    console.log("Error: ",e);
  }
}

export const getUserById = async (id:string)=>{
  try {
    const { rows } = await sql`SELECT * FROM usuario WHERE id=${id};`;
    if(rows.length>0){
      return rows[0] as User
    }            
  } catch (e) {
      console.log("Error: ",e);
  }
}

export const getUserByEmail = async (email:string)=>{
  try {
    const res = await prisma.usuario.findFirst({
      where:{
        email
      }
    })

    if(res){
      return res
    }            
  } catch (e) {
      console.log("Error: ",e);
  }
}