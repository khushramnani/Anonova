'use client'

import Messagecard from "@/components/custom/Messagecard"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Message } from "@/models/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw, User, LogOut } from "lucide-react"
import { User as NextAuthUser } from "next-auth"
import { useSession, signOut } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Dashboard = () => {
  const [getMessages, setGetMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const { data: session } = useSession()

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
  })

  const { register, watch, setValue } = form
  const acceptMessages = watch("acceptMessages")

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>(`/api/check-accept-messages`)
      setValue("acceptMessages", response.data.isAcceptingMessage ?? false)
      if (hasFetchedOnce) {
        toast.success(response.data.message)
      } else {
        setHasFetchedOnce(true)
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message)
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue, hasFetchedOnce])

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.post<ApiResponse>(`/api/check-accept-messages`, {
        acceptMessages: !acceptMessages,
      })
      setValue("acceptMessages", !acceptMessages)
      toast.success(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message, {
        duration: 5000,
        position: 'top-right',
        style: {
          backgroundColor: '#f87171',
          color: '#fff',
        },
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true)
      try {
        const response = await axios.get(`/api/get-messages`)
        if (!response.data.success) {
          toast.error(response.data.message)
        } else {
          setGetMessages(response.data.messages)
          if (refresh) {
            toast("Showing Latest Messages..")
          }
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast.error(axiosError.response?.data.message)
      } finally {
        setIsLoading(false)
      }
    },
    [setGetMessages, setIsLoading]
  )

  const deleteMessage = async (messageid: string) => {
    const response = await axios.delete(`/api/delete-message/${messageid}`)
    if (!response.data.success) {
      toast.error(response.data.message)
    }
    setGetMessages(getMessages.filter((message) => message.id !== messageid))
    toast.success(response.data.message)
  }

  useEffect(() => {
    if (!session || !session.user) return
    fetchMessages()
    fetchAcceptMessages()
  }, [session, fetchAcceptMessages, fetchMessages])

  if (!session || !session.user) {
    return <div className="min-h-screen bg-gray-50"></div>
  }

  const username = session?.user?.username || ''
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast("URL Copied!")
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimalist Navbar */}
      <nav className="bg-gradient-to-r from-white via-indigo-50 to-indigo-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl  text-indigo-500 logo-italic">Anonova</h1>
            </div>
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 hover:bg-gray-100"
                  >
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">{username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {/* <DropdownMenuLabel>{username}</DropdownMenuLabel> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-red-600 hover:text-red-700"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-3xl title-regular font-semibold text-gray-900 mb-6">Welcome back, <span className="text-indigo-500">{username}!</span></h2>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Link</h3>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none"
              />
              <Button
                onClick={copyToClipBoard}
                disabled={isCopied}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isCopied ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          </div>

          <div className="mb-6 flex items-center space-x-3">
            <Switch
              {...register('acceptMessages')}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className="data-[state=checked]:bg-blue-600"
            />
            <span className="text-gray-700">
              Accept Messages: {acceptMessages ? 'On' : 'Off'}
            </span>
          </div>

          <hr className="my-6 border-gray-200" />

          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault()
              fetchMessages(true)
            }}
            className="mb-6 border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            <span className="ml-2">Refresh Messages</span>
          </Button>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {getMessages.length > 0 ? (
              getMessages.map((message) => (
                <Messagecard
                  key={String(message._id)}
                  message={message}
                  onMessageDelete={deleteMessage}
                />
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center py-4">
                No messages to display.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard