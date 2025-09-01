import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { projectCategoryEnums } from "@/const";
import { Filter } from "lucide-react";
import React from "react";

type Props = {
  filterCategory: string;
  setFilterCategory: (value: React.SetStateAction<string>) => void;
  sortBy: string;
  setSortBy: (value: React.SetStateAction<string>) => void;
};

const FilterSort = ({
  filterCategory,
  setFilterCategory,
  sortBy,
  setSortBy,
}: Props) => {
  return (
    <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
      {/* Category Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span>Filter by:</span>
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {projectCategoryEnums.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* {categories.map((category) => (
          <Badge
            key={category}
            variant={category === selectedCategory ? "default" : "outline"}
            className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
              category === selectedCategory
                ? "bg-primary text-primary-foreground shadow-lg"
                : "hover:bg-primary/10 hover:border-primary/30"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))} */}
      </div>

      {/* Sort and View Options */}
      <div className="flex items-center gap-3">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterSort;
