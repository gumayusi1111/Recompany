import { z } from 'zod';

/**
 * u8054u7cfbu6211u4eecu57fau672cu6a21u5f0f
 */
export const ContactSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional()
});

/**
 * u521bu5efau8054u7cfbu6211u4eecu8bf7u6c42u6a21u5f0f
 */
export const CreateContactSchema = ContactSchema.omit({ id: true });

/**
 * u66f4u65b0u8054u7cfbu6211u4eecu8bf7u6c42u6a21u5f0f
 */
export const UpdateContactSchema = CreateContactSchema.partial();

/**
 * u8054u7cfbu6211u4eecu7c7bu578bu5b9au4e49
 */
export type Contact = z.infer<typeof ContactSchema>;

/**
 * u521bu5efau8054u7cfbu6211u4eecu8bf7u6c42u7c7bu578b
 */
export type CreateContactInput = z.infer<typeof CreateContactSchema>;

/**
 * u66f4u65b0u8054u7cfbu6211u4eecu8bf7u6c42u7c7bu578b
 */
export type UpdateContactInput = z.infer<typeof UpdateContactSchema>;
