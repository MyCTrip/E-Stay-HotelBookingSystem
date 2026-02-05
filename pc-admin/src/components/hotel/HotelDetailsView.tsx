import React from 'react';
import { Card, Descriptions, Button, Tag, Table, Image, Space, Divider } from 'antd';
import { EditOutlined, EnvironmentOutlined, ShopOutlined } from '@ant-design/icons';
import type { Hotel } from '@/types/hotel';

interface Props {
  data: Hotel;
  onEdit: () => void;
}

export const HotelDetailsView: React.FC<Props> = ({ data, onEdit }) => {
  // 房型列表的列定义
  const roomColumns = [
    { title: '房型名称', dataIndex: ['baseInfo', 'type'], key: 'type' },
    { title: '价格', dataIndex: ['baseInfo', 'price'], key: 'price', render: (val: number) => `¥${val}` },
    { title: '库存', dataIndex: ['baseInfo', 'stock'], key: 'stock' },
    { title: '面积', dataIndex: ['headInfo', 'size'], key: 'size', render: (val: string) => `${val} m²` },
    { 
      title: '早餐', 
      key: 'breakfast',
      render: (_: any, record: any) => record.breakfastInfo?.hasBreakfast ? <Tag color="green">含早</Tag> : <Tag>无早</Tag>
    }
  ];

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* 顶部 Header 区 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>{data.baseInfo.nameCn}</h2>
          <Space>
            <Tag color="blue">{data.baseInfo.city}</Tag>
            <span style={{ color: '#666' }}><EnvironmentOutlined /> {data.baseInfo.address}</span>
          </Space>
        </div>
        <Button type="primary" size="large" icon={<EditOutlined />} onClick={onEdit}>
          编辑酒店信息
        </Button>
      </div>

      {/* 酒店相册 */}
      <Card title="酒店相册" bordered={false} style={{ marginBottom: 24 }}>
        <Image.PreviewGroup>
          <Space size="large" wrap>
            {data.baseInfo.images?.map((url, index) => (
              <Image key={index} width={120} height={120} src={url} style={{ objectFit: 'cover', borderRadius: 8 }} />
            ))}
          </Space>
        </Image.PreviewGroup>
      </Card>

      {/* 基础详情 */}
      <Card title={<><ShopOutlined /> 详细信息</>} bordered={false} style={{ marginBottom: 24 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="英文名称">{data.baseInfo.nameEn || '-'}</Descriptions.Item>
          <Descriptions.Item label="星级">{data.baseInfo.star} 星</Descriptions.Item>
          <Descriptions.Item label="开业时间">{data.baseInfo.openTime}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{data.baseInfo.phone}</Descriptions.Item>
          
          <Descriptions.Item label="入住时间">{data.checkinInfo?.checkinTime || '14:00'}</Descriptions.Item>
          <Descriptions.Item label="退房时间">{data.checkinInfo?.checkoutTime || '12:00'}</Descriptions.Item>
          
          <Descriptions.Item label="简介" span={2}>
            <div style={{ whiteSpace: 'pre-wrap' }}>{data.baseInfo.description}</div>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 房型列表预览 */}
      <Card title="房型列表" bordered={false}>
        <Table 
          dataSource={data.rooms} 
          columns={roomColumns} 
          rowKey="_id" 
          pagination={false} 
        />
      </Card>
    </div>
  );
};