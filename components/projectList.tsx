"use client";
import { MIN_SCORE_APPROVED, PRIMARY_COLOR, Task } from "@/model/types";
import { Button, Card, Inset, Strong } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
const ProjectList = ({ projects }: { projects: Task[] }) => {
  return (
    <div className="flex flex-wrap gap-5 w-full">
      {projects.map((p) => (
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
              <Image src={p.image1} fill alt={p.title ?? ""} />
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
            {p.score === null && <p className="text-base">Pendiente</p>}
            {p.score !== null && (
              <p
                className={`${
                  p.score >= MIN_SCORE_APPROVED
                    ? "text-blue-600"
                    : "text-red-600"
                } text-base`}
              >
                {p.score}/20
              </p>
            )}
            <Button size="3" style={{ backgroundColor: PRIMARY_COLOR }}>
              <Link target="_blank" href={`/curso/portafolio/${p.id}`}>
                Ver
              </Link>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProjectList;
