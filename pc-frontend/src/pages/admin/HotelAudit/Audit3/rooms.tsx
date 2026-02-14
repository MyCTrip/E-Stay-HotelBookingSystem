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

// 1. 定义房型数据类型 (严格对应后端 Room 模块及 README)
interface IRoom {
    _id: string;
    hotelId: {
        _id: string;
        baseInfo: { nameCn: string };
        merchantId: {
            _id: string;
            baseInfo: { merchantName: string };
        };
    };
    baseInfo: {
        type: string; // 房型名称/类型
        price: number;
        images: string[];
        maxOccupancy: number;
    };
    headInfo?: {
        size: string;
        floor: string;
        wifi: boolean;
        windowAvailable: boolean;
        smokingAllowed: boolean;
    };
    auditInfo: {
        status: 'draft' | 'pending' | 'approved' | 'rejected' | 'offline'; //
        rejectReason?: string;
    };
    createdAt: string;
}

const AuditRooms: React.FC = () => {
    // 列表与分页状态
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

    // 查询与批量操作状态
    const [filters, setFilters] = useState<{ status?: string; search?: string }>({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    // 详情查看 Modal
    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null);

    // 审批操作 Modal
    const [modalVisible, setModalVisible] = useState(false);
    const [isBulk, setIsBulk] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [actionType, setActionType] = useState<'reject' | 'offline' | null>(null);
    const [reason, setReason] = useState('');

    // 2. 获取管理端房型列表
    const fetchData = useCallback(async (page = 1, size = 10) => {
        setLoading(true);
        try {
            const res: any = await request.get('/admin/rooms', {
                params: {
                    page,
                    limit: size,
                    status: filters.status,
                    search: filters.search
                }
            });
            // 适配后端返回格式 { data: [], meta: { total } }
            setRooms(res.data || []);
            setPagination(prev => ({ ...prev, current: page, total: res.meta?.total || 0 }));
        } catch (err) {
            console.error('加载列表失败');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // 3. 执行审核动作 (支持单体和批量)
    const executeAction = async (ids: string[], type: 'approve' | 'reject' | 'offline', opReason?: string) => {
        try {
            if (ids.length > 1 || isBulk) {
                // 批量审批接口
                await request.post('/admin/rooms/bulk', { ids, action: type, reason: opReason });
            } else {
                // 单体审批接口
                await request.post(`/admin/rooms/${ids[0]}/${type}`, { reason: opReason });
            }

            message.success('操作已执行');
            setModalVisible(false);
            setReason('');
            setSelectedRowKeys([]);
            fetchData(pagination.current);
        } catch (err) { /* 报错由拦截器处理 */ }
    };

    // 4. 定义表格列 (顺序：所属酒店 -> 提交商户 -> 房型名称)
    const columns: ColumnsType<IRoom> = [
        {
            title: '所属酒店',
            dataIndex: ['hotelId', 'baseInfo', 'nameCn'],
            key: 'hotelName',
            render: (text) => <Text strong>{text || '未知酒店'}</Text>
        },
        {
            title: '提交商户',
            dataIndex: ['hotelId', 'merchantId', 'baseInfo', 'merchantName'],
            key: 'merchantName',
            render: (text) => <Text>{text || '未知商户'}</Text>
        },
        {
            title: '房型名称',
            dataIndex: ['baseInfo', 'type'],
            key: 'roomType',
        },
        {
            title: '审核状态',
            dataIndex: ['auditInfo', 'status'],
            render: (status: IRoom['auditInfo']['status'], record) => {
                const map = { pending: 'blue', approved: 'green', rejected: 'red', offline: 'default', draft: 'orange' };
                const texts = { pending: '待审核', approved: '已上线', rejected: '已驳回', offline: '已下线', draft: '草稿' };
                const color = map[status] ?? 'default';
                const text = texts[status] ?? String(status ?? '未知');
                return (
                    <Space direction="vertical" size={0}>
                        <Tag color={color}>{text}</Tag>
                        {status === 'rejected' && record.auditInfo.rejectReason && (
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
                <Button type="link" icon={<EyeOutlined />} onClick={() => { setSelectedRoom(record); setDetailVisible(true); }}>
                    查看详情
                </Button>
            )
        },
        {
            title: '管理操作',
            key: 'action',
            render: (_, record) => {
                const { status } = record.auditInfo;
                return (
                    <Space size="small">
                        {status === 'pending' && (
                            <>
                                <Popconfirm title="批准该房型上线？" onConfirm={() => executeAction([record._id], 'approve')}>
                                    <Button type="link" size="small">通过</Button>
                                </Popconfirm>
                                <Button type="link" size="small" danger onClick={() => { setCurrentId(record._id); setActionType('reject'); setIsBulk(false); setModalVisible(true); }}>
                                    驳回
                                </Button>
                            </>
                        )}
                        {status === 'approved' && (
                            <Button type="link" size="small" danger onClick={() => { setCurrentId(record._id); setActionType('offline'); setIsBulk(false); setModalVisible(true); }}>
                                下线
                            </Button>
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
                <Title level={3} style={{ marginBottom: 24 }}>房型信息审核管理</Title>

                {/* 5. 搜索与批量操作工具栏 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <Space size="middle">
                        <Select placeholder="状态筛选" style={{ width: 120 }} allowClear onChange={(v) => setFilters(p => ({ ...p, status: v }))}>
                            <Select.Option value="pending">待审核</Select.Option>
                            <Select.Option value="approved">已上线</Select.Option>
                            <Select.Option value="rejected">已驳回</Select.Option>
                        </Select>
                        <Search
                            placeholder="搜索房型、酒店或商户名称..."
                            onSearch={(v) => setFilters(p => ({ ...p, search: v }))}
                            style={{ width: 320 }}
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
                    dataSource={rooms}
                    rowKey="_id"
                    loading={loading}
                    pagination={{ ...pagination, onChange: (p, s) => fetchData(p, s) }}
                />
            </Card>

            {/* 6. 房型详情 Modal (展示全部申报参数) */}
            <Modal
                title="房型详细申报资料"
                open={detailVisible}
                onCancel={() => setDetailVisible(false)}
                footer={[<Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>]}
                width={900}
            >
                {selectedRoom && (
                    <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                        <Descriptions title="核心配置" bordered column={2}>
                            <Descriptions.Item label="房型名称">{selectedRoom.baseInfo.type}</Descriptions.Item>
                            <Descriptions.Item label="销售价格"><Text type="danger">￥{selectedRoom.baseInfo.price}</Text></Descriptions.Item>
                            <Descriptions.Item label="所属酒店">{selectedRoom.hotelId?.baseInfo?.nameCn}</Descriptions.Item>
                            <Descriptions.Item label="提交商户">{selectedRoom.hotelId?.merchantId?.baseInfo?.merchantName || '-'}</Descriptions.Item>
                            <Descriptions.Item label="最大入住人数">{selectedRoom.baseInfo.maxOccupancy} 人</Descriptions.Item>
                            <Descriptions.Item label="提交时间">{new Date(selectedRoom.createdAt).toLocaleString()}</Descriptions.Item>
                        </Descriptions>

                        {selectedRoom.headInfo && (
                            <>
                                <Divider>房间设施属性</Divider>
                                <Descriptions bordered column={2}>
                                    <Descriptions.Item label="房间面积">{selectedRoom.headInfo.size}</Descriptions.Item>
                                    <Descriptions.Item label="所在楼层">{selectedRoom.headInfo.floor}</Descriptions.Item>
                                    <Descriptions.Item label="是否有窗">{selectedRoom.headInfo.windowAvailable ? '有窗' : '无窗'}</Descriptions.Item>
                                    <Descriptions.Item label="免费 WiFi">{selectedRoom.headInfo.wifi ? '提供' : '不提供'}</Descriptions.Item>
                                    <Descriptions.Item label="允许吸烟">{selectedRoom.headInfo.smokingAllowed ? '允许' : '禁止'}</Descriptions.Item>
                                </Descriptions>
                            </>
                        )}

                        <Divider>房型实景照片</Divider>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                            {selectedRoom.baseInfo.images && selectedRoom.baseInfo.images.map((img, index) => (
                                <Image key={index} src={img} width={200} height={130} style={{ objectFit: 'cover', borderRadius: 4, border: '1px solid #f0f0f0' }} />
                            ))}
                            {(!selectedRoom.baseInfo.images || selectedRoom.baseInfo.images.length === 0) && <Text type="secondary">暂无图片</Text>}
                        </div>
                    </div>
                )}
            </Modal>

            {/* 7. 操作理由 Modal */}
            <Modal
                title={actionType === 'reject' ? "确定驳回该房型申请？" : "确定强制下线该房型？"}
                open={modalVisible}
                onOk={() => {
                    const ids = isBulk ? selectedRowKeys : [currentId!];
                    actionType && executeAction(ids as string[], actionType, reason);
                }}
                onCancel={() => { setModalVisible(false); setReason(''); }}
            >
                <div style={{ marginBottom: 10 }}>请输入理由（商户可见）：</div>
                <TextArea rows={4} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="请详细说明原因，方便商户修改后重新提交..." />
            </Modal>
        </div>
    );
};

export default AuditRooms;