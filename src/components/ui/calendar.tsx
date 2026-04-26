"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DayPickerProps } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Calendar({
  className,
  showOutsideDays = true,
  ...props
}: DayPickerProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "relative flex flex-col gap-4 sm:flex-row",
        month: "space-y-4",
        month_caption: "relative flex h-8 items-center justify-center px-8",
        caption_label: "pointer-events-none text-sm font-medium",
        nav: "absolute inset-x-1 top-0 z-10 flex h-8 items-center justify-between",
        button_previous: cn(
          buttonVariants({ variant: "secondary" }),
          "left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        button_next: cn(
          buttonVariants({ variant: "secondary" }),
          "right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday:
          "text-muted-foreground w-8 rounded-md font-normal text-[0.8rem]",
        week: "mt-2 flex w-full",
        day: "relative h-8 w-8 text-center text-sm p-0",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
        ),
        selected:
          "!rounded-md !bg-primary !text-primary-foreground hover:!bg-primary hover:!text-primary-foreground focus:!bg-primary focus:!text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside:
          "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
      }}
      components={{
        Chevron: ({ orientation, className, ...chevronProps }) =>
          orientation === "left" ? (
            <ChevronLeft
              className={cn("h-4 w-4", className)}
              {...chevronProps}
            />
          ) : (
            <ChevronRight
              className={cn("h-4 w-4", className)}
              {...chevronProps}
            />
          ),
      }}
      {...props}
    />
  );
}

export { Calendar };
