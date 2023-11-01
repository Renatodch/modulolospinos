import { loginIsRequiredServer } from '@/lib/auth';
import React from 'react'

const Registrar = async () => {
  await loginIsRequiredServer();

  return (
    <div>Registrar</div>
  )
}

export default Registrar