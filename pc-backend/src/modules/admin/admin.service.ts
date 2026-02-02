import { AdminProfile } from './admin.model';

export const adminService = {
  findByUserId: async (userId: string) => {
    return AdminProfile.findOne({ userId });
  },
  findById: async (id: string) => {
    return AdminProfile.findById(id);
  },
};
