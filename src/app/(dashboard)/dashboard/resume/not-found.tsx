import Link from "next/link";
import React from "react";

type Props = {};

const NotFound = (props: Props) => {
  return (
    <div className="h-[90vh] flex flex-col items-center justify-center gap-10">
      <h1>Bucket not found</h1>
      <Link
        href={"/dashboard/resume"}
        className="bg-accent w-fit p-2 rounded-lg hover:bg-primary-foreground"
      >
        Go to resume
      </Link>
    </div>
  );
};

export default NotFound;
