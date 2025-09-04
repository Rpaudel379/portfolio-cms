import { ThemeToggle } from "@/components/themes/theme-toggle";
import { NavbarItems } from "@/components/navbar/navbar.types";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Code, Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export const MobileNav = ({ items, pathname }: NavbarItems) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center gap-2">
      <ThemeToggle />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full hover:bg-muted/80 transition-colors"
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[300px] border-l-0 bg-background/95 backdrop-blur-xl"
          style={{ borderRadius: "24px 0 0 24px" }}
        >
          <div className="flex flex-col space-y-6 mt-8">
            <SheetTitle>
              <div className="ml-2 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                    <Code />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold">Anish Paudel</span>
                    <span className="text-xs text-muted-foreground">
                      Software Engineer
                    </span>
                  </div>
                </div>
              </div>
            </SheetTitle>
            <VisuallyHidden>
              <SheetDescription></SheetDescription>
            </VisuallyHidden>
            <div className="flex flex-col space-y-3">
              {items.map((item) => (
                <Link
                  prefetch={false}
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 text-lg font-medium rounded-xl transition-all duration-300",
                    pathname === item.href
                      ? "text-foreground bg-primary/10 border border-primary/20"
                      : "text-foreground/80 hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
