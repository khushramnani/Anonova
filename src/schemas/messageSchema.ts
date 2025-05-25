import { z } from "zod/v4";

export const messageSchema = z.object({
    content: z.string()
            .min(6,{message:"contet must be minimum 6 character long"})
            .max(200,{message:"content cannot exceed more than 200 charactres"})
})