"use client";
import { MIN_NOTE_APPROVED, Project } from "@/types/types";
import { Button, Card, Inset, Strong } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
const ProjectList = ({ projects }: { projects: Project[] }) => {
  return (
    <div className="flex flex-wrap gap-5 w-full">
      {projects.map((p, index) => (
        <Card
          key={p.id}
          size="2"
          style={{ minWidth: "440px", maxWidth: "440px", height: "450px" }}
          className="flex-1"
        >
          <Inset
            side="top"
            style={{
              height: "240px",
              backgroundColor: "gray",
              position: "relative",
            }}
          >
            {p.image1 ? (
              <Image src={p.image1} fill alt={p.title} />
            ) : (
              <div style={{ height: "100%" }}></div>
            )}
          </Inset>
          <p
            className="text-justify mt-4 mb-4"
            style={{
              display: "-webkit-box",
              textOverflow: "ellipsis",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              WebkitLineClamp: 1,
              height: "25px",
            }}
          >
            <Strong className="text-xl mb-4">{p.title}</Strong>
          </p>
          <p
            className=" mb-4"
            style={{
              display: "-webkit-box",
              textOverflow: "ellipsis",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              WebkitLineClamp: 3,
              height: "72px",
            }}
          >
            {p.description}
          </p>
          <div className="w-full flex justify-between items-center">
            {p.projectscore === null && <p className="text-base">Pendiente</p>}
            {p.projectscore && (
              <p
                className={`${
                  p.projectscore >= MIN_NOTE_APPROVED
                    ? "text-green-600"
                    : "text-red-600"
                } text-base`}
              >
                {p.projectscore}/20
              </p>
            )}
            <Button size="3">
              <Link href={`portafolio/${p.id}`}>Ver</Link>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProjectList;
