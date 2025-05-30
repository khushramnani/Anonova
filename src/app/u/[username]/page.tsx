'use client'

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const specialChar = '||'

const parseStringMessage = (messageString:string):string[] => {
    return messageString.split(specialChar)
}

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

const Page = () => {
const params = useParams<{username:string}>()
const username = params.username

const [isLoading , setIsLoading] = useState(false)

const form = useForm<z.infer<typeof messageSchema>>({
    resolver:zodResolver(messageSchema)
})


// const messageContent = form.watch('content')

const onSubmit = async (data:z.infer<typeof messageSchema>)=>{
    setIsLoading(true)
    try {
        const response = await axios.post<ApiResponse>(`/api/send-message/`,{
            ...data,
            username            
        })
        if (response.data.success) {
            toast.success(response.data.message)
        }
form.reset({ ...form.getValues(), content: '' });
        
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message);
    } finally{
        setIsLoading(false)
    }
}


  return (
<>
<div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading }>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>
      </div>
</>
  )
}

export default Page
