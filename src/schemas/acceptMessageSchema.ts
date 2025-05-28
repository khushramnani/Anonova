import { z } from "zod/v4";

export const acceptMessageSchema = z.object({
    acceptMessageVadidation: z.boolean()
})