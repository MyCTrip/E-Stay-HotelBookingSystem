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

  // ================== 1. 获取资料 ==================
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res: any = await merchantApi.getProfile();
      const profileData = res.data || res;
      setData(profileData);
    } catch (error: any) {
      // 新用户（还没创建资料）
      if (error.response?.status === 404) {
        setData(null);
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

  // ================== 2. 提交审核 ==================
  const handleSubmitAudit = () => {
    Modal.confirm({
      title: '确认提交审核？',
      content: '提交后资料将锁定，直到审核完成。请确保所有信息真实有效。',
      onOk: async () => {
        setSubmitLoading(true);
        try {
          await merchantApi.submitAudit();
          message.success('已提交审核，请耐心等待');
          fetchProfile();
        } catch (error) {
          message.error('提交失败');
        } finally {
          setSubmitLoading(false);
        }
      }
    });
  };

  // ================== 3. 渲染 ==================

  if (loading) {
    return (
      <div style={{ padding: 80, textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  // ================== 场景 A：新用户 ==================
  if (!data) {
    return (
      <Result
        status="info"
        title="欢迎加入 E-Stay 商家平台"
        subTitle="您需要先完善商户资质信息，通过审核后才能发布酒店。"
        extra={
          <Button
            type="primary"
            size="large"
            icon={<FormOutlined />}
            onClick={() => setIsEditModalOpen(true)}
          >
            立即完善资料
          </Button>
        }
      >
        <EditProfileModal
          visible={isEditModalOpen}
          data={null}
          onCancel={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            setIsEditModalOpen(false);
            fetchProfile();
          }}
        />
      </Result>
    );
  }

  // ================== 场景 B：已有资料 ==================

  // 统一状态字段（防止以后字段改动）
  const status = data.auditInfo?.verifyStatus;
  const rejectReason = data.auditInfo?.rejectReason;

  return (
    <>
      {/* ================== 顶部状态提示 ================== */}

      {/* 草稿状态 */}
      {status === 'unverified' && (
        <Alert
          message="资料未提交审核"
          description="当前资料处于草稿状态，请核对无误后点击下方“提交审核”按钮。"
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
          action={
            <Button
              type="primary"
              size="small"
              loading={submitLoading}
              onClick={handleSubmitAudit}
            >
              提交审核
            </Button>
          }
        />
      )}

      {/* 审核中 */}
      {status === 'pending' && (
        <Alert
          message="审核中"
          description="您的资料正在审核中，期间无法修改。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {/* 🔥 被驳回 */}
      {status === 'rejected' && (
        <Alert
          message="审核未通过"
          description={
            <div>
              <p style={{ margin: 0 }}>
                您的信息未通过管理员审核，请修改后重新提交。
              </p>
              <p style={{ margin: '8px 0 0 0' }}>
                <strong>驳回原因：</strong>
                <span style={{ color: '#ff4d4f' }}>
                  {rejectReason || '管理员未提供具体原因'}
                </span>
              </p>
            </div>
          }
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {/* ================== 资料展示 ================== */}

      <ProfileInfo
        loading={false}
        data={data}
        onEdit={() => setIsEditModalOpen(true)}
        onEditAvatar={() => setIsAvatarModalOpen(true)}
      />

      {/* ================== 底部操作区 ================== */}

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        {['unverified', 'rejected'].includes(status || '') && (
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

      {/* ================== 弹窗组件 ================== */}

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
        onSuccess={() => fetchProfile()}
      />
    </>
  );
};

export default Profile;