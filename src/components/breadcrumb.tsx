import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  Breadcrumb as BreadCrumbUI,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

type BreadcrumbProps = {
  basePath?: string; // defaults to "/dashboard/storage"
  pathSegments: string[];
};
export const Breadcrumb = ({
  basePath = "/dashboard/storage",
  pathSegments,
}: BreadcrumbProps) => {
  return (
    <BreadCrumbUI>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={""}>Root</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </BreadCrumbUI>
  );
};
