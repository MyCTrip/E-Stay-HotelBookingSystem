import React, { useState, useEffect, useCallback } from 'react';
import {
    Typography, Table, Tag, Space, Button, Modal,
    Input, message, Popconfirm, Card, Select, Image, Descriptions, Divider
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    CheckCircleOutlined, CloseCircleOutlined,
    EyeOutlined, SearchOutlined
} from '@ant-design/icons';
import request from '@/services/request';

const { Title, Text } = Typography;
const { Search, TextArea } = Input;

// 1. ✅ 修复：让 TypeScript 接口完美匹配后端的嵌套 JSON 数据结构
interface IHotel {
    _id: string;
    merchantId: {
        _id: string;
        baseInfo: {
            merchantName: string;
        };
    };
    baseInfo: {
        nameCn: string;
        nameEn?: string;
        address?: string;
        city?: string;
        star?: number;
        openTime?: string;
        images: string[];
        description?: string;
        facilities?: Array<{ id: string; name: string; facilities: Array<{ id: string; name: string; available: boolean }> }>;
        policies?: { policyType: string; content: string }[];
    };
    checkinInfo?: {
        checkinTime?: string;
        checkoutTime?: string;
    };
    auditInfo: {
        status: 'draft' | 'pending' | 'approved' | 'rejected' | 'offline';
        rejectReason?: string;
    };
    createdAt: string;
}

// 辅助函数：去除 HTML 标签（因为商户端设施和政策是富文本）
const stripHtml = (html?: string) => {
    return html?.replace(/<[^>]*>?/gm, '') || '-';
};

