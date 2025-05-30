import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import dayjs from 'dayjs';
import { AlertBox } from "./AlertBox"
import { Message } from "@/models/User"
import { toast } from "sonner"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"



type MessagecardProp ={
    message: Message,
    onMessageDelete : (messageid:string)=> void
}




const Messagecard = ({message , onMessageDelete} : MessagecardProp ) => {

const handleSubmit = async ()=>{
    try {
        const response = await axios.delete(`/api/delete-message/${message._id}`)
        if (response.status == 200) {
            toast.success(response.data.message,{
                duration: 3000, 
        position: 'top-right',
        style: {
          backgroundColor: '#34d399', // green-500
          color: '#fff',
        },
            })
        }
    } catch (error) {
        console.log(error)
        const axiosError = error as AxiosError<ApiResponse>

        const errorMessage = axiosError.response?.data?.message ?? "Error deleting Message"

        toast.error(errorMessage,{
            duration:300,
            position: 'top-right',
            style:{
            backgroundColor: '#34d399', // green-500
            color: '#fff',
        }

        })
    }
}


  return (
    <Card>
  <CardHeader>
    <div className="flex items-center justify-between">
    <CardTitle>{message.content}</CardTitle>
    <AlertBox onConfirm={handleSubmit}/>
    </div>
    <div className="text-sm">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
  </CardHeader>
</Card>
  )
}

export default Messagecard
