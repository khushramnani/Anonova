"use client"

import debounce from 'debounce'
import Link from 'next/link'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { ApiResponse } from '@/types/ApiResponse'
import axios, { AxiosError } from 'axios'
import { signUpSchema } from '@/schemas/signUpSchema'
import { toast } from 'sonner'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoaderCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const SignUpForm = () => {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debouncedCheckUsername = debounce(async (value: string) => {
    setIsCheckingUsername(true)
    setUsernameMessage("")
    try {
      const response = await axios.get<ApiResponse>(`/api/check-username?username=${value}`)
      setUsernameMessage(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      setUsernameMessage(axiosError.response?.data.message ?? "Error Checking Username")
    } finally {
      setIsCheckingUsername(false)
    }
  }, 300)

  useEffect(() => {
    if (!username.trim()) return
    debouncedCheckUsername(username)
    return () => {
      debouncedCheckUsername.clear()
    }
  }, [username])

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post(`/api/sign-up`, data)
      if (response.status === 200) {
        toast.success(response.data.message, { style: { background: '#34D399', color: '#fff' } })
        toast.success("Verification Code Sent Successfully", { style: { background: '#34D399', color: '#fff' } })
        router.replace(`/verify/${username}`)
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      console.error("Error submitting user data", error)
      toast.error(axiosError.response?.data.message ?? "Something went wrong", {
        style: { background: '#F87171', color: '#fff' },
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-100 to-indigo-200
 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-8 transition-all duration-300 hover:shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600 mb-3">
            Unleash Your True Feedback
          </h1>
          <p className="text-gray-600 text-base sm:text-lg font-medium">
            Join the adventure of anonymous, heartfelt connections
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 font-semibold">Username</FormLabel>
                  <div className="relative">
                    <Input
                      placeholder="Pick a unique username"
                      {...field}
                      name="username"
                      onChange={(e) => {
                        field.onChange(e)
                        setUsername(e.target.value)
                      }}
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg py-2.5 transition-all duration-200 bg-gray-50/50"
                    />
                    {isCheckingUsername && (
                      <LoaderCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500 animate-spin" />
                    )}
                  </div>
                  {username.length > 0 && !isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm mt-2 font-medium ${
                        usernameMessage === 'Username Is Unique'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 font-semibold">Email</FormLabel>
                  <Input
                    placeholder="Enter your email address"
                    {...field}
                    name="email"
                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg py-2.5 transition-all duration-200 bg-gray-50/50"
                  />
                  <p className="text-gray-500 text-xs mt-1.5 font-medium">
                    Expect a verification code in your inbox
                  </p>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 font-semibold">Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Create a secure password"
                    {...field}
                    name="password"
                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg py-2.5 transition-all duration-200 bg-gray-50/50"
                  />
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Your Account...
                </>
              ) : (
                'Launch Your Journey'
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          <p className="text-gray-600 font-medium">
            Already exploring with us?{' '}
            <Link
              href="/sign-in"
              className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUpForm