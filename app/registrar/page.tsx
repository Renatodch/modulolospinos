import LoginController from '@/controllers/login-controller';
import React from 'react'

const Registrar = async () => {
  await LoginController.getInstance().loginIsRequiredServer();

  return (
    <div>Registrar</div>
  )
}

export default Registrar