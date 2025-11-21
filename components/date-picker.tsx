"use client";

import * as React from "react";
import { ChevronDownIcon, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  label?: string;
  placeholder?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "outline";
  size?: "sm" | "default" | "lg";
  showIcon?: boolean;
  locale?: "es" | "en";
}

export function DatePicker({
  label,
  placeholder = "Seleccionar fecha",
  value,
  onChange,
  className,
  disabled = false,
  variant = "outline",
  size = "default",
  showIcon = true,
  locale = "es",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(value);

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    onChange?.(selectedDate);
    setOpen(false);
  };

  const formatDate = (date: Date) => {
    if (locale === "es") {
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: es });
    }
    return format(date, "MMMM dd, yyyy");
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-9 px-3 text-sm";
      case "lg":
        return "h-14 px-4 text-lg";
      default:
        return "h-10 px-4";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={variant}
            disabled={disabled}
            className={cn(
              "justify-between font-normal",
              getSizeClasses(),
              !date && "text-muted-foreground",
              variant === "outline" && "border-gray-200 hover:border-gray-300",
              className,
            )}
          >
            <span className="flex items-center gap-2">
              {showIcon && <CalendarIcon className="h-4 w-4" />}
              {date ? formatDate(date) : placeholder}
            </span>
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            captionLayout="dropdown"
            initialFocus
            locale={locale === "es" ? es : undefined}
            disabled={{ before: new Date() }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Keep the old component for backward compatibility
export function Calendar22() {
  return <DatePicker label="Date of birth" placeholder="Select date" />;
}
