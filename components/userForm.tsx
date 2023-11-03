"use client"
import { useUserContext } from '@/app/context';
import React, { EventHandler, MouseEventHandler, useState } from 'react'
import NotAllowed from './notAllowed';
import { Button, Flex, TextField } from '@radix-ui/themes';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import {AiFillEye,AiFillEyeInvisible} from "react-icons/ai"
import { saveUser } from '@/lib/user-controller';
import { User } from '@/entities/entities';
interface UserForm{
  name:string;
  password:string;
  email:string;
}

const UserForm = () => {
  const {user, } = useUserContext();
  const isStudent = !user?.type || +user?.type === 0

  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean | null>(null);
  const [passHidden, setPassHidden] = useState<boolean | null>(true);

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const onSubmit = async (data: FieldValues) => {
    setSubmitted(true)
    const user:User = {
      type:"0",
      password: data.password,
      name: data.name,
      email: data.email,
      id:""
    }
    const res = await saveUser(user)
    setSubmitted(false)
  }
  
  const togglePassword =(e:any)=>{
    setPassHidden(!passHidden)
  }

  return isStudent?(<NotAllowed/>):(
    <div className="flex flex-wrap justify-center font-semibold w-1/2  p-10 shadow-md bg-slate-50">
      <h1 className='text-lg mb-5'>Formulario de Nuevo Estudiante</h1>
      <form
        className='w-full'
        onSubmit={handleSubmit(onSubmit)}
      >
        {error && (
          <span className="p-4 mb-2 text-lg font-semibold text-white bg-red-500 rounded-md">
            {error}
          </span>
        )}
        <Flex direction="column" gap="4">
          <TextField.Input maxLength={32} size="3" color="gray" variant="surface" placeholder="Nombres Completos*" {...register("name",{
            required:true,
            maxLength:32,
          })}/>
          {errors.name?.type === "required" && (
            <span role="alert" className="font-semibold text-red-500 ">Es requerido el nombre del estudiante</span>
          )}
          <TextField.Input maxLength={64} size="3" color="gray" variant="surface" placeholder="Correo" {...register("email",{
            maxLength:64,
            pattern:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
          })}/>
          {errors.email?.type === "pattern" && (
            <span role="alert" className="font-semibold text-red-500 ">Correo electrónico inválido</span>
          )}
          <TextField.Root>
            <TextField.Input maxLength={32} size="3" type={passHidden?"password":"text"} color="gray" variant="surface" placeholder="Contraseña*" {...register("password",{
              required:true,
              maxLength:32,
            })}/> 
            <TextField.Slot>
              <Button type="button" variant="ghost" onClick={togglePassword}>
                {passHidden? <AiFillEye size={20} />:<AiFillEyeInvisible size={20} />} 
              </Button>
            </TextField.Slot>
          </TextField.Root>
          {errors.password?.type === "required" && (
            <span role="alert" className="font-semibold text-red-500 ">Es requerida la contraseña del estudiante</span>
          )}

          <p>(*) campos obligatorios</p>
          <Button size="3" disabled={Boolean(submitted)}>Registrar</Button>
        </Flex>
      </form>
    </div>
  )
}

export default UserForm