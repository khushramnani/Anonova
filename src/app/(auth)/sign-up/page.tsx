"use client"

import debounce from 'debounce';
import Link from 'next/link';
import * as z from 'zod';

import { Form, FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react';
import { ApiResponse } from '@/types/ApiResponse';
import axios from "axios"
import { AxiosError } from 'axios';
import { signUpSchema } from '@/schemas/signUpSchema';

import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { LoaderCircle , Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';



const SignUpForm = () => {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [usernameMessage, setusernameMessage] = useState("")
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)





    const debouncedCheckUsername = debounce(async (value: string) => {


        setIsCheckingUsername(true)
        setusernameMessage("")

        try {
            const response = await axios.get<ApiResponse>(`/api/check-username?username=${value}`)

            setusernameMessage(response.data.message)

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            setusernameMessage(
                axiosError.response?.data.message ?? "Error Checking Username"
            )

        } finally {
            setIsCheckingUsername(false)
            
        }


    }, 300);

    useEffect(() => {
       if (!username.trim()) return;
  debouncedCheckUsername(username);

  return () => {
    debouncedCheckUsername.clear(); // clears pending debounced call
  };

    }, [username])

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            
            const response = await axios.post(`/api/sign-up`, data)

            if (response.status == 200) {
                const message = response.data.message
                toast(message)
            }
            toast("Verification Code Send Successfully")
             router.replace(`/verify/${username}`);
            setIsSubmitting(false)

        }

        catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            console.log("error on submiting data of user", error);

            const errorMessage = axiosError.response?.data.message

            toast(errorMessage)

        }
    }





    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-200">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                            Join True Feedback
                        </h1>
                        <p className="mb-4">Sign up to start your anonymous adventure</p>
                    </div>
                    <FormProvider {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
                    <FormField
                        name="username"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                
                                    <Input placeholder="Enter your Username" {...field}
    name='username'
                                        onChange={(e) => {
                                            field.onChange(e)
                                            setUsername(e.target.value)
                                        }}

                                    />

                                    {isCheckingUsername && <LoaderCircle className='animate-spin' />}

                                
                                {username.length > 0 && !isCheckingUsername && usernameMessage &&(
                                    <p
                                        className={`text-sm ${usernameMessage === 'Username Is Unique'
                                                ? 'text-green-500'
                                                : 'text-red-500'
                                            }`}
                                    >
                                        {usernameMessage}
                                    </p>
                                )}
                                <FormMessage />
                            </FormItem>
                            
                        )} 
                    />

                    
                    <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                
                                    <Input placeholder="Enter your Email" {...field} name='email' />

                                    <p className=' text-gray-400 text-sm'>We will send you a verification code</p>
                                
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
                                
                                    <Input type='password' placeholder="Enter your Password" {...field} name='password'/>


                                <FormMessage />
                            </FormItem>
                            
                        )} 
                    />

     <Button type="submit" className='w-full mt-4' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
         

                    </form>
                    </FormProvider>
                    <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
                </div>
            </div>
        </>
    )
}

export default SignUpForm
