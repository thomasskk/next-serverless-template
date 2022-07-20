import * as z from 'myzod'
import { isEmail } from './helper'

export const loginSchema = z.object({
  email: isEmail(),
  password: z
    .string()
    .min(8, 'Must be at least 8 characters')
    .max(128, 'Must be less than 128 characters'),
})

export const registerSchema = loginSchema.and(
  z.object({
    username: z.string(),
  })
)

export type ILogin = z.Infer<typeof loginSchema>
export type ISignUp = z.Infer<typeof registerSchema>
