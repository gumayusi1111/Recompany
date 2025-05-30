import { z } from 'zod'

export const NewsSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional()
})

export type News = z.infer<typeof NewsSchema>
