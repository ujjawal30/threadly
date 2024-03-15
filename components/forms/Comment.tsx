"use client";

import { CommentValidation } from "@/lib/validations/thread";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Image from "next/image";
import { postComment } from "@/lib/actions/thread.action";

interface Props {
  threadId: string;
  userId: string;
  userImg: string;
}

function Comment({ threadId, userId, userImg }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await postComment(threadId, values.thread, userId, pathname);

    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="comment-form">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 w-full">
              <FormLabel className="relative h-10 w-10">
                <Image
                  src={userImg}
                  alt="Profile Photo"
                  fill
                  className="cursor-pointer object-cover rounded-full"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Comment..."
                  className="no-focus text-light-1 outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
}

export default Comment;
