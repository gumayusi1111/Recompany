import { z } from 'zod'

export const TestimonialsSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional()
})

export type Testimonials = z.infer<typeof TestimonialsSchema>
