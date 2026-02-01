import { z } from 'zod';

export const auditActionSchema = z.object({
  reason: z.string().min(1).optional()
});

export type AuditActionInput = z.infer<typeof auditActionSchema>;

export const bulkActionSchema = z.object({
  ids: z.array(z.string().min(1)),
  action: z.enum(['approve','reject','offline']),
  reason: z.string().optional()
});

export type BulkActionInput = z.infer<typeof bulkActionSchema>;
