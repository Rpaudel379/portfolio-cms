import { Card, CardContent } from "@/components/ui/card";
import { ProjectSchemaDTO } from "@/schema/project.schema";
import { BarChart3Icon } from "lucide-react";

type Props = {
  projects: ProjectSchemaDTO[];
};

export const ProjectStats = ({ projects }: Props) => {
  const stats = {
    total: projects.length,
    live: projects.filter((p) => p.status === "LIVE").length,
    development: projects.filter((p) => p.status === "DEVELOPMENT").length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <BarChart3Icon className="h-4 w-4 text-primary" />
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Projects</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <div>
              <p className="text-2xl font-bold">{stats.live}</p>
              <p className="text-sm text-muted-foreground">Live Projects</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <div>
              <p className="text-2xl font-bold">{stats.development}</p>
              <p className="text-sm text-muted-foreground">In Development</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
