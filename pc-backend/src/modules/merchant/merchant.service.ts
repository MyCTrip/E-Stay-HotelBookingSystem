import { Merchant } from './merchant.model';

export const merchantService = {
  findByUserId: async (userId: string) => {
    return Merchant.findOne({ userId });
  },
  upsertByUserId: async (userId: string, payload: any) => {
    const existing = await Merchant.findOne({ userId });
    if (existing) {
      // 更新 baseInfo
      if (payload.baseInfo) {
        existing.baseInfo = { ...existing.baseInfo, ...payload.baseInfo };
      }
      
      // 更新 qualificationInfo - 逐个字段更新，避免丢失其他字段
      if (payload.qualificationInfo) {
        // 逐个字段更新，避免丢失其他字段
        if (payload.qualificationInfo.businessLicenseNo !== undefined) {
          existing.qualificationInfo.businessLicenseNo = payload.qualificationInfo.businessLicenseNo;
        }
        if (payload.qualificationInfo.businessLicensePhoto !== undefined) {
          existing.qualificationInfo.businessLicensePhoto = payload.qualificationInfo.businessLicensePhoto;
        }
        if (payload.qualificationInfo.idCardNo !== undefined) {
          existing.qualificationInfo.idCardNo = payload.qualificationInfo.idCardNo;
        }
        if (payload.qualificationInfo.realNameStatus !== undefined) {
          existing.qualificationInfo.realNameStatus = payload.qualificationInfo.realNameStatus;
        }
      }
      
      await existing.save();
      return existing;
    }
    
    const created = await Merchant.create({
      userId,
      baseInfo: payload.baseInfo,
      qualificationInfo: payload.qualificationInfo || {},
    });
    return created;
  },
  submitByUserId: async (userId: string) => {
    const profile = await Merchant.findOneAndUpdate(
      { userId },
      { $set: { 'auditInfo.verifyStatus': 'pending' } },
      { new: true }
    );
    if (!profile) throw new Error('Merchant profile not found');
    return profile;
  },
  findById: async (id: string) => {
    return Merchant.findById(id);
  },
  setVerifyStatus: async (
    id: string,
    status: 'verified' | 'rejected',
    reason?: string,
    adminId?: string
  ) => {
    const update: any = { 'auditInfo.verifyStatus': status };
    if (reason) update['auditInfo.rejectReason'] = reason;
    const profile = await Merchant.findByIdAndUpdate(id, { $set: update }, { new: true });
    if (!profile) throw new Error('Not found');
    return profile;
  },
};
