"use client"

import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from 'sonner';
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader } from "lucide-react";

const VerifyCode = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/check-verification-code`, {
        username: params.username,
        code: data.code
      });
      toast(response.data.message);
      router.replace(`/sign-in`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log("error on submitting data of user", error);
      const errorMessage = axiosError.response?.data.message;
      toast(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4">
      <div className="w-full max-w-md flex items-center flex-col p-6 sm:p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <div className="text-center justify-center flex flex-col items-center space-y-2">
          <h1 className="text-3xl text-center w-full sm:text-4xl font-bold tracking-tight text-gray-900">
            Verify Your Account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter the code sent to your email to join True Feedback
          </p>
        </div>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col items-center justify-center">
            <FormField
              
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel className="text-sm text-center font-medium text-gray-700">
                    Verification Code
                  </FormLabel> */}
                  <FormControl className="w-full flex items-center justify-center"> 
                    <InputOTP className="w-full flex items-center justify-center" maxLength={6} {...field}>
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
                    </InputOTP>
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500 mt-2">
                    Check your email (including spam/junk) for the 6-digit code.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyCode;