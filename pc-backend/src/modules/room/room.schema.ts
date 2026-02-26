import { z } from 'zod';

const bedSchema = z.object({
  bedType: z.string().min(1),
  bedNumber: z.number().int().min(1),
  bedSize: z.string().min(1),
});

const facilityItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  available: z.boolean(),
});

const facilitySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  facilities: z.array(facilityItemSchema).nonempty(),
});

const policySchema = z.object({
  policyType: z.string().min(1),
  content: z.string().min(1),
  summary: z.string().optional(),
  flags: z.record(z.any()).optional(),
});

export const createRoomSchema = z.object({
  hotelId: z.string().min(1).optional(),
  baseInfo: z.object({
    type: z.string().min(1),
    price: z.number().min(0),
    images: z.array(z.string()).optional(),
    status: z.enum(['draft', 'pending', 'approved', 'rejected', 'offline']).optional(),
    maxOccupancy: z.number().int().min(1),
    facilities: z.array(facilitySchema).nonempty(),
    policies: z.array(policySchema).nonempty(),
    bedRemark: z.array(z.string().min(1)).nonempty(),
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
