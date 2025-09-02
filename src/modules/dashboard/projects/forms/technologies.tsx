"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProjectCategoryEnum } from "@/schema/project.schema";
import { SkillSchemaDTO } from "@/schema/skill.schema";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2Icon } from "lucide-react";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { CategoryEnum } from "@/const";

type Technology = Record<string, string[]>;

type Props = {
  tags: SkillSchemaDTO[] | null;
  data?: Technology | null;
};

const Technologies = ({ tags, data }: Props) => {
  const { setValue, control } = useFormContext();

  const [technologies, setTechnologies] = useState<Technology>(data ?? {});

  const availableCategories = () => {
    const techCategories = Object.keys(technologies);
    return Object.values(CategoryEnum).filter(
      (cat) => !techCategories.find((existing) => existing === cat)
    );
  };

  const [selectedCategory, _] = useState("");

  const handleSelectedCategory = (category: string) => {
    setTechnologies((prev) => ({ ...prev, [category]: [] }));
  };

  const updateTechnology = (category: string, tags: string[]) => {
    setTechnologies((prev) => {
      const updated = {
        ...prev,
        [category]: tags,
      };
      if (tags.length == 0) {
        delete updated[category];
      }
      return updated;
    });
  };

  const deleteTechnology = (category: string) => {
    setTechnologies((prev) => {
      const updated = { ...prev };
      delete updated[category];
      return updated;
    });
  };

  const updateForm = () => {
    setValue("technologies", technologies);
  };

  useEffect(() => {
    if (Object.keys(technologies).length) {
      updateForm();
    }
  }, [technologies]);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Technologies</CardTitle>
          <CardDescription>
            Add technology categories and select skills for each
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={control}
            name="technologies"
            render={() => (
              <FormItem>
                <FormMessage />

                <div>
                  <Select
                    value={selectedCategory}
                    onValueChange={handleSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="select category, then add skills" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories().map((category) => (
                        <SelectItem value={category} key={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* pair */}
                <div className="space-y-5">
                  {Object.keys(technologies).map((category) => (
                    <Card className="bg-muted" key={category}>
                      <CardHeader>
                        <CardTitle>
                          <div className="flex justify-between">
                            <p>{category}</p>
                            <div
                              className=" cursor-pointer"
                              onClick={() => deleteTechnology(category)}
                            >
                              <Trash2Icon className="size-5 text-red-400 hover:text-red-500" />
                            </div>
                          </div>
                        </CardTitle>
                        <VisuallyHidden>
                          <CardDescription> </CardDescription>
                        </VisuallyHidden>
                      </CardHeader>

                      <CardContent>
                        <MultiSelect
                          onValuesChange={(tags: string[]) =>
                            updateTechnology(category, tags)
                          }
                          values={technologies[category]}
                        >
                          <MultiSelectTrigger className="w-full">
                            <MultiSelectValue
                              placeholder="select tags..."
                              overflowBehavior="wrap"
                            />
                          </MultiSelectTrigger>

                          <MultiSelectContent>
                            <MultiSelectGroup>
                              {tags?.map((tag) => (
                                <MultiSelectItem key={tag.id} value={tag.name}>
                                  {tag.name}
                                </MultiSelectItem>
                              ))}
                            </MultiSelectGroup>
                          </MultiSelectContent>
                        </MultiSelect>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {Object.keys(technologies).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No technology categories added yet.</p>
                    <p className="text-sm">
                      Add a category above to get started.
                    </p>
                  </div>
                )}
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Technologies;
