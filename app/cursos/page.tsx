import LoginController from '@/controllers/login-controller';
import React from 'react'

const Cursos = async () => {
  await LoginController.getInstance().loginIsRequiredServer()
  return (
    <div>Cursos</div>
  )
}

export default Cursos