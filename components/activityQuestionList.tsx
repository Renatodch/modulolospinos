"use client";
import { Activity, PRIMARY_COLOR } from "@/model/types";
import { Button, Card, Strong } from "@radix-ui/themes";
import Link from "next/link";
const ActivityQuestionList = ({ activities }: { activities: Activity[] }) => {
  return (
    <div className="flex flex-wrap gap-5 w-full">
      {activities.map((p) => (
        <Card
          key={p.id}
          size="2"
          style={{ minWidth: "440px", maxWidth: "440px", height: "230px" }}
          className="flex-1"
        >
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
            <Button size="3" style={{ backgroundColor: PRIMARY_COLOR }}>
              <Link target="_blank" href={`/curso/preguntas/${p.id}`}>
                Ver
              </Link>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ActivityQuestionList;
