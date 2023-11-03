import UserForm from '@/components/userForm';
import { loginIsRequiredServer } from '@/lib/login-controller';
import React from 'react'

const Registrar = async () => {
  await loginIsRequiredServer();

  return (
    <div className="flex items-center justify-center py-16 px-32 w-full">
      <UserForm/>
    </div>
  )
}

export default Registrar