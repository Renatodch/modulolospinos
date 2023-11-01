import { loginIsRequiredServer } from '@/lib/auth';
import React from 'react'

const Portafolio = async () => {
  await loginIsRequiredServer();

  return (
    <div>Portafolio</div>
  )
}

export default Portafolio