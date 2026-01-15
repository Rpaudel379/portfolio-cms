import Link from "next/link";

const NotFound = () => {
  return (
    <div className="h-[90vh] flex flex-col items-center justify-center gap-10">
      <h1>Project not found</h1>
      <Link
        href={"/dashboard/projects"}
        className="bg-accent w-fit p-2 rounded-lg hover:bg-primary-foreground"
      >
        Go to projects
      </Link>
    </div>
  );
};

export default NotFound;
