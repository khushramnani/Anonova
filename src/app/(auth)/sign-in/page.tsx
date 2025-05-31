'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { signIn } from 'next-auth/react'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { signInSchema } from '@/schemas/signInSchema'
import { Loader2, ArrowLeft } from 'lucide-react'
import { useState } from 'react'

export default function SignInForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    })

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast.error('Login Failed: Incorrect username or password', {
          duration: 5000,
          position: 'top-right',
          style: {
            backgroundColor: '#F87171', // red-500
            color: '#fff',
          },
        })
      } else {
        toast.error(result.error, {
          duration: 5000,
          position: 'top-right',
          style: {
            backgroundColor: '#F87171', // red-500
            color: '#fff',
          },
        })
      }
    }

    if (result?.url) {
      toast.success('Login Successful', {
        duration: 3000,
        position: 'top-right',
        style: {
          backgroundColor: '#34D399', // green-500
          color: '#fff',
        },
      })
      router.replace('/dashboard')
    }
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-100 to-indigo-200 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-8 transition-all duration-300 hover:shadow-xl relative">
        {/* Back Button */}
        <Link href="/" className="absolute top-4 left-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            
          </Button>
        </Link>

        <div className="text-center mt-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600 mb-3">
            Rejoin Your Feedback Adventure
          </h1>
          <p className="text-gray-600 text-base sm:text-lg font-medium">
            Sign in to dive back into anonymous, heartfelt connections
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 font-semibold">Username or Email</FormLabel>
                  <Input
                    placeholder="Enter your username or email"
                    {...field}
                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg py-2.5 transition-all duration-200 bg-gray-50/50"
                  />
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
                    placeholder="Enter your password"
                    {...field}
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
                  Signing In...
                </>
              ) : (
                'Dive In'
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          <p className="text-gray-600 font-medium">
            New to the journey?{' '}
            <Link
              href="/sign-up"
              className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

