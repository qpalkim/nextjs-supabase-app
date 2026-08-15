"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

/** 모임 카테고리 더미 옵션. 실제 값은 Phase 3에서 서버 enum과 맞춘다. */
const CATEGORY_OPTIONS = ["수영", "러닝", "헬스", "기타"] as const;

/** 반복 주기 더미 옵션. */
const RECURRENCE_FREQUENCY_OPTIONS = [
  { value: "weekly", label: "매주" },
  { value: "biweekly", label: "격주" },
  { value: "monthly", label: "매월" },
] as const;

/** 반복 요일 더미 옵션. */
const RECURRENCE_WEEKDAY_OPTIONS = [
  { value: "0", label: "일요일" },
  { value: "1", label: "월요일" },
  { value: "2", label: "화요일" },
  { value: "3", label: "수요일" },
  { value: "4", label: "목요일" },
  { value: "5", label: "금요일" },
  { value: "6", label: "토요일" },
] as const;

/**
 * 모임 생성 폼 zod 스키마. 반복 규칙 필드는 Group 타입에 아직 없어
 * 이 페이지 전용 로컬 스키마로만 정의한다(Phase 3 Task 013에서 테이블 확정 후 lib/types/group.ts에 반영 예정).
 */
const createGroupFormSchema = z.object({
  name: z.string().min(1, "모임 이름을 입력해주세요."),
  category: z.string().min(1, "카테고리를 선택해주세요."),
  description: z.string().optional(),
  capacity: z.coerce
    .number({ invalid_type_error: "정원은 숫자로 입력해주세요." })
    .int("정원은 정수로 입력해주세요.")
    .positive("정원은 1명 이상이어야 합니다."),
  recurrenceFrequency: z.enum(["weekly", "biweekly", "monthly"], {
    errorMap: () => ({ message: "반복 주기를 선택해주세요." }),
  }),
  recurrenceWeekday: z.enum(["0", "1", "2", "3", "4", "5", "6"], {
    errorMap: () => ({ message: "반복 요일을 선택해주세요." }),
  }),
});

type CreateGroupFormValues = z.infer<typeof createGroupFormSchema>;

/**
 * 모임 생성 페이지. react-hook-form + zod로 클라이언트 검증만 수행하며,
 * 제출값은 콘솔 로그로만 확인한다(서버 연동은 Phase 3 Task 014).
 */
export default function NewGroupPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<CreateGroupFormValues>({
    resolver: zodResolver(createGroupFormSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      capacity: undefined,
      recurrenceFrequency: undefined,
      recurrenceWeekday: undefined,
    },
  });

  function handleSubmit(values: CreateGroupFormValues) {
    console.log("모임 생성 폼 제출값:", values);
    setIsSubmitted(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">모임 생성</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>모임 이름</FormLabel>
                <FormControl>
                  <Input placeholder="예: 월요일 아침 수영" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>카테고리</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="카테고리를 선택해주세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>소개</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="모임을 간단히 소개해주세요."
                    {...field}
                  />
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
                  <Input
                    type="number"
                    min={1}
                    placeholder="예: 12"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="recurrenceFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>반복 주기</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="주기를 선택해주세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {RECURRENCE_FREQUENCY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recurrenceWeekday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>반복 요일</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="요일을 선택해주세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {RECURRENCE_WEEKDAY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            모임 생성
          </Button>

          {isSubmitted ? (
            <p className="text-muted-foreground text-sm">
              모임 생성 요청이 콘솔에 기록되었습니다. (실제 저장은 Phase 3에서
              연동됩니다)
            </p>
          ) : null}
        </form>
      </Form>
    </div>
  );
}
