import { Merchant } from './merchant.model';

export const merchantService = {
  findByUserId: async (userId: string) => {
    return Merchant.findOne({ userId });
  },
  upsertByUserId: async (userId: string, payload: any) => {
    const existing = await Merchant.findOne({ userId });
    if (existing) {
      existing.baseInfo = { ...existing.baseInfo, ...payload.baseInfo };
      if (payload.qualificationInfo) existing.qualificationInfo = { ...existing.qualificationInfo, ...payload.qualificationInfo };
      await existing.save();
      return existing;
    }
    const created = await Merchant.create({ userId, baseInfo: payload.baseInfo, qualificationInfo: payload.qualificationInfo || {} });
    return created;
  },
  submitByUserId: async (userId: string) => {
    const profile = await Merchant.findOneAndUpdate({ userId }, { $set: { 'auditInfo.verifyStatus': 'pending' } }, { new: true });
    if (!profile) throw new Error('Merchant profile not found');
    return profile;
  },
  findById: async (id: string) => {
    return Merchant.findById(id);
  },
  setVerifyStatus: async (id: string, status: 'verified' | 'rejected', reason?: string, adminId?: string) => {
    const update: any = { 'auditInfo.verifyStatus': status };
    if (reason) update['auditInfo.rejectReason'] = reason;
    const profile = await Merchant.findByIdAndUpdate(id, { $set: update }, { new: true });
    if (!profile) throw new Error('Not found');
    return profile;
  }
};
