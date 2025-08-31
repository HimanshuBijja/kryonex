"use client";

import { Button } from "@/components/ui/button";
import { generateMessagesSchema } from "@/schemas/generateMessagesSchema";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import axios, { AxiosError } from "axios";
import { use, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema } from "@/schemas/messageSchema";
import z from "zod";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";

const UserPage = ({
  params,
}: {
  params: Promise<{ username: string }>
}) => {
  const {
    object,
    submit,
    isLoading: isGenerating,
  } = useObject({
    api: "/api/sending-messages",
    schema: generateMessagesSchema,
  });
  const { username } = use(params);
  // check if username is valid
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data : z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content: data.content
      });
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Content</FormLabel>
                  <FormControl>
                    <Input placeholder="Type your message here..." {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>Submit</Button>
          </form>
        </Form>
      </div>

      <div>
        <Button
          disabled={isGenerating}
          variant={"default"}
          onClick={() => submit("Messages during finals week.")}
        >
          Generate notifications
        </Button>

        {object?.messages?.map((message, index) => (
          <div key={index}>
            <Button variant={"outline"} onClick={() => form.setValue("content", message?.context ?? "")}>
              <p>{message?.context}</p>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPage;
