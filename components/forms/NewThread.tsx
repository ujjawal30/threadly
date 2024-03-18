"use client";

import { ThreadValidation } from "@/lib/validations/thread";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import { z } from "zod";
import { createThread } from "@/lib/actions/thread.action";
import { useOrganization } from "@clerk/nextjs";
import dynamic from "next/dynamic";

interface Props {
  userId: string;
}

const RichTextField = dynamic(() => import("./RichTextField"), { ssr: false });

function NewThread({ userId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });

  const handleSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    await createThread(
      {
        content: values.thread,
        author: values.accountId,
        communityId: organization?.id || null,
      },
      pathname
    );

    router.push("/");
  };

  // const handleChange = (
  //   event: any,
  //   editor: any,
  //   fieldChange: (data: string) => void
  // ) => {
  //   const newData = editor.getData();
  //   console.log("newData :>> ", newData);
  //   fieldChange(newData);
  // };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-10 flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus bg-dark-3 text-light-1 border border-dark-3">
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus bg-dark-3 text-light-1 border border-dark-3">
                <RichTextField
                  data={field.value}
                  fieldChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">
          Post Thread
        </Button>
      </form>
    </Form>
  );
}

export default NewThread;
