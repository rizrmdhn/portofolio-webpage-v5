"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { globalErrorToast, globalSuccessToast } from "@/lib/toast";
import { calculateFutureDate, cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import type z from "zod";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import certificationSchema from "@/schema/certifcation.schema";

interface UpdateCertificationFormProps {
  id: string;
}

export default function UpdateCertificationForm({
  id,
}: UpdateCertificationFormProps) {
  const utils = api.useUtils();
  const router = useRouter();

  const [certification] = api.certification.getById.useSuspenseQuery({ id });

  const { mutate, status } = api.certification.update.useMutation({
    onSuccess: () => {
      globalSuccessToast("Certification updated successfully");
      utils.certification.getAll.invalidate();
      router.back();
    },
    onError: (error) => {
      globalErrorToast(error.message || "Failed to update certification");
    },
  });

  const form = useForm<
    z.infer<typeof certificationSchema.updateCertificationSchema>
  >({
    resolver: zodResolver(certificationSchema.updateCertificationSchema),
    defaultValues: {
      id: id,
      name: certification.name,
      issuer: certification.issuer,
      certificate_id: certification.certificate_id ?? undefined,
      certificate_url: certification.certificate_url ?? undefined,
      issueDate: new Date(certification.issueDate) ?? undefined,
      expiryDate: certification.expiryDate
        ? new Date(certification.expiryDate)
        : undefined,
    },
  });

  function onSubmit(
    data: z.infer<typeof certificationSchema.updateCertificationSchema>
  ) {
    mutate(data);
  }

  return (
    <ScrollArea className="flex w-full flex-col items-center justify-center overflow-y-auto">
      <div className="flex flex-col items-center justify-center p-0 pt-4 pb-4 lg:p-4">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Certification Name</FieldLabel>
                  <Input
                    placeholder={"Type the certification name"}
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="issuer"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Issuer</FieldLabel>
                  <Input
                    placeholder={"Type the issuer name"}
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="certificate_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Certificate ID</FieldLabel>
                  <Input
                    placeholder={"Type the certificate ID"}
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="certificate_url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Certificate URL</FieldLabel>
                  <Input
                    placeholder={"Type the certificate URL"}
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="issueDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="flex flex-col"
                >
                  <FieldLabel>Issue Date</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="expiryDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="flex flex-col"
                >
                  <FieldLabel>Expiry Date</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        captionLayout="dropdown"
                        endMonth={calculateFutureDate(20)}
                      />
                    </PopoverContent>
                  </Popover>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button type="submit" disabled={status === "pending"}>
              {status === "pending" ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {status === "pending" ? "Updating..." : "Update Certification"}
            </Button>
          </FieldGroup>
        </form>
      </div>
    </ScrollArea>
  );
}
