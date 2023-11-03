import Image from "next/image"; 
import logo from "../../public/logo.webp"
import {BsFacebook} from "react-icons/bs"
import {BsWhatsapp} from "react-icons/bs"
import {BsYoutube} from "react-icons/bs"
import { getServerSession } from "next-auth";
import { loginIsRequiredServer } from "@/lib/login-controller";

export default async function Home() {
  await loginIsRequiredServer();

  return (
    <div className="flex items-center justify-center py-16 px-32 w-full">
      <div className="flex flex-row flex-wrap items-center justify-center w-auto">
        <Image src={logo} width={300} height={300}  alt="logo" /> 
        <div className="flex flex-col items-center w-2/4 mx-20">
          <div className="text-base text-justify">
            La Institución educativa Colegio 80892 Los Pinos se sitúa en el distrito de Trujillo, provincia de Trujillo, ésta I.E. corresponde a la UGEL 03 – TRUJILLO NOR OESTE la que vigila la institución educativa, y esta última pertenece a la Dirección regional de educación DRE LA LIBERTAD
          </div>
          <div className="flex justify-start items-center sdivace-x-2 w-full mt-9">
            <div className="bg-blue-700 w-12 h-12 flex justify-center items-center rounded-lg">
              <BsFacebook className="text-white	bg-blue-700" size={25}/>
            </div>
            <div className="bg-red-700 w-12 h-12 flex justify-center items-center rounded-lg mx-2">
              <BsYoutube className="text-white	bg-red-700" size={25}/>
            </div>
            <div className="bg-green-400 w-12 h-12 flex justify-center items-center rounded-lg">
              <BsWhatsapp className="text-white	bg-green-400" size={25}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
