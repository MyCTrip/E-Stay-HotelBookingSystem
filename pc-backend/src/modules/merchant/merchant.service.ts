import { Merchant } from './merchant.model';

export const merchantService = {
  findByUserId: async (userId: string) => {
    return Merchant.findOne({ userId });
  },
  
  upsertByUserId: async (userId: string, payload: any) => {
    // 1. 构建 MongoDB 底层的更新指令对象
    const updateData: any = {
      // 核心业务逻辑：只要有更新，强制把状态打回草稿
      'auditInfo.verifyStatus': 'unverified' 
    };

    // 2. 将前端传来的嵌套对象，拆解成 MongoDB 认识的点语法 (dot notation)
    // 这样可以直接精准修改某个字段，绝对不会被 Mongoose 丢弃
    if (payload.baseInfo) {
      Object.keys(payload.baseInfo).forEach(key => {
        updateData[`baseInfo.${key}`] = payload.baseInfo[key];
      });
    }
    
    if (payload.qualificationInfo) {
      Object.keys(payload.qualificationInfo).forEach(key => {
        updateData[`qualificationInfo.${key}`] = payload.qualificationInfo[key];
      });
    }

    // { new: true } 保证返回修改后的最新数据
    // { upsert: true } 保证如果这个用户是第一次填资料，就自动帮他新建一条
    const updatedProfile = await Merchant.findOneAndUpdate(
      { userId },
      { 
        $set: updateData,
        $unset: { 'auditInfo.rejectReason': 1 } // 顺手抹除以前可能留下的驳回原因
      },
      { new: true, upsert: true }
    );

    return updatedProfile;
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