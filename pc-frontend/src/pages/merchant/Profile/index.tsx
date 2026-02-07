import React, { useEffect, useState } from 'react';
import { Button, Result, message, Modal, Spin, Alert } from 'antd';
import { AuditOutlined, FormOutlined } from '@ant-design/icons';
import ProfileInfo from '@/components/user/ProfileInfo';
import EditProfileModal from '@/components/user/EditProfileModal';
import ChangeAvatarModal from '@/components/shared/ChangeAvatarModal';
import { merchantApi } from '@/services/merchant';
import type { MerchantProfile } from '@/types/user';

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MerchantProfile | null>(null);
  
  // 模态框状态
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  
  // 提交审核 Loading
  const [submitLoading, setSubmitLoading] = useState(false);

  // === 1. 获取数据 ===
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res: any = await merchantApi.getProfile();
      // 后端可能直接返回对象，也可能返回 { data: ... }
      const profileData = res.data || res;
      setData(profileData);
    } catch (error: any) {
      // 🟢 关键点：如果后端返回 404，说明是新用户，没资料
      if (error.response?.status === 404) {
        setData(null); // 设置为空，触发 Empty 渲染
      } else {
        message.error('获取资料失败');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // === 2. 提交审核逻辑 ===
  const handleSubmitAudit = () => {
    Modal.confirm({
      title: '确认提交审核？',
      content: '提交后资料将锁定，直到审核完成。请确保所有信息真实有效。',
      onOk: async () => {
        setSubmitLoading(true);
        try {
          await merchantApi.submitAudit();
          message.success('已提交审核，请耐心等待');
          fetchProfile(); // 刷新状态
        } catch (error) {
          message.error('提交失败');
        } finally {
          setSubmitLoading(false);
        }
      }
    });
  };

  // === 3. 渲染逻辑 ===

  if (loading) return <div style={{ padding: 80, textAlign: 'center' }}><Spin size="large" /></div>;

  // 场景 A: 新用户（无资料）-> 显示引导页
  if (!data) {
    return (
      <Result
        status="info"
        title="欢迎加入 E-Stay 商家平台"
        subTitle="您需要先完善商户资质信息，通过审核后才能发布酒店。"
        extra={
          <Button type="primary" size="large" icon={<FormOutlined />} onClick={() => setIsEditModalOpen(true)}>
            立即完善资料
          </Button>
        }
      >
        {/* 这里复用 EditModal，传 null 进去代表创建 */}
        <EditProfileModal
          visible={isEditModalOpen}
          data={null} 
          onCancel={() => setIsEditModalOpen(false)}
          onSuccess={() => {
             setIsEditModalOpen(false);
             fetchProfile(); // 创建成功后刷新，应该就有数据了
          }}
        />
      </Result>
    );
  }

  // 场景 B: 有资料 -> 显示详情 + 提交按钮
  return (
    <>
      {/* 顶部状态提示栏 */}
      {data.auditInfo?.verifyStatus === 'unverified' && (
        <Alert 
          message="资料未提交审核" 
          description="当前资料处于草稿状态，请核对无误后点击下方“提交审核”按钮。" 
          type="warning" 
          showIcon 
          style={{ marginBottom: 24 }}
          action={
            <Button type="primary" size="small" loading={submitLoading} onClick={handleSubmitAudit}>
              提交审核
            </Button>
          }
        />
      )}
      
      {data.auditInfo?.verifyStatus === 'pending' && (
        <Alert message="审核中" description="您的资料正在审核中，期间无法修改。" type="info" showIcon style={{ marginBottom: 24 }} />
      )}

      {/* 资料卡片 */}
      <ProfileInfo 
        loading={false} 
        data={data} 
        onEdit={() => setIsEditModalOpen(true)} 
        onEditAvatar={() => setIsAvatarModalOpen(true)}
      />

      {/* 底部补充操作区 */}
      <div style={{ marginTop: 24, textAlign: 'center' }}>
         {/* 只有未认证或被驳回时，才显示提交按钮 */}
         {['unverified', 'rejected'].includes(data.auditInfo?.verifyStatus || '') && (
            <Button 
              type="primary" 
              size="large" 
              icon={<AuditOutlined />} 
              loading={submitLoading} 
              onClick={handleSubmitAudit}
              style={{ width: 200 }}
            >
              提交审核
            </Button>
         )}
      </div>

      {/* 弹窗组件 */}
      <EditProfileModal
        visible={isEditModalOpen}
        data={data}
        onCancel={() => setIsEditModalOpen(false)}
        onSuccess={() => {
           setIsEditModalOpen(false);
           fetchProfile();
        }}
      />
      <ChangeAvatarModal 
        visible={isAvatarModalOpen}
        onCancel={() => setIsAvatarModalOpen(false)}
        onSuccess={() => fetchProfile()} // 简单起见，直接刷新
      />
    </>
  );
};

export default Profile;