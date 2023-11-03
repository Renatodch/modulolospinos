"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from "next-auth/react";


function Navbar(){
    const currentPath = usePathname()
    const {user, } = useUserContext();
    useEffect(()=>{
        if(user?.id === "") signOut()
    })
  return (
    <div className="flex items-center w-full h-16 bg-base-100 px-14 border-b-2">
        <div className="justify-start lg:w-2/5">
            <div className="dropdown">
                <label tabIndex={0} className="btn btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                </label>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                    <Links currentPath={currentPath}/>
                </ul>
            </div>
            <Link href="/" className="font-semibold normal-case text-2xl">modulolospinos</Link>
        </div>
        <div className="justify-end w-3/5 hidden lg:flex">
            <ul className="menu menu-horizontal space-x-6">
                <Links currentPath={currentPath}/>  
            </ul>
        </div>
    </div>
   
  )
}

import React, { useContext, useEffect } from 'react'
import { User } from '@/entities/entities';
import { useUserContext } from '@/app/context';

const Links = async (props:{currentPath:string}) => {
    const {user, } = useUserContext();

    const links=[
        {
            label:"Inicio",
            href:"/"
        },
        {
            label:"Cursos",
            href:"/cursos"
        },
        {
            label:"Registrar Alumno",
            href:"/registrar"
        },
        {
            label:"Portafolio",
            href:"/portafolio"
        },
        {
            label:"Salir",
            href:"/signOut"
        },
    ]
    user?.type && +user?.type === 0 && links.splice(2,1)

  return (
    links.map(link=>
        link.href === "/signOut"?
        <button
            key={link.href}
            className={`text-zinc-400 hover:text-zinc-700 transition-colors text-base`}
            onClick={()=>signOut()}>{link.label}
        </button>:
        <Link 
            className={`${link.href === props.currentPath?'text-zinc-900':'text-zinc-400'} hover:text-zinc-700 transition-colors text-base`}
            href={link.href}
            key={link.href}>{link.label}
        </Link>
    )
  )
}


export default Navbar