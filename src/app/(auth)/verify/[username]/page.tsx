"use client";

import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export default function VerifyAccountPage() {
  const router = useRouter();
  const param = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: param.username,
        code: data.code,
      });

      toast.success(response.data.message);
      // router.push("/auth/sign-in"); //TODO uncomment after making sign-in page
    } catch (error) {
      console.error("Error in verify page :", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosError.response?.data.message ?? "Something went wrong";
      toast.error(errorMessage);
    }
  };
  return (
    <section className="py-24 max-w-sm container mx-auto px-2">
      <div className="px-4 flex flex-col justify-center items-center border-2 rounded-lg py-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 flex flex-col items-center"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-center">
                  <div className="flex flex-col">
                    <h1 className="text-2xl text-center font-bold">
                      Enter Otp
                    </h1>
                  </div>
                  <FormDescription className="pb-6 text-center">
                    Please enter the one-time password <br /> sent to your
                    Email.
                  </FormDescription>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      {/* <div className="flex flex-row items-center justify-center "> */}
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      {/* </div> */}
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="px-6 w-fit" type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
