import { IconFile, IconFileTypePdf } from "@tabler/icons-react";
import Image from "next/image";
import React from "react";

type Props = {
  object: {
    url: string;
    id: string;
    name: string;
    mimetype: string | undefined;
  };
};

const Thumbnail = ({ object }: Props) => {
  let logo;

  switch (true) {
    case object.mimetype?.includes("image"):
      logo = (
        <Image
          src={object.url}
          alt={object.name}
          fill
          style={{ objectFit: "cover" }}
        />
      );
      break;
    case object.mimetype?.includes("pdf"):
      logo = <IconFileTypePdf className="w-full h-full" />;
      break;
    default:
      logo = <IconFile className="w-full h-full" />;
  }

  return (
    <div key={object.id} title={object.name}>
      <div className="relative h-[100px] w-[100px] rounded-lg overflow-hidden cursor-pointer hover:opacity-50">
        {logo}
      </div>
      <div>
        <p className="">{object.name.slice(0, 10)}...</p>
      </div>
    </div>
  );
};

export default Thumbnail;
