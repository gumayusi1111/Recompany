import { z } from 'zod'

export const ProjectsSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional()
})

export type Projects = z.infer<typeof ProjectsSchema>
