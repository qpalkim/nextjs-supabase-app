"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Event } from "@/lib/types/event";

/** 회차 정보 수정 폼 zod 스키마. Event 타입 필드명과 동일하게 맞춘다. */
const editEventFormSchema = z.object({
  scheduledAt: z.string().min(1, "일시를 입력해주세요."),
  location: z.string().min(1, "장소를 입력해주세요."),
  capacity: z.coerce
    .number({ invalid_type_error: "정원은 숫자로 입력해주세요." })
    .int("정원은 정수로 입력해주세요.")
    .positive("정원은 1명 이상이어야 합니다."),
});

type EditEventFormValues = z.infer<typeof editEventFormSchema>;

interface EventEditDialogProps {
  event: Event;
}

/**
 * 주최자 전용 회차 정보 수정 다이얼로그. Task 006과 동일한
 * react-hook-form + zodResolver 패턴을 재사용하며, 제출값은 콘솔 로그로만 확인한다
 * (실제 수정 Server Action은 Phase 3 Task 015에서 구현).
 */
export function EventEditDialog({ event }: EventEditDialogProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<EditEventFormValues>({
    resolver: zodResolver(editEventFormSchema),
    defaultValues: {
      scheduledAt: event.scheduledAt.slice(0, 16),
      location: event.location,
      capacity: event.capacity,
    },
  });

  function handleSubmit(values: EditEventFormValues) {
    console.log("회차 수정 폼 제출값:", values);
    setIsSubmitted(true);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">회차 정보 수정</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>회차 정보 수정</DialogTitle>
          <DialogDescription>
            일시·장소·정원을 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="scheduledAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>일시</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>장소</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>정원</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={form.formState.isSubmitting}>
              저장
            </Button>

            {isSubmitted ? (
              <p className="text-muted-foreground text-sm">
                수정 요청이 콘솔에 기록되었습니다. (실제 저장은 Phase 3에서
                연동됩니다)
              </p>
            ) : null}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
