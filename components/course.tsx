"use client";
import React from "react";
import Image from "next/image";
import mainPicture from "../public/curso.jpg";
import { AiFillStar, AiOutlineClockCircle } from "react-icons/ai";
import { Button, Flex, Inset, Slider } from "@radix-ui/themes";
import { PiStudentBold } from "react-icons/pi";
import { TbAntennaBars5 } from "react-icons/tb";
import { BiRefresh } from "react-icons/bi";
const Course = () => {
  const stars = new Array(5).fill(0);
  return (
    <div className="flex flex-col items-center justify-center w-full px-16 py-8 gap-6">
      <div className="flex flex-col items-start justify-center w-full">
        <p className="font-bold text-2xl flex mb-8">
          {stars.map((s, index) => (
            <AiFillStar key={index} className="text-yellow-400" />
          ))}
        </p>
        <p className="font-bold text-2xl mb-8">Fracciones para principiantes</p>
        <p className="text-base mb-8 text-gray-500">Sin categoria</p>
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-16">
        <Image
          className="lg:w-2/3 w-full"
          src={mainPicture}
          width={700}
          height={400}
          alt="imagen del curso"
        />
        <div className="lg:w-1/3 w-full flex-col self-stretch border-4 border-gray-300 rounded-md ">
          <div className="bg-gray-200 box-border px-8 py-12 w-full h-3/5">
            <Inset className="flex flex-col" side="top" pb="current">
              <p className="font-bold text-lg mb-4">Progreso del curso</p>
              <p className="flex justify-between mb-4">
                <span>0/5</span>
                <span>0% Completado</span>
              </p>
              <Slider color="blue" value={[0]} className="mb-8" />
              <Button size="3">Empezar el aprendizaje</Button>
            </Inset>
          </div>
          <div className="p-4 w-full h-2/5 flex flex-col items-center justify-center overflow-hidden">
            <div className="">
              <Flex justify="between" height={"6"}>
                <TbAntennaBars5 size="20" className="inline-block mr-6" />
                <p className="mr-auto">Principiante</p>
              </Flex>
              <Flex justify="between" height={"6"}>
                <PiStudentBold size="20" className="inline-block mr-6" />
                <p className="mr-auto">8 Total de inscritos</p>
              </Flex>
              <Flex justify="between" height={"6"}>
                <AiOutlineClockCircle size="20" className="inline-block mr-6" />
                <p className="mr-auto">1 hora Duracion</p>
              </Flex>
              <Flex justify="between" height={"6"}>
                <BiRefresh size="20" className="inline-block mr-6" />
                <p className="mr-auto">
                  28 de octubre de 2023 Última actualización
                </p>
              </Flex>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
