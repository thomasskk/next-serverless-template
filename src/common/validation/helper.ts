import * as z from 'myzod'

export const isEmail = () =>
  z
    .string()
    .max(320, 'Must be less than 320 characters')
    .pattern(/^[^@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/, 'Invalid email format')