const AuditHotel: React.FC = () => {
    const [hotels, setHotels] = useState<IHotel[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

    const [filters, setFilters] = useState<{ status?: string; search?: string }>({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState<IHotel | null>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [isBulk, setIsBulk] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [actionType, setActionType] = useState<'reject' | 'offline' | null>(null);
    const [reason, setReason] = useState('');

    // 2. 获取列表
    const fetchData = useCallback(async (page = 1, size = 10) => {
        setLoading(true);
        try {
            const res: any = await request.get('/admin/hotels', {
                params: {
                    page,
                    limit: size,
                    status: filters.status,
                    search: filters.search
                }
            });
            setHotels(res.data || []);
            setPagination(prev => ({ ...prev, current: page, total: res.meta?.total || 0 }));
        } catch (err) {
            console.error('加载列表失败');
            message.error('加载列表失败');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const executeAction = async (ids: string[], type: 'approve' | 'reject' | 'offline', opReason?: string) => {
        try {
            if (ids.length > 1 || isBulk) {
                await request.post('/admin/hotels/bulk', { ids, action: type, reason: opReason });
            } else {
                await request.post(`/admin/hotels/${ids[0]}/${type}`, { reason: opReason });
            }
            message.success('操作已执行');
            setModalVisible(false);
            setReason('');
            setSelectedRowKeys([]);
            fetchData(pagination.current);
        } catch (err) { /* 报错由拦截器处理 */ }
    };

    // 3. 表格列映射
    const columns: ColumnsType<IHotel> = [
        {
            title: '酒店名称',
            dataIndex: ['baseInfo', 'nameCn'],
            width: '20%',
            render: (text, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{text || '未知酒店名称'}</Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>{record.baseInfo?.city || '未知城市'}</Text>
                </Space>
            )
        },
        {
            title: '提交商户',
            dataIndex: ['merchantId', 'baseInfo', 'merchantName'],
            key: 'merchantName',
            render: (text) => <Text>{text || '未知商户'}</Text>
        },
        {
            title: '当前状态',
            dataIndex: ['auditInfo', 'status'],
            render: (status: IHotel['auditInfo']['status'], record) => {
                const map = { pending: 'blue', approved: 'green', rejected: 'red', offline: 'default', draft: 'orange' };
                const texts = { pending: '待审核', approved: '已通过', rejected: '已驳回', offline: '已下线', draft: '草稿' };
                const color = map[status] ?? 'default';
                const text = texts[status] ?? String(status ?? '未知');
                return (
                    <Space direction="vertical" size={0}>
                        <Tag color={color}>{text}</Tag>
                        {status === 'rejected' && record.auditInfo?.rejectReason && (
                            <Text type="danger" style={{ fontSize: '11px' }}>原因: {record.auditInfo.rejectReason}</Text>
                        )}
                    </Space>
                );
            }
        },
        {
            title: '详情',
            key: 'detail',
            render: (_, record) => (
                <Button type="link" icon={<EyeOutlined />} onClick={() => { setSelectedHotel(record); setDetailVisible(true); }}>
                    查看详情
                </Button>
            )
        },
        {
            title: '管理操作',
            key: 'action',
            render: (_, record) => {
                const status = record.auditInfo?.status;
                return (
                    <Space size="small">
                        {status === 'pending' && (
                            <>
                                <Popconfirm title="批准通过？" onConfirm={() => executeAction([record._id], 'approve')}>
                                    <Button type="link" size="small">通过</Button>
                                </Popconfirm>
                                <Button type="link" size="small" danger onClick={() => { setCurrentId(record._id); setActionType('reject'); setIsBulk(false); setModalVisible(true); }}>驳回</Button>
                            </>
                        )}
                        {status === 'approved' && (
                            <Button type="link" size="small" danger onClick={() => { setCurrentId(record._id); setActionType('offline'); setIsBulk(false); setModalVisible(true); }}>下线</Button>
                        )}
                        {(status === 'rejected' || status === 'offline') && (
                            <Button type="link" size="small" onClick={() => executeAction([record._id], 'approve')}>恢复上线</Button>
                        )}
                    </Space>
                );
            }
        }
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card variant="borderless">
                <Title level={3} style={{ marginBottom: 24 }}>酒店信息审核管理</Title>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <Space size="middle">
                        <Select placeholder="状态筛选" style={{ width: 120 }} allowClear onChange={(v) => setFilters(p => ({ ...p, status: v }))}>
                            <Select.Option value="pending">待审核</Select.Option>
                            <Select.Option value="approved">已通过</Select.Option>
                            <Select.Option value="rejected">已驳回</Select.Option>
                        </Select>
                        <Search
                            placeholder="搜索酒店或商户名称..."
                            onSearch={(v) => setFilters(p => ({ ...p, search: v }))}
                            style={{ width: 300 }}
                            enterButton={<SearchOutlined />}
                        />
                    </Space>

                    {selectedRowKeys.length > 0 && (
                        <Space>
                            <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => executeAction(selectedRowKeys as string[], 'approve')}>批量通过</Button>
                            <Button danger icon={<CloseCircleOutlined />} onClick={() => { setIsBulk(true); setActionType('reject'); setModalVisible(true); }}>批量驳回</Button>
                        </Space>
                    )}
                </div>

                <Table
                    rowSelection={{ selectedRowKeys, onChange: (keys) => setSelectedRowKeys(keys) }}
                    columns={columns}
                    dataSource={hotels}
                    rowKey="_id"
                    loading={loading}
                    pagination={{ ...pagination, onChange: (p, s) => fetchData(p, s) }}
                />
            </Card>

            {/* 4. ✅ 修复：详情展示 Modal，增加更详细的信息 */}
            <Modal
                title="酒店详细申报资料"
                open={detailVisible}
                onCancel={() => setDetailVisible(false)}
                footer={[<Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>]}
                width={900}
            >
                {selectedHotel && (
                    <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                        <Descriptions title="基本属性" bordered column={2}>
                            <Descriptions.Item label="酒店名称">{selectedHotel.baseInfo?.nameCn}</Descriptions.Item>
                            <Descriptions.Item label="所在城市">{selectedHotel.baseInfo?.city || '-'}</Descriptions.Item>
                            <Descriptions.Item label="所属商户">{selectedHotel.merchantId?.baseInfo?.merchantName}</Descriptions.Item>
                            <Descriptions.Item label="星级">{selectedHotel.baseInfo?.star ? `${selectedHotel.baseInfo.star} 星` : '-'}</Descriptions.Item>
                            <Descriptions.Item label="详细地址" span={2}>{selectedHotel.baseInfo?.address || '-'}</Descriptions.Item>
                            <Descriptions.Item label="提交时间">{new Date(selectedHotel.createdAt).toLocaleString()}</Descriptions.Item>

                            {/* 👇 新增：酒店简介 */}
                            <Descriptions.Item label="酒店简介" span={2}>
                                {selectedHotel.baseInfo?.description || '暂无简介'}
                            </Descriptions.Item>
                        </Descriptions>

                        {/* 👇 新增：服务与政策区域 */}
                        <Divider orientation="left">服务与政策</Divider>
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="最早入住时间">{selectedHotel.checkinInfo?.checkinTime || '14:00'}</Descriptions.Item>
                            <Descriptions.Item label="最晚退房时间">{selectedHotel.checkinInfo?.checkoutTime || '12:00'}</Descriptions.Item>

                            {/* 遍历政策 (Pet, Cancellation) */}
                            {selectedHotel.baseInfo?.policies?.map((policy, idx) => {
                                let label = '其他政策';
                                if (policy.policyType === 'petAllowed') label = '宠物政策';
                                if (policy.policyType === 'cancellation') label = '取消政策';
                                return (
                                    <Descriptions.Item label={label} key={idx} span={1}>
                                        {stripHtml(policy.content)}
                                    </Descriptions.Item>
                                );
                            })}
                        </Descriptions>

                        {/* 👇 新增：设施服务 */}
                        {selectedHotel.baseInfo?.facilities && selectedHotel.baseInfo.facilities.length > 0 && (
                            <div style={{ marginTop: 16 }}>
                                <Text strong style={{ display: 'block', marginBottom: 8 }}>设施服务：</Text>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {selectedHotel.baseInfo.facilities.map((category, idx) => (
                                        <div key={idx} style={{ background: '#fafafa', padding: '12px', borderRadius: 4, border: '1px solid #f0f0f0' }}>
                                            <Tag color="blue" style={{ marginBottom: 8 }}>{category.name}</Tag>
                                            <div style={{ marginTop: 4 }}>
                                                {category.facilities.map((facility) => (
                                                    <Tag
                                                        key={facility.id}
                                                        color={facility.available ? 'green' : 'default'}
                                                        style={{ marginRight: 4, marginBottom: 4 }}
                                                    >
                                                        {facility.name}
                                                    </Tag>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Divider>酒店实景照片</Divider>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                            {selectedHotel.baseInfo?.images && selectedHotel.baseInfo.images.map((img, index) => (
                                <Image key={index} src={img} width={200} height={130} style={{ objectFit: 'cover', borderRadius: 4, border: '1px solid #f0f0f0' }} />
                            ))}
                            {(!selectedHotel.baseInfo?.images || selectedHotel.baseInfo.images.length === 0) && <Text type="secondary">暂无图片</Text>}
                        </div>
                    </div>
                )}
            </Modal>

            {/* 操作理由 Modal */}
            <Modal
                title={actionType === 'reject' ? "确定驳回该申请？" : "确定强制下线房源？"}
                open={modalVisible}
                onOk={() => {
                    const ids = isBulk ? selectedRowKeys : [currentId!];
                    if (actionType) {
                        executeAction(ids as string[], actionType, reason);
                    }
                }}
                onCancel={() => { setModalVisible(false); setReason(''); }}
            >
                <div style={{ marginBottom: 10 }}>请输入处理理由（商户端可见）：</div>
                <TextArea rows={4} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="请输入具体原因..." />
            </Modal>
        </div>
    );
};

export default AuditHotel;