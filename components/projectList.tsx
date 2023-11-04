"use client";
import { Button, Card, Grid, Heading, Inset, Text } from "@radix-ui/themes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const ProjectList = () => {
  const router = useRouter();

  const projects = new Array(6).fill(0);
  const des =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tempor nibh nec felis cursus dignissim. Sed fermentum quam nec purus rutrum egestas. Cras lectus ante, bibendum eu ultrices maximus, facilisis commodo metus. Pellentesque ac suscipit felis. Donec laoreet fermentum ipsum, maximus rutrum enim pharetra vel. Suspendisse lacinia ante tellus. Quisque sed efficitur ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Cras felis est, vulputate eget euismod sit amet, lacinia at orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed velit metus, blandit in tortor sit amet, varius sagittis diam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec condimentum volutpat massa ut rhoncus. Sed mauris urna, malesuada id risus ut, ultrices aliquam elit. Maecenas iaculis, ligula ornare euismod tincidunt, massa nisi sodales sapien, a fermentum leo dolor at leo. ";

  const handleClick = (id: number) => {
    router.push(`portafolio/${id}`);
  };
  return (
    <div className="w-full px-16 py-8">
      <div className="flex flex-row flex-wrap gap-5">
        {projects.map((p, index) => (
          <div
            key={index}
            style={{ minWidth: "300px" }}
            className="flex-1 shadow-md shadow-gray-400 py-6 px-4"
          >
            <p className="text-xl font-bold mb-4">
              Titulo de proyecto {index + 1}
            </p>
            <p
              className="text-justify mb-4"
              style={{
                display: "-webkit-box",
                textOverflow: "ellipsis",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                WebkitLineClamp: 10,
              }}
            >
              {des}
            </p>
            <Button size="3" onClick={() => handleClick(index + 1)}>
              Ver
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
