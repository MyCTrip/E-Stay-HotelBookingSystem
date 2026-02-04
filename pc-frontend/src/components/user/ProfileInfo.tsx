import React from 'react';
import { Card, Button, Avatar, Descriptions, Tag, Row, Col, Divider } from 'antd';
import { EditOutlined, UserOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import type { MerchantProfile } from '@/types/user';

interface Props {
  loading: boolean;
  data: MerchantProfile | null;
  onEdit: () => void;
  onEditAvatar: () => void;
}

const ProfileInfo: React.FC<Props> = ({ loading, data, onEdit, onEditAvatar }) => {
  // 状态颜色映射
  const statusMap = {
    verified: { color: 'success', text: '已认证' },
    pending: { color: 'processing', text: '审核中' },
    rejected: { color: 'error', text: '审核驳回' },
    unverified: { color: 'default', text: '未认证' },
  };

  const status = data?.auditInfo?.verifyStatus || 'unverified';

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* 顶部 Header 区 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>我的信息</h2>
        <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>
          编辑个人资料
        </Button>
      </div>

      {/* 核心卡片区 */}
      <Card loading={loading} variant="borderless"style={{ borderRadius: 8 }}>
        <Row gutter={24} align="middle" style={{ marginBottom: 40 }}>
          {/* 左侧：商户名称 */}
          <Col span={10}>
             <div style={{ paddingLeft: 24 }}>
                <h1 style={{ color: '#666', fontSize: 16, marginBottom: 8 }}>商户名称</h1>
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                  {data?.baseInfo?.merchantName || '未设置名称'}
                </div>
             </div>
          </Col>
          
          {/* 中间：头像 (带小编辑笔) */}
          <Col span={4} style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
               <Avatar 
                 size={100} 
                 src={data?.avatar} 
                 icon={<UserOutlined />} 
                 style={{ backgroundColor: '#1890ff' }}
                />
               <Button 
                 shape="circle" 
                 icon={<EditOutlined />} 
                 size="small"
                 style={{ position: 'absolute', right: 0, bottom: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                 onClick={onEditAvatar}
               />
            </div>
          </Col>

          {/* 右侧留白或放其他 */}
          <Col span={10} />
        </Row>

        <Divider />

        {/* 详细信息 Grid */}
        <Descriptions bordered column={2} labelStyle={{ width: '150px', fontWeight: 500 }}>
          <Descriptions.Item label="联系人姓名">
             {data?.baseInfo?.contactName}
          </Descriptions.Item>
          
          <Descriptions.Item label="系统角色">
             <Tag color="purple">商户 (Merchant)</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="电子邮箱">
             {data?.baseInfo?.contactEmail || data?.email}
          </Descriptions.Item>

          <Descriptions.Item label="联系电话">
             {data?.baseInfo?.contactPhone}
          </Descriptions.Item>

          <Descriptions.Item label="当前状态">
             <Tag color={statusMap[status].color} icon={<SafetyCertificateOutlined />}>
               {statusMap[status].text}
             </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="营业执照号">
             {data?.qualificationInfo?.businessLicenseNo || '未录入'}
          </Descriptions.Item>

          <Descriptions.Item label="注册时间">
             2026-01-30 {/* 这里应该用 dayjs 格式化 createdAt */}
          </Descriptions.Item>

           <Descriptions.Item label="上次登录">
             2026-02-02
          </Descriptions.Item>
        </Descriptions>
        
        {/* 底部地址栏 */}
        <Descriptions bordered column={1} style={{ marginTop: -1 }}>
           <Descriptions.Item label="经营地址" labelStyle={{ width: '150px', fontWeight: 500 }}>
             上海市浦东新区张江高科园区 88 号
           </Descriptions.Item>
        </Descriptions>

      </Card>
    </div>
  );
};

export default ProfileInfo;