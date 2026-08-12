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

/** 게스트 등록 폼 zod 스키마. */
const addGuestFormSchema = z.object({
  guestName: z.string().min(1, "게스트 이름을 입력해주세요."),
  guestCount: z.coerce
    .number({ invalid_type_error: "인원은 숫자로 입력해주세요." })
    .int("인원은 정수로 입력해주세요.")
    .positive("인원은 1명 이상이어야 합니다."),
});

type AddGuestFormValues = z.infer<typeof addGuestFormSchema>;

interface GuestAddDialogProps {
  onAddGuest: (values: AddGuestFormValues) => void;
}

/**
 * 게스트 추가 다이얼로그. 제출 시 부모(참여자 명단)의 로컬 상태에 게스트를 추가한다.
 * 실제 저장은 Phase 3 Task 019에서 구현된다.
 */
export function GuestAddDialog({ onAddGuest }: GuestAddDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<AddGuestFormValues>({
    resolver: zodResolver(addGuestFormSchema),
    defaultValues: { guestName: "", guestCount: 1 },
  });

  function handleSubmit(values: AddGuestFormValues) {
    onAddGuest(values);
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">게스트 추가</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게스트 추가</DialogTitle>
          <DialogDescription>
            비회원 동반 게스트의 이름과 인원을 등록합니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="guestName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>게스트 이름</FormLabel>
                  <FormControl>
                    <Input placeholder="예: 김철수 동반" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guestCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>인원</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={form.formState.isSubmitting}>
              추가
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
