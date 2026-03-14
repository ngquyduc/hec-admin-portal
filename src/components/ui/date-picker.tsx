"use client"

import * as React from "react"
import { format, isValid, parseISO } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  value?: string
  onChange: (value?: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  fromYear?: number
  toYear?: number
}

export function DatePicker({
  value,
  onChange,
  placeholder = "yyyy-mm-dd",
  disabled,
  className,
  fromYear,
  toYear,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const parseInputDate = React.useCallback((text: string) => {
    const parsed = parseISO(text)
    return isValid(parsed) ? parsed : undefined
  }, [])

  const selectedDate = React.useMemo(() => {
    const fromInput = value ? parseInputDate(value) : undefined
    if (fromInput) return fromInput

    return undefined
  }, [parseInputDate, value])

  const [visibleMonth, setVisibleMonth] = React.useState<Date | undefined>(selectedDate)

  React.useEffect(() => {
    if (!open) return

    setVisibleMonth(selectedDate ?? new Date())
  }, [open, selectedDate])

  const commitInput = React.useCallback(() => {
    const normalized = value?.trim() ?? ""

    if (!normalized) {
      onChange(undefined)
      return
    }

    const parsed = parseInputDate(normalized)
    if (!parsed) return

    onChange(format(parsed, "yyyy-MM-dd"))
  }, [onChange, parseInputDate, value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={cn("flex w-full", className)}>
        <Input
          type="date"
          placeholder={placeholder}
          value={value ?? ""}
          disabled={disabled}
          inputMode="numeric"
          pattern="\\d{4}-\\d{2}-\\d{2}"
          onChange={(e) => onChange(e.target.value || undefined)}
          onBlur={commitInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              commitInput()
            }
          }}
          className="rounded-r-none border-r-0"
        />
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={disabled}
            className="h-9 w-9 rounded-l-none"
            aria-label="Open date picker"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          month={visibleMonth}
          onMonthChange={setVisibleMonth}
          captionLayout="dropdown"
          fromYear={fromYear ?? 1950}
          toYear={toYear ?? new Date().getFullYear() + 10}
          classNames={{
            caption_label: "sr-only",
          }}
          onSelect={(date) => {
            onChange(date ? format(date, "yyyy-MM-dd") : undefined)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}