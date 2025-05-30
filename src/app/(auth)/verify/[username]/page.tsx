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
import { Input } from "@/components/ui/input";
import { set } from "mongoose";
import { Loader } from "lucide-react";


const VerifyCode = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  const params = useParams<{ username: string }>()


  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true)

    try {
      const response = await axios.post(`/api/check-verification-code`,
        {
          username: params.username,
          code: data.code
        }
      )

      toast(response.data.message)
       router.replace(`/sign-in`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      console.log("error on submiting data of user", error);

      const errorMessage = axiosError.response?.data.message

      toast(errorMessage)
      setIsSubmitting(false)
    }
  }




  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-200">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md ">
          {/* <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join True Feedback
            </h1>
            <p className="mb-4">Sign up to start your anonymous adventure</p>
          </div> */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your verification code" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the verification code sent to your email. Please check your spam or junk folder if you don't see it.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center items-center space-x-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Verifying..
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>


    </>
  )
}

export default VerifyCode
