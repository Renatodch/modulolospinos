import { loginIsRequiredServer } from '@/lib/auth';
import React from 'react'

const Cursos = async () => {
  await loginIsRequiredServer();

  return (
    <div>Cursos</div>
  )
}

export default Cursos