import { z } from "zod";



export const signInSchema = z.object({
    identifier: z.string() ,
    password: z.string().min(5, {message:"Password must me minimun 5 characters long"})
})