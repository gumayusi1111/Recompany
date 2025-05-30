import { z } from 'zod'

export const AboutSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional()
})

export type About = z.infer<typeof AboutSchema>
