import { loginIsRequiredServer } from '@/lib/login-controller';
import React from 'react'

const Cursos = async () => {
  await loginIsRequiredServer()
  return (
    <div>Cursos</div>
  )
}

export default Cursos