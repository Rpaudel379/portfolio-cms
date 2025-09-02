"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileList } from "@/modules/dashboard/resume/file-list";
import { Upload } from "lucide-react";
import { FileObject } from "@supabase/storage-js";
import { ChangeEvent, useState } from "react";
import { replaceResume } from "@/app/(dashboard)/dashboard/resume/_actions";
import { toast } from "sonner";

type Props = {
  resumeList: FileObject[] | null;
};

export const ResumePageClient = ({ resumeList }: Props) => {
  const resume = resumeList?.find((list) => list.name.includes("resume.pdf"));

  const sde = resumeList?.find((list) => list.name.includes("sde.pdf"));

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    type: "resume" | "sde"
  ) => {
    try {
      setIsUploading(true);
      const file = e.target.files?.[0];
      if (file) {
        const res = await replaceResume(file, type);
        if (res.status === "success") {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      }
      e.target.value = "";
    } catch (error) {
      console.error(error);
      toast.error("something went wrong");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>Resume</span>
              </CardTitle>
              <CardDescription>
                Upload and manage your resume file
              </CardDescription>
            </div>
            <div className="relative cursor-pointer">
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileUpload(e, "resume")}
                className="absolute inset-0 w-full h-full opacity-0"
                disabled={isUploading}
              />
              <Button disabled={isUploading} size="sm">
                <Upload className="h-4 w-4 mr-2" />

                {isUploading ? "Replacing..." : "Replace"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <FileList file={resume} type="resume" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>SDE</span>
              </CardTitle>
              <CardDescription>
                Upload and manage your SDE portfolio file
              </CardDescription>
            </div>
            <div className="relative">
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                multiple
                onChange={(e) => handleFileUpload(e, "sde")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              <Button disabled={isUploading} size="sm">
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Replacing..." : "Replace"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <FileList file={sde} type="sde" />
        </CardContent>
      </Card>
    </div>
  );
};
