import { DefaultUser } from "next-auth";

export interface User extends DefaultUser{
    password:string;
    type:string;
}

export interface _Course{
    fullname:string;
    id:string;
    password:string;
}

