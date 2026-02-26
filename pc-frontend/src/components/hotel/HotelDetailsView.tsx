import React, { useState } from 'react';
import { Card, Descriptions, Button, Tag, Table, Image, Space, Modal, message, Spin, Divider, Empty, TimePicker } from 'antd';
import { EditOutlined, EnvironmentOutlined, ShopOutlined, FileTextOutlined } from '@ant-design/icons';
import { hotelApi } from '@/services/hotel';
import type { Hotel } from '@/types/hotel';

interface Props {
  data: Hotel;
  onEdit: () => void;
  onSubmitSuccess?: () => void;
}

// 酒店类型映射
const propertyTypeMap: Record<string, string> = {
  'hotel': '标准酒店',
  'hourlyHotel': '钟点房',
  'homeStay': '民宿'
};

export const HotelDetailsView: React.FC<Props> = ({ data, onEdit, onSubmitSuccess }) => {
  const [submitting, setSubmitting] = useState(false);

  // 酒店使用 status
  const status = data.auditInfo?.status;

  // 🔑 合并数据：优先用 pendingChanges，回退到 baseInfo
  const displayedBaseInfo = {
    ...data.baseInfo,
    ...(data.pendingChanges?.baseInfo || {})
  };

  const displayedTypeConfig = data.pendingChanges?.typeConfig || data.typeConfig;
  const propertyType = displayedBaseInfo.propertyType || 'hotel';

  const renderStatusTag = () => {
    switch (status) {
      case 'approved':
        return <Tag color="success">已上线</Tag>;
      case 'pending':
        return <Tag color="processing">待审核</Tag>;
      case 'draft':
        return <Tag>草稿</Tag>;
      case 'rejected':
        return <Tag color="error">审核未通过</Tag>;
      default:
        return null;
    }
  };

  // 处理提交审核
  const handleSubmit = async () => {
    Modal.confirm({
      title: '提交审核',
      content: '确定要提交此酒店进行审核吗？提交后管理员将进行审核。',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        setSubmitting(true);
        try {
          await hotelApi.submitAudit(data._id);
          message.success('酒店已提交审核');
          onSubmitSuccess?.();
        } catch (err: any) {
          console.error(err);
          message.error(err?.response?.data?.message || '提交失败');
        } finally {
          setSubmitting(false);
        }
      },
    });
  };

  const roomColumns = [
    { title: '房型名称', dataIndex: ['baseInfo', 'type'], key: 'type' },
    {
      title: '价格',
      dataIndex: ['baseInfo', 'price'],
      key: 'price',
      render: (val: number) => `¥${val}`
    },
    { title: '库存', dataIndex: ['baseInfo', 'stock'], key: 'stock' },
    {
      title: '面积',
      dataIndex: ['headInfo', 'size'],
      key: 'size',
      render: (val: string) => `${val} m²`
    },
    {
      title: '早餐',
      key: 'breakfast',
      render: (_: any, record: any) =>
        record.breakfastInfo?.hasBreakfast ? (
          <Tag color="green">含早</Tag>
        ) : (
          <Tag>无早</Tag>
        )
    }
  ];

  return (
    <Spin spinning={submitting} tip="正在提交...">
      <div style={{ paddingBottom: 60 }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24
          }}
        >
          <div>
            {/* 标题 + 状态 + 类型 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h2 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>
                {displayedBaseInfo.nameCn}
              </h2>
              {renderStatusTag()}
              <Tag color="cyan">{propertyTypeMap[propertyType] || propertyType}</Tag>
            </div>

            <Space style={{ marginTop: 8 }}>
              <Tag color="blue">{displayedBaseInfo.city}</Tag>
              <span style={{ color: '#666' }}>
                <EnvironmentOutlined /> {displayedBaseInfo.address}
              </span>
            </Space>
          </div>

          <Space>
            {status === 'draft' && (
              <Button
                type="primary"
                size="large"
                icon={<FileTextOutlined />}
                onClick={handleSubmit}
                loading={submitting}
              >
                提交审核
              </Button>
            )}
            <Button
              type="default"
              size="large"
              icon={<EditOutlined />}
              onClick={onEdit}
            >
              编辑酒店信息
            </Button>
          </Space>
        </div>

        {/* 酒店相册 */}
        <Card title="酒店相册" variant="borderless" style={{ marginBottom: 24 }}>
          <Image.PreviewGroup>
            <Space size="large" wrap>
              {displayedBaseInfo.images?.map((url, index) => (
                <Image
                  key={index}
                  width={120}
                  height={120}
                  src={url}
                  style={{ objectFit: 'cover', borderRadius: 8 }}
                />
              ))}
            </Space>
          </Image.PreviewGroup>
        </Card>

        {/* 详细信息 */}
        <Card
          title={
            <>
              <ShopOutlined /> 基本信息
            </>
          }
          variant="borderless"
          style={{ marginBottom: 24 }}
        >
          <Descriptions column={2} bordered>
            <Descriptions.Item label="酒店名称">
              {displayedBaseInfo.nameCn}
            </Descriptions.Item>
            <Descriptions.Item label="英文名称">
              {displayedBaseInfo.nameEn || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="所在城市">
              {displayedBaseInfo.city || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="星级">
              {displayedBaseInfo.star} 星
            </Descriptions.Item>
            <Descriptions.Item label="开业时间">
              {displayedBaseInfo.openTime}
            </Descriptions.Item>
            <Descriptions.Item label="联系电话">
              {displayedBaseInfo.phone}
            </Descriptions.Item>
            <Descriptions.Item label="入住时间">
              {data.checkinInfo?.checkinTime || '14:00'}
            </Descriptions.Item>
            <Descriptions.Item label="退房时间">
              {data.checkinInfo?.checkoutTime || '12:00'}
            </Descriptions.Item>
            <Descriptions.Item label="简介" span={2}>
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {displayedBaseInfo.description}
              </div>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 🆕 钟点房配置 */}
        {propertyType === 'hourlyHotel' && displayedTypeConfig?.hourly && (
          <Card
            title="⏰ 钟点房配置"
            variant="borderless"
            style={{ marginBottom: 24 }}
          >
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="时价（元/小时）">
                ¥{displayedTypeConfig.hourly.baseConfig?.pricePerHour || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="最少租住时长">
                {displayedTypeConfig.hourly.baseConfig?.minimumHours || '-'} 小时
              </Descriptions.Item>
              <Descriptions.Item label="清洁时间">
                {displayedTypeConfig.hourly.baseConfig?.cleaningTime || '-'} 分钟
              </Descriptions.Item>
              <Descriptions.Item label="每日最大预订数">
                {displayedTypeConfig.hourly.baseConfig?.maxBookingsPerDay || '-'} 次
              </Descriptions.Item>
            </Descriptions>

            {/* 时间段配置 */}
            <Divider>时间段配置</Divider>
            {displayedTypeConfig.hourly.baseConfig?.timeSlots && displayedTypeConfig.hourly.baseConfig.timeSlots.length > 0 ? (
              <Table
                columns={[
                  {
                    title: '星期',
                    dataIndex: 'dayOfWeek',
                    key: 'dayOfWeek',
                    width: '10%',
                    render: (val: number) => ['日', '一', '二', '三', '四', '五', '六'][val] || val
                  },
                  {
                    title: '营业时间',
                    key: 'time',
                    width: '20%',
                    render: (_: any, record: any) => `${record.startTime} - ${record.endTime}`
                  },
                  {
                    title: '最小租住',
                    dataIndex: 'minStayHours',
                    key: 'minStayHours',
                    width: '15%',
                    render: (val: number) => `${val} 小时`
                  },
                  {
                    title: '每段最多预订',
                    dataIndex: 'maxBookingsPerSlot',
                    key: 'maxBookingsPerSlot',
                    width: '15%'
                  },
                  {
                    title: '说明',
                    dataIndex: 'content',
                    key: 'content',
                    render: (val: string) => val || '-'
                  }
                ]}
                dataSource={displayedTypeConfig.hourly.baseConfig.timeSlots}
                rowKey={(_, index) => index || 0}
                pagination={false}
                size="small"
              />
            ) : (
              <Empty description="暂无时间段配置" />
            )}
          </Card>
        )}

        {/* 🆕 民宿配置 */}
        {propertyType === 'homeStay' && displayedTypeConfig?.homestay && (
          <Card
            title="🏠 民宿信息"
            variant="borderless"
            style={{ marginBottom: 24 }}
          >
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="房东名称">
                {displayedTypeConfig.homestay.hostName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="房东电话">
                {displayedTypeConfig.homestay.hostPhone || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="响应时间">
                {displayedTypeConfig.homestay.responseTimeHours || '-'} 小时内回复
              </Descriptions.Item>
              <Descriptions.Item label="即时预订">
                {displayedTypeConfig.homestay.instantBooking ? '✓ 开启' : '✗ 关闭'}
              </Descriptions.Item>
              <Descriptions.Item label="最少住宿">
                {displayedTypeConfig.homestay.minStay || '-'} 晚起
              </Descriptions.Item>
              <Descriptions.Item label="最多住宿">
                {displayedTypeConfig.homestay.maxStay || '无限制'} 晚
              </Descriptions.Item>
              <Descriptions.Item label="取消政策">
                {displayedTypeConfig.homestay.cancellationPolicy || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="安全押金">
                ¥{displayedTypeConfig.homestay.securityDeposit || '0'}
              </Descriptions.Item>
            </Descriptions>

            {/* 便利设施标签 */}
            {displayedTypeConfig.homestay.amenityTags && displayedTypeConfig.homestay.amenityTags.length > 0 && (
              <>
                <Divider>便利设施</Divider>
                <Space wrap>
                  {displayedTypeConfig.homestay.amenityTags.map((tag: string) => (
                    <Tag key={tag} color="blue">{tag}</Tag>
                  ))}
                </Space>
              </>
            )}
          </Card>
        )}

        {/* 房型列表 */}
        {data.rooms && data.rooms.length > 0 && (
          <Card title="房型列表" variant="borderless">
            <Table
              dataSource={data.rooms}
              columns={roomColumns}
              rowKey="_id"
              pagination={false}
            />
          </Card>
        )}
      </div>
    </Spin>
  );
};