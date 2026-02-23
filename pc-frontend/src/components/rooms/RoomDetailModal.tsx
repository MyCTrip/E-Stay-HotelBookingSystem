import React from 'react';
import { Modal, Descriptions, Tag, Image, Divider, Typography, Space, Badge } from 'antd';
import type { HotelRoom } from '@/types/hotel';

const { Title, Paragraph } = Typography;

interface Props {
  open: boolean;
  data: HotelRoom | null;
  onCancel: () => void;
}

export const RoomDetailModal: React.FC<Props> = ({ open, data, onCancel }) => {
  if (!data) return null;

  const { baseInfo, headInfo, bedInfo, breakfastInfo, auditInfo } = data;

  // 辅助函数：解析 HTML 字符串 (简单的去除 p 标签用于展示，或者使用 dangerouslySetInnerHTML)
  const renderHtmlContent = (html: string) => {
    // 简单剥离 <p> 标签，让展示更纯净
    return html.replace(/<\/?p>/g, '');
  };

  return (
    <Modal
      title="房型详情"
      open={open}
      onCancel={onCancel}
      footer={null} // 详情页通常不需要“确定”按钮
      width={800}
    >
      {/* 1. 图片画廊 */}
      <div style={{ marginBottom: 24, overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: 8 }}>
        <Image.PreviewGroup>
          {baseInfo.images?.map((url, index) => (
            <Image 
              key={index} 
              width={120} 
              height={80} 
              src={url} 
              style={{ objectFit: 'cover', borderRadius: 4, marginRight: 8 }} 
            />
          ))}
        </Image.PreviewGroup>
      </div>

      {/* 2. 核心信息 */}
      <Descriptions title="基础信息" bordered column={2} size="middle">
        <Descriptions.Item label="房型名称">{baseInfo.type}</Descriptions.Item>
        <Descriptions.Item label="价格">
           <span style={{ color: '#ff4d4f', fontSize: 16, fontWeight: 'bold' }}>¥{baseInfo.price}</span> / 晚
        </Descriptions.Item>
        <Descriptions.Item label="每日库存">{baseInfo.stock} 间</Descriptions.Item>
        <Descriptions.Item label="状态">
          <Badge status={auditInfo?.status === 'approved' ? 'success' : 'warning'} text={auditInfo?.status} />
        </Descriptions.Item>
        <Descriptions.Item label="最大入住">{baseInfo.maxOccupancy} 人</Descriptions.Item>
        <Descriptions.Item label="早餐类型">
            {breakfastInfo?.breakfastType || '无'}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      {/* 3. 规格参数 */}
      <Descriptions title="规格参数" bordered column={3} size="small">
        <Descriptions.Item label="面积">{headInfo.size} ㎡</Descriptions.Item>
        <Descriptions.Item label="楼层">{headInfo.floor}</Descriptions.Item>
        <Descriptions.Item label="是否有窗">{headInfo.windowAvailable ? '有窗' : '无窗'}</Descriptions.Item>
        <Descriptions.Item label="WiFi">{headInfo.wifi ? '免费WiFi' : '无'}</Descriptions.Item>
        <Descriptions.Item label="吸烟政策">{headInfo.smokingAllowed ? '允许吸烟' : '禁止吸烟'}</Descriptions.Item>
      </Descriptions>

      <Divider />

      {/* 4. 床铺信息 (必填数组展示) */}
      <Title level={5}>🛏️ 床铺分布</Title>
      <Space wrap style={{ marginBottom: 16 }}>
        {bedInfo.map((bed, index) => (
            <Tag key={index} color="blue" style={{ padding: '4px 10px', fontSize: 14 }}>
                {bed.bedType} ({bed.bedSize}) × {bed.bedNumber}张
            </Tag>
        ))}
      </Space>
      {/* 展示自动生成的备注 */}
      <div style={{ color: '#666', fontSize: 12 }}>
          备注：{baseInfo.bedRemark?.join('；') || '无特殊说明'}
      </div>

      <Divider />

      {/* 5. 设施与服务 (解析后端复杂结构) */}
      <Title level={5}>🏢 设施服务</Title>
      {baseInfo.facilities?.map((fac: any, idx: number) => (
          <div key={idx} style={{ marginBottom: 8 }}>
              <Tag color="cyan">{fac.category}</Tag> 
              <span style={{ color: '#555' }}>{renderHtmlContent(fac.content)}</span>
          </div>
      ))}

      <Divider />

      {/* 6. 政策 (解析后端复杂结构) */}
      <Title level={5}>📜 入住政策</Title>
      {baseInfo.policies?.map((pol: any, idx: number) => (
          <Paragraph key={idx}>
              <strong style={{ marginRight: 8 }}>
                  {pol.policyType === 'smoking' ? '吸烟规定' : 
                   pol.policyType === 'addBed' ? '加床政策' : pol.policyType}
              </strong>
              {renderHtmlContent(pol.content)}
          </Paragraph>
      ))}

    </Modal>
  );
};