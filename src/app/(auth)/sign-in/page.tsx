"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { useDebounceCallback, useDebounceValue } from "usehooks-ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/schemas/signInSchema";
import z from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
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

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  //zod Implementation

  const form = useForm<z.infer<typeof signInSchema>>({
    //defines type for the form
    resolver: zodResolver(signInSchema), //we can use any resolver here we are using zod resolver
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      email: data.identifier,
      password: data.password,
    });
    if (result?.error) {
      toast.error("Login Failed", {
        description: "Invalid email or password.",
      });
      setIsSubmitting(false);
    }
    if (result?.url) {
      router.replace("/dashboard");
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 max-w-xl mx-auto px-4 container">
      <div className="w-full px-6 border-2 rounded-lg py-10 flex flex-col justify-center items-center">
        <Header />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username/ Email</FormLabel>
                  <FormControl>
                    <Input placeholder="username / email" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" type="password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" /> please wait
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
        <div className="py-2 text-sm">
          Dont have an account?{" "}
          <Link href="/sign-up">
            <span className="text-blue-500 hover:underline">Sign Up</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

const Header = () => {
  return (
    <header className="pb-6 ">
      <h1 className="text-3xl font-bold text-center">Login</h1>
    </header>
  );
};
