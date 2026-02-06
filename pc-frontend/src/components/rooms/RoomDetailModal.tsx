import React from 'react';
import { Modal, Descriptions, Image, Tag, Space } from 'antd';
import type { HotelRoom } from '@/types/hotel';

interface Props {
  open: boolean;
  data: HotelRoom | null;
  onCancel: () => void;
}

export const RoomDetailModal: React.FC<Props> = ({ open, data, onCancel }) => {
  if (!data) return null;

  return (
    <Modal title="房间详情" open={open} onCancel={onCancel} footer={null} width={600}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <Image 
          width={200} 
          src={data.baseInfo.images?.[0] || 'error'} 
          fallback="https://via.placeholder.com/200?text=No+Image"
          style={{ borderRadius: 8 }}
        />
      </div>
      
      <Descriptions bordered column={1} labelStyle={{ width: 100 }}>
        <Descriptions.Item label="房间名称">{data.baseInfo.type}</Descriptions.Item>
        <Descriptions.Item label="当前价格">
           <span style={{ color: '#f50', fontSize: 16 }}>¥{data.baseInfo.price}</span>
        </Descriptions.Item>
        <Descriptions.Item label="当前库存">{data.baseInfo.stock} 间</Descriptions.Item>
        <Descriptions.Item label="房间面积">{data.headInfo.size} m²</Descriptions.Item>
        <Descriptions.Item label="早餐包含">
           {data.breakfastInfo?.hasBreakfast ? <Tag color="green">含早</Tag> : <Tag>无早</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="设施配套">
           <Space>
             {data.headInfo.wifi && <Tag color="blue">WiFi</Tag>}
             {data.headInfo.windowAvailable && <Tag color="blue">有窗</Tag>}
           </Space>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};