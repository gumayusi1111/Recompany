import { z } from 'zod'

export const MaterialsSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional()
})

export type Materials = z.infer<typeof MaterialsSchema>
