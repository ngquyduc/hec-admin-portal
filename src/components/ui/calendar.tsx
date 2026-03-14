"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col gap-4 sm:flex-row",
        month: "relative flex w-full flex-col gap-4",
        nav: "pointer-events-none absolute inset-x-0 top-3 z-10 flex h-8 items-center justify-between px-3",
        button_previous: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "pointer-events-auto h-8 w-8 cursor-pointer bg-transparent p-0 opacity-80 hover:opacity-100"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "pointer-events-auto h-8 w-8 cursor-pointer bg-transparent p-0 opacity-80 hover:opacity-100"
        ),
        caption: "flex h-8 w-full items-center justify-center gap-2 px-10",
        month_caption: "flex h-8 w-full items-center justify-center gap-2 px-10",
        dropdowns: "flex items-center justify-center gap-2",
        dropdown:
          "h-8 cursor-pointer rounded-md border border-input bg-background px-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        dropdown_root: "cursor-pointer",
        months_dropdown: "cursor-pointer",
        years_dropdown: "cursor-pointer",
        caption_label: "text-sm font-medium",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "text-muted-foreground w-9 rounded-md text-[0.8rem] font-normal",
        week: "mt-2 flex w-full",
        day: "h-9 w-9 p-0 text-center text-sm font-normal rounded-md hover:bg-accent hover:text-accent-foreground",
        day_button: "h-9 w-9 cursor-pointer p-0",
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside: "text-muted-foreground opacity-50",
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: iconClassName, ...iconProps }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("h-4 w-4", iconClassName)} {...iconProps} />
          ) : (
            <ChevronRight className={cn("h-4 w-4", iconClassName)} {...iconProps} />
          ),
      }}
      {...props}
    />
  )
}

export { Calendar }