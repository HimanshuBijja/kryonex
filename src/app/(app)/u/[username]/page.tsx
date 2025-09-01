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
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const UserPage = ({ params }: { params: Promise<{ username: string }> }) => {
  const {
    object,
    submit,
    isLoading: isGenerating,
  } = useObject({
    api: "/api/sending-messages",
    schema: generateMessagesSchema,
  });
  const { username } = use(params);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content: data.content,
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send Message </FormLabel>
                  <FormControl>
                    <Textarea
                      className="h-28"
                      placeholder="Type your message here..."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="flex justify-self-end"
              type="submit"
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>

      <Card className="w-full my-8">
        <CardHeader>
          <CardTitle>Out of Ideas?</CardTitle>
          <CardDescription>
            Generate some message ideas with AI
          </CardDescription>
          <CardAction>
            <div className="">
              <Button
                className="flex justify-self-end "
                disabled={isGenerating}
                variant={"default"}
                onClick={() => submit("Messages during finals week.")}
              >
                Generate 
              </Button>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2 ">
            {object?.messages?.map((message, index) => (
              <div className="flex justify-self-center" key={index}>
                <Button
                  className="h-fit w-fit whitespace-normal"
                  variant={"outline"}
                  onClick={() =>
                    form.setValue("content", message?.context ?? "")
                  }
                >
                  {message?.context}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPage;
