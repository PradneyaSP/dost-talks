import {z} from "zod"

export const friendEmailValidator = z.object({
    email: z.string().email(),    
})
