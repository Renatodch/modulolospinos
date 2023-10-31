import Image from "next/image"; 
import logo from "../public/logo.webp"
import {BsFacebook} from "react-icons/bs"
import {BsWhatsapp} from "react-icons/bs"
import {BsYoutube} from "react-icons/bs"
export default function Home() {
  return (
    <div className="flex flex-row items-center justify-between space-x-32 px-48">
      <Image src={logo} width={200} height={200}  alt="" /> 
      <div className="flex flex-col items-center">
        <p className="text-base text-justify">
          La Institución educativa Colegio 80892 Los Pinos se sitúa en el distrito de Trujillo, provincia de Trujillo, ésta I.E. corresponde a la UGEL 03 – TRUJILLO NOR OESTE la que vigila la institución educativa, y esta última pertenece a la Dirección regional de educación DRE LA LIBERTAD
        </p>
        <p className="flex justify-start items-center space-x-2 w-full">
          <div className="bg-blue-700 w-12 h-12 flex justify-center items-center rounded-lg">
            <BsFacebook className="text-white	bg-blue-700" size={25}/>
          </div>
          <div className="bg-red-700 w-12 h-12 flex justify-center items-center rounded-lg">
            <BsYoutube className="text-white	bg-red-700" size={25}/>
          </div>
          <div className="bg-green-400 w-12 h-12 flex justify-center items-center rounded-lg">
            <BsWhatsapp className="text-white	bg-green-400" size={25}/>
          </div>
        </p>
      </div>
    </div>
  )
}
