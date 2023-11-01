import LoginController from '@/controllers/login-controller';
import React from 'react'

const Portafolio = async () => {
  await LoginController.getInstance().loginIsRequiredServer();

  return (
    <div>Portafolio</div>
  )
}

export default Portafolio