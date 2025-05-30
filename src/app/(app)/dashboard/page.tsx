'use client'

import Messagecard from "@/components/custom/Messagecard"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Message } from "@/models/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { set } from "mongoose"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"




const Dashboard = () => {

  const [getMessages, setGetMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
const [isCopied, setIsCopied] = useState(false);
  const {data: session } = useSession()
  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema)
  })

  const { register, watch, setValue } = form
  const acceptMessages = watch("acceptMessages")

const fetchAcceptMessages = useCallback(async () => {
  setIsSwitchLoading(true);
  try {
    const response = await axios.get<ApiResponse>(`/api/check-accept-messages`);
    setValue("acceptMessages", response.data.isAcceptingMessage ?? false);

    if (hasFetchedOnce) {
      toast.success(response.data.message);
    } else {
      setHasFetchedOnce(true); // prevent first load toast
    }

  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    toast.error(axiosError.response?.data.message);
  } finally {
    setIsSwitchLoading(false);
  }
}, [setValue, hasFetchedOnce]);

  const handleSwitchChange = async ()=>{
    setIsSwitchLoading(true)
    try {
      const response = await axios.post<ApiResponse>(`/api/check-accept-messages`,{
        acceptMessages: !acceptMessages
      })
      setValue("acceptMessages", !acceptMessages);
      toast.success(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message, {
        duration: 5000,
        position: 'top-right',
        style: {
          backgroundColor: '#f87171', // red-500
          color: '#fff',
        }

      })
    } finally{
      setIsSwitchLoading(false)
    }
  }

const fetchMessages = useCallback(async (refresh: boolean = false) => {
  setIsLoading(true);
  try {
    const response = await axios.get(`/api/get-messages`);
    if (!response.data.success) {
      toast.error(response.data.message);
    } else {
      setGetMessages(response.data.messages);
      if (refresh) {
        toast("Showing Latest Messages..");
      }
    }
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    toast.error(axiosError.response?.data.message);
  } finally {
    setIsLoading(false); // ✅ fix here
  }
}, [setGetMessages, setIsLoading]);



  const deleteMessage = async (messageid:string) => {
    const response = await axios.delete(`/api/delete-message/${messageid}`)
    if (!response.data.success) {
      toast.error(response.data.message)
    }
    setGetMessages(getMessages.filter((message)=> message.id !== messageid))
    toast.success(response.data.message)
  } 

  useEffect(()=>{
    if (!session || !session.user) return
    fetchMessages()
    fetchAcceptMessages()
  },[session , fetchAcceptMessages , fetchMessages ])

  if (!session || !session.user) {
    return <div></div>;
  }

  // const {username} = session?.user  as User
  const username = session?.user?.username || '';

  const baseUrl = `${window.location.protocol}//${window.location.host}`

  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipBoard = ()=>{
    navigator.clipboard.writeText(profileUrl)
    toast("Url Copied!")
    setIsCopied(true);
    setTimeout(()=> setIsCopied(false), 2000)
  }


  return (
    <>
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
            <Button onClick={copyToClipBoard} disabled={isCopied}>
        {isCopied ? "Copied!" : "Copy Link"}
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <hr />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {getMessages.length > 0 ? (
          getMessages.map((message, index) => (
            <Messagecard
              key={String(message._id)}
              message={message}
              onMessageDelete={deleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
    </>
  )

}

export default Dashboard
