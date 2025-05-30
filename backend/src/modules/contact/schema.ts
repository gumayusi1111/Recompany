import { z } from 'zod'

export const ContactSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional()
})

export type Contact = z.infer<typeof ContactSchema>
