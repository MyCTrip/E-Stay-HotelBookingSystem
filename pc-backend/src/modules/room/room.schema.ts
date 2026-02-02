import { z } from 'zod';

const bedSchema = z.object({
  bedType: z.string().min(1),
  bedNumber: z.number().int().min(1),
  bedSize: z.string().min(1),
});

export const createRoomSchema = z.object({
  hotelId: z.string().min(1).optional(),
  baseInfo: z.object({
    type: z.string().min(1),
    price: z.number().min(0),
    images: z.array(z.string()).optional(),
    status: z.enum(['draft', 'pending', 'approved', 'rejected', 'offline']).optional(),
    maxOccupancy: z.number().int().min(1),
  }),
  headInfo: z.object({
    size: z.string().min(1),
    floor: z.string().min(1),
    wifi: z.boolean(),
    windowAvailable: z.boolean(),
    smokingAllowed: z.boolean(),
  }),
  bedInfo: z.array(bedSchema),
  breakfastInfo: z.any().optional(),
});

export const updateRoomSchema = createRoomSchema.partial();
