"use client";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const VerifyAccountPage = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  // ======================================================
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const res = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });
      toast({
        title: "Success",
        description: res.data.message,
      });
      router.replace("/sign-in");
    } catch (error) {
      console.error("error verifying of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "verification failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // ====================================================
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-teal-300 to-sky-900">
      <div className="w-full max-w-md p-4 sm:p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Enter Verification Code</FormLabel> */}
                  <Input {...field} placeholder="Enter verification code" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant={"custom1"} className="w-full">
              Verify
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyAccountPage;
