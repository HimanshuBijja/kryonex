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
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { set } from "mongoose";

export default function VerifyAccountPage() {
  const router = useRouter();
  const param = useParams<{ username: string }>();

  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [lastFailedOtp, setLastFailedOtp] = useState<string>("");
  const [hasFailedSubmission, setHasFailedSubmission] = useState(false);

  const [otp, setOtp] = useState<string>("");


  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const currentOtp = form.watch("code");

  const hasOtpChangedAfterFailure = hasFailedSubmission && currentOtp !== lastFailedOtp;

//   useEffect(() => {
//     if (hasOtpChangedAfterFailure) {
//         setHasFailedSubmission(false);
//         setLastFailedOtp("");
//     }
//   }, [hasOtpChangedAfterFailure]);

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      setIsSubmittingForm(true);
    //   setLastFailedOtp("");
      const response = await axios.post(`/api/verify-code`, {
        username: param.username,
        code: data.code,
      });
      setHasFailedSubmission(false);
      setLastFailedOtp("");

      toast.success(response.data.message);
      router.push("/sign-in"); 
    } catch (error) {
      // console.error("Error in verify page :", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosError.response?.data.message ?? "Something went wrong";
      toast.error(errorMessage);
      setLastFailedOtp(data.code);
        setHasFailedSubmission(true);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const isSubmittingDisabled = isSubmittingForm || (hasFailedSubmission && !hasOtpChangedAfterFailure);
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
                <FormItem className="flex flex-col justify-center items-center">
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
                    <InputOTP
                      maxLength={6}
                      {...field}
                      pattern={REGEXP_ONLY_DIGITS}
                    >
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
                  {
                    hasFailedSubmission && <p className="text-red-500 text-sm">Incorrect Otp, Please try again.</p>
                  }
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />
            <Button
              className="px-6 w-fit"
              disabled={isSubmittingDisabled}
              type="submit"
            >
              {isSubmittingForm ? (
                <>
                  <Loader2 className="animate-spin" /> Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
