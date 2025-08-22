import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import React from "react";

type Props = {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (value: React.SetStateAction<string>) => void;
  selectedSort: string;
  setSelectedSort: (value: React.SetStateAction<string>) => void;
  sortOptions: string[];
};

const FilterSort = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedSort,
  setSelectedSort,
  sortOptions,
}: Props) => {
  return (
    <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
      {/* Category Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span>Filter by:</span>
        </div>
        {categories.map((category) => (
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
        ))}
      </div>

      {/* Sort and View Options */}
      <div className="flex items-center gap-3">
        <Select value={selectedSort} onValueChange={setSelectedSort}>
          <SelectTrigger className="w-40 h-10 bg-card border-border/50 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterSort;
