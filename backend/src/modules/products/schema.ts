import { z } from 'zod'

export const ProductsSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional()
})

export type Products = z.infer<typeof ProductsSchema>
