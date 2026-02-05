import React, { useEffect, useState } from 'react';
import ProfileInfo from '@/components/user/ProfileInfo';
import EditProfileModal from '@/components/user/EditProfileModal';
import type { MerchantProfile } from '@/types/user';
import ChangeAvatarModal from '@/components/shared/ChangeAvatarModal';
// import { merchantApi } from '@/services/merchant'; // 假设你有这个 API

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MerchantProfile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // 模拟获取数据 (将来换成真实的 API 调用)
  const fetchProfile = async () => {
    setLoading(true);
    try {
      // const res = await merchantApi.getProfile();
      // setData(res.data);
      
      // --- 模拟数据 Start ---
      setTimeout(() => {
      setData({
          _id: '123',
          userId: 'merchant_123', 
          createdAt: '2026-02-02T10:00:00.000Z', 
          email: 'admin@e-stay.com',
          avatar: '',
          baseInfo: {
          merchantName: '易宿精选酒店集团',
          contactName: '王经理',
          contactPhone: '13800138000',
          contactEmail: 'manager@e-stay.com'
          },
          auditInfo: { verifyStatus: 'verified' },
          qualificationInfo: { 
          businessLicenseNo: '91310000XXXXXXXX',
          realNameStatus: 'verified' 
          }
      });
        setLoading(false);
      }, 500);
      // --- 模拟数据 End ---

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      {/* 1. 展示组件 */}
      <ProfileInfo 
        loading={loading} 
        data={data} 
        onEdit={() => setIsEditModalOpen(true)} 
        onEditAvatar={() => setIsAvatarModalOpen(true)}
      />

      {/* 2. 交互组件：编辑资料 */}
      <EditProfileModal
        visible={isEditModalOpen}
        data={data}
        onCancel={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          fetchProfile(); // 修改成功后刷新数据
        }}
      />
      {/* 3. 修改头像弹窗 */}
      <ChangeAvatarModal 
        visible={isAvatarModalOpen}
        onCancel={() => setIsAvatarModalOpen(false)}
        onSuccess={(newUrl) => {
            // 这里可以直接更新本地 data，或者重新 fetchProfile
            if (data) {
                setData({ ...data, avatar: newUrl });
            }
        }}
      />
    </>
  );
};

export default Profile;