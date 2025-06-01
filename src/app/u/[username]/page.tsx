'use client'

import SuggestMsgSkeleton from "@/components/custom/SuggestMsgSkeleton"
import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { messageSchema } from "@/schemas/messageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, Sparkle, Sparkles } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import Link from "next/link"

const specialChar = '||'

const parseStringMessage = (messageString: string): string[] => {
  return messageString.split(specialChar)
}

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?"

const Page = () => {
  const params = useParams<{ username: string }>()
  const username = params.username
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([])
  const [isSuggestLoading, setIsSuggestLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  })

  const { setValue } = form

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true)
    try {
      const response = await axios.post<ApiResponse>('/api/send-message/', {
        ...data,
        username,
      })
      if (response.data.success) {
        toast.success(response.data.message, { style: { background: '#34D399', color: '#fff' } })
      }
      form.reset({ ...form.getValues(), content: '' })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message ?? "Something went wrong", {
        style: { background: '#F87171', color: '#fff' },
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSuggestedQuestions = async () => {
    setIsSuggestLoading(true)
    try {
      const response = await axios.post<ApiResponse>('/api/generate-messages')
      if (response.data.success && response.data.text) {
        const cleanText = response.data.text.replace(/^"(.*)"$/, '$1');
        const questions = cleanText.split('||').map((q: string) => q.trim())
        setSuggestedQuestions(questions)
        toast.success("Suggested questions loaded!", { style: { background: '#34D399', color: '#fff' } })
      } else {
        toast.error(response.data.message || "Failed to fetch suggestions", {
          style: { background: '#F87171', color: '#fff' },
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Error fetching suggestions", {
        style: { background: '#F87171', color: '#fff' },
      })
    } finally {
      setIsSuggestLoading(false)
    }
  }

  const handleQuestionClick = (question: string) => {
    setValue('content', question, { shouldValidate: true })
    toast.info("Question added to textarea!", { style: { background: '#60A5FA', color: '#fff' } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200 flex flex-col">
      {/* Main Content */}
      <div className="container mx-auto my-8 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-8 transition-all duration-300 hover:shadow-xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600 mb-4">
            Send a Secret Message to @{username}
          </h1>
          <p className="text-center text-gray-600  text-sm sm:text-lg font-medium">
            Whether it’s feedback, a compliment, or a curious question—go ahead, it’s 100% anonymous.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-semibold">
                      Your Anonymous Message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your anonymous message here..."
                        className="resize-none lg:text-2xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg py-2.5 transition-all duration-200 bg-gray-50/50 min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send It'
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 font-medium rounded-lg py-2.5 px-6 transition-all duration-200"
            onClick={fetchSuggestedQuestions}
            disabled={isSuggestLoading}
          >
            {isSuggestLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                Ask AI <Sparkles className="inline-block h-4 w-4 animate-pulse" />
              </>
            )}
          </Button>

          <div className="mt-2">
            {isSuggestLoading ? (
              <SuggestMsgSkeleton />
            ) : suggestedQuestions.length > 0 ? (
              <div className="space-y-3">
                {suggestedQuestions.map((question, index) => (
                  <Card
                    key={index}
                    className="p-4 cursor-pointer bg-white border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => handleQuestionClick(question)}
                  >
                    <CardTitle className="text-sm font-medium text-gray-800">
                      {question.replace(/[.?!]$/, "")}
                    </CardTitle>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center text-sm">
                No suggestions yet. Click "Ask AI" to get inspired.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/95 backdrop-blur-md border-t border-gray-200 py-4 pb-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center space-y-2">
          <p className="text-gray-600 text-sm sm:text-base font-medium">
            Want to create your own anonymous feedback space?{' '}
            <Link
              href="/sign-in"
              className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200"
            >
              Sign in to Anonova
            </Link>{' '}
            or{' '}
            <Link
              href="/sign-up"
              className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200"
            >
              try it now
            </Link>
            !
          </p>
          <p className="text-gray-600 text-sm font-medium">
                      Cooked up with code & creativity by <Link href="https://twitter.com/khushramnani" className="text-indigo-500 font-semibold" target="_blank" rel="noopener noreferrer">@khushramnani</Link>
                    </p>
        </div>
      </footer>
    </div>
  )
}

export default Page