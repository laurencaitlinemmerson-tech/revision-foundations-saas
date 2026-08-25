import { z } from 'zod';

// ── Checkout ──
export const checkoutSchema = z.object({
  product: z.enum(['osce', 'quiz', 'bundle', 'template']),
  guestEmail: z.string().email('Invalid email address').optional(),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;

// ── Contact ──
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(80, 'Name must be 80 characters or less'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().max(200).optional(),
  message: z.string().min(1, 'Message is required').max(2000, 'Message must be 2000 characters or less'),
});
export type ContactInput = z.infer<typeof contactSchema>;

// ── Questions ──
export const createQuestionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  body: z.string().min(1, 'Body is required').max(2000, 'Body must be 2000 characters or less'),
  tags: z.array(z.string().max(50)).max(5).optional().default([]),
  image_url: z.string().url().optional().nullable(),
});
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;

// ── Comments ──
export const createCommentSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  body: z.string().min(1, 'Body is required').max(1000, 'Comment must be 1000 characters or less'),
  parentId: z.string().uuid().optional().nullable(),
});
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
