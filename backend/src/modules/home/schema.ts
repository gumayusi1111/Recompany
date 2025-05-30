import { z } from 'zod'

export const HomeSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional()
})

export type Home = z.infer<typeof HomeSchema>
