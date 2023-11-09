"use client";
import { MIN_NOTE_APPROVED, Project } from "@/types/types";
import { Button, Card, Inset, Strong } from "@radix-ui/themes";
import Link from "next/link";
const ProjectList = ({ projects }: { projects: Project[] }) => {
  return (
    <div className="flex flex-wrap gap-5 w-full">
      {projects.map((p, index) => (
        <Card
          key={p.id}
          size="2"
          style={{ minWidth: "300px", maxWidth: "600px", height: "450px" }}
          className="flex-1"
        >
          <Inset side="top" pb="current">
            {p.image1 ? (
              <img
                src={p.image1}
                alt="Bold typography"
                style={{
                  display: "block",
                  width: "100%",
                  height: "240px",
                  backgroundColor: "gray",
                }}
              />
            ) : (
              <div style={{ height: "240px", backgroundColor: "gray" }}></div>
            )}
          </Inset>
          <p
            className="text-justify mb-4"
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
