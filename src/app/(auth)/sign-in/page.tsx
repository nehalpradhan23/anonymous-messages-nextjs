"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // ==============================================================
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const res = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    console.log(res, "sign in result ===============================");
    if (res?.error) {
      if (res.error == "CredentialsSignin") {
        toast({
          title: "Login failed",
          description: "Incorrect username or password",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: res.error,
          variant: "destructive",
        });
      }
    }
    if (res?.url) {
      router.replace("/dashboard");
    }
    setIsSubmitting(false);
  };
  // ==========================================================
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-teal-300 to-sky-900">
      <div className="w-full max-w-md p-5 space-y-3 bg-white rounded-md shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Anonimo app
          </h1>
          <p className="mb-4">Sign in to your account</p>
        </div>
        {/* form =============================== */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/username</FormLabel>
                  <FormControl>
                    <Input placeholder="email or username" {...field} />
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
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              variant={"custom1"}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" /> Signing in
                </>
              ) : (
                "Signin"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p className="">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
