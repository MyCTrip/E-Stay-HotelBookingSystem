import React, { useState, useEffect, useCallback } from 'react';
import {
    Typography, Table, Tag, Space, Button, Modal,
    Input, message, Popconfirm, Card, Select, Image, Descriptions, Divider, Row, Col
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    CheckCircleOutlined, CloseCircleOutlined,
    EyeOutlined, HomeOutlined, CoffeeOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import request from '@/services/request';

const { Title, Text } = Typography;
const { Search, TextArea } = Input;

// --- 1. 接口定义 (严格匹配后端 README) ---
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
        type: string;
        price: number;
        images: string[];
        maxOccupancy: number;
        facilities: Array<{ id: string; name: string; facilities: Array<{ id: string; name: string; available: boolean }> }>;
        policies: Array<{ policyType: string; content: string }>;
        bedRemark: string[];
    };
    headInfo: {
        size: string;
        floor: string;
        wifi: boolean;
        windowAvailable: boolean;
        smokingAllowed: boolean;
    };
    bedInfo: Array<{
        bedType: string;
        bedNumber: number;
        bedSize: string;
    }>;
    auditInfo: {
        status: 'draft' | 'pending' | 'approved' | 'rejected' | 'offline';
        rejectReason?: string;
    };
    createdAt: string;
}

const AuditRooms: React.FC = () => {
    // 状态管理
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [filters, setFilters] = useState<{ status?: string; search?: string }>({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    // 详情 Modal
    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null);

    // 操作 Modal (驳回/下线)
    const [modalVisible, setModalVisible] = useState(false);
    const [isBulk, setIsBulk] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [actionType, setActionType] = useState<'reject' | 'offline' | null>(null);
    const [reason, setReason] = useState('');

    // --- 2. 获取数据 (核心修复：增加时间戳防止缓存) ---
    const fetchData = useCallback(async (page = pagination.current, size = pagination.pageSize) => {
        setLoading(true);
        try {
            const res: any = await request.get('/admin/rooms', {
                params: {
                    page,
                    limit: size,
                    status: filters.status,
                    search: filters.search,
                    _t: Date.now() // [Fix] 强制后端/浏览器不走缓存
                }
            });
            setRooms(res.data || []);
            setPagination({
                current: page,
                pageSize: size,
                total: res.meta?.total || 0
            });
        } catch (err) {
            message.error('加载列表失败，请检查网络');
        } finally {
            setLoading(false);
        }
    }, [filters, pagination.current, pagination.pageSize]);

    useEffect(() => {
        fetchData(1);
    }, [filters]);

    // --- 3. 执行操作 (核心修复：本地状态立即更新 + 请求体净化) ---
    const executeAction = async (ids: string[], type: 'approve' | 'reject' | 'offline', opReason?: string) => {
        try {
            // [Fix] Approve 不需要 reason，避免传空字符串导致后端 Zod 校验失败
            const payload = (type === 'reject' || type === 'offline') ? { reason: opReason } : {};

            if (isBulk || ids.length > 1) {
                await request.post('/admin/rooms/bulk', { ids, action: type, ...payload });
            } else {
                await request.post(`/admin/rooms/${ids[0]}/${type}`, payload);
            }

            message.success('操作成功');
            setModalVisible(false);
            setReason('');
            setSelectedRowKeys([]);

            // [Fix] 乐观更新：立刻修改本地数据状态，让用户感觉“秒开”，不用等网络刷新
            setRooms(prevRooms => prevRooms.map(room => {
                if (ids.includes(room._id)) {
                    return {
                        ...room,
                        auditInfo: {
                            ...room.auditInfo,
                            status: type === 'approve' ? 'approved' :
                                type === 'reject' ? 'rejected' :
                                    type === 'offline' ? 'offline' : room.auditInfo.status,
                            rejectReason: opReason || room.auditInfo.rejectReason
                        }
                    };
                }
                return room;
            }));

            // 后台静默刷新一次以确保数据一致性
            fetchData(pagination.current);

        } catch (err) {
            // 错误处理通常由拦截器接管，如果这里没反应，可能是拦截器吞掉了错误
            console.error("Action Failed:", err);
        }
    };

    // --- 4. 表格列定义 (详情列单独拆分) ---
    const columns: ColumnsType<IRoom> = [
        {
            title: '所属酒店',
            dataIndex: ['hotelId', 'baseInfo', 'nameCn'],
            width: 180,
            render: (text) => <Text strong>{text || '未知酒店'}</Text>
        },
        {
            title: '房型名称',
            dataIndex: ['baseInfo', 'type'],
            width: 150,
        },
        {
            title: '销售价格',
            dataIndex: ['baseInfo', 'price'],
            width: 120,
            render: (v) => <Text type="danger">￥{v}</Text>
        },
        {
            title: '审核状态',
            dataIndex: ['auditInfo', 'status'],
            width: 120,
            render: (status: IRoom['auditInfo']['status'], record) => {
                const config = {
                    pending: { color: 'blue', text: '待审核' },
                    approved: { color: 'green', text: '已上线' }, // [Fix] 根据README approved是已上线
                    rejected: { color: 'red', text: '已驳回' },
                    offline: { color: 'default', text: '已下线' },
                    draft: { color: 'orange', text: '草稿' }
                };
                const item = config[status] || { color: 'default', text: status };
                return (
                    <Space direction="vertical" size={0}>
                        <Tag color={item.color}>{item.text}</Tag>
                        {status === 'rejected' && record.auditInfo.rejectReason && (
                            <Text type="danger" style={{ fontSize: '11px' }}>原因: {record.auditInfo.rejectReason}</Text>
                        )}
                    </Space>
                );
            }
        },
        {
            title: '详情', // 单独的详情列
            key: 'detail',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => { setSelectedRoom(record); setDetailVisible(true); }}
                >
                    查看
                </Button>
            )
        },
        {
            title: '管理操作', // 单独的操作列
            key: 'action',
            width: 180,
            render: (_, record) => {
                const { status } = record.auditInfo;
                return (
                    <Space size="small">
                        {/* 只有待审核状态显示通过/驳回 */}
                        {status === 'pending' && (
                            <>
                                <Popconfirm title="确定通过审核？将立即可被预订。" onConfirm={() => executeAction([record._id], 'approve')}>
                                    <Button type="link" size="small" style={{ color: '#52c41a' }}>通过</Button>
                                </Popconfirm>
                                <Button type="link" size="small" danger onClick={() => {
                                    setCurrentId(record._id);
                                    setActionType('reject');
                                    setIsBulk(false);
                                    setModalVisible(true);
                                }}>驳回</Button>
                            </>
                        )}
                        {/* 已上线状态显示下线 */}
                        {status === 'approved' && (
                            <Button type="link" size="small" danger onClick={() => {
                                setCurrentId(record._id);
                                setActionType('offline');
                                setIsBulk(false);
                                setModalVisible(true);
                            }}>强制下线</Button>
                        )}
                        {/* 已驳回/已下线状态显示恢复 */}
                        {(status === 'rejected' || status === 'offline') && (
                            <Popconfirm title="恢复上线？" onConfirm={() => executeAction([record._id], 'approve')}>
                                <Button type="link" size="small">重新上线</Button>
                            </Popconfirm>
                        )}
                    </Space>
                );
            }
        }
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card variant="borderless">
                <Title level={3} style={{ marginBottom: 20 }}>房型审核管理</Title>

                {/* 筛选区域 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <Space size="middle">
                        <Select
                            placeholder="状态筛选"
                            style={{ width: 120 }}
                            allowClear
                            onChange={(v) => setFilters(p => ({ ...p, status: v }))}
                        >
                            <Select.Option value="pending">待审核</Select.Option>
                            <Select.Option value="approved">已上线</Select.Option>
                            <Select.Option value="rejected">已驳回</Select.Option>
                        </Select>
                        <Search
                            placeholder="搜索房型、酒店名称..."
                            onSearch={(v) => setFilters(p => ({ ...p, search: v }))}
                            style={{ width: 300 }}
                            enterButton
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
                    rowKey="_id" // 确保这里是 _id
                    loading={loading}
                    pagination={{
                        ...pagination,
                        onChange: (p, s) => fetchData(p, s),
                        showTotal: (total) => `共 ${total} 条`
                    }}
                />
            </Card>

            {/* --- 详情 Modal (仿商户端布局 - 图片置顶) --- */}
            <Modal
                title={null} // 去掉默认标题，自定义
                open={detailVisible}
                onCancel={() => setDetailVisible(false)}
                footer={[<Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>]}
                width={800}
                centered
                styles={{ body: { padding: 0 } }} // Antd v5 写法，让图片顶格
            >
                {selectedRoom && (
                    <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                        {/* 1. 图片展示区 (顶格展示) */}
                        <div style={{ padding: '20px 20px 0 20px' }}>
                            <Title level={5} style={{ marginBottom: 15 }}>房型详情 - {selectedRoom.baseInfo.type}</Title>
                            <Row gutter={[8, 8]}>
                                {selectedRoom.baseInfo.images?.length > 0 ? (
                                    selectedRoom.baseInfo.images.map((img, i) => (
                                        <Col span={i === 0 ? 16 : 8} key={i}>
                                            <Image
                                                src={img}
                                                height={i === 0 ? 280 : 136}
                                                width="100%"
                                                style={{ objectFit: 'cover', borderRadius: 8 }}
                                            />
                                        </Col>
                                    ))
                                ) : (
                                    <div style={{ width: '100%', height: 150, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>暂无图片</div>
                                )}
                            </Row>
                        </div>

                        <div style={{ padding: 24 }}>
                            {/* 2. 核心信息 */}
                            <Descriptions title={<Space><HomeOutlined />核心配置</Space>} bordered size="small" column={2}>
                                <Descriptions.Item label="房型名称">{selectedRoom.baseInfo.type}</Descriptions.Item>
                                <Descriptions.Item label="价格"><Text type="danger" strong style={{ fontSize: 16 }}>￥{selectedRoom.baseInfo.price}</Text> / 晚</Descriptions.Item>
                                <Descriptions.Item label="所属酒店">{selectedRoom.hotelId?.baseInfo?.nameCn}</Descriptions.Item>
                                <Descriptions.Item label="状态">
                                    <Tag color={selectedRoom.auditInfo.status === 'approved' ? 'green' : 'blue'}>
                                        {selectedRoom.auditInfo.status === 'approved' ? '已上线' : selectedRoom.auditInfo.status}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="最大入住">{selectedRoom.baseInfo.maxOccupancy} 人</Descriptions.Item>
                                <Descriptions.Item label="提交商户">{selectedRoom.hotelId?.merchantId?.baseInfo?.merchantName}</Descriptions.Item>
                            </Descriptions>

                            {/* 3. 规格参数 & 床铺 */}
                            <div style={{ marginTop: 24 }}>
                                <Title level={5} style={{ fontSize: 15 }}>房间设施属性</Title>
                                <div style={{ background: '#fafafa', padding: 16, borderRadius: 8 }}>
                                    <Row gutter={[24, 16]}>
                                        <Col span={6}><Text type="secondary">面积：</Text>{selectedRoom.headInfo.size}</Col>
                                        <Col span={6}><Text type="secondary">楼层：</Text>{selectedRoom.headInfo.floor}</Col>
                                        <Col span={6}><Text type="secondary">窗户：</Text>{selectedRoom.headInfo.windowAvailable ? '有窗' : '无窗'}</Col>
                                        <Col span={6}><Text type="secondary">WiFi：</Text>{selectedRoom.headInfo.wifi ? '免费提供' : '无'}</Col>
                                        <Col span={6}><Text type="secondary">吸烟：</Text>{selectedRoom.headInfo.smokingAllowed ? '允许' : '禁止'}</Col>
                                    </Row>
                                    <Divider style={{ margin: '16px 0' }} dashed />
                                    <div>
                                        <Text type="secondary" style={{ marginRight: 8 }}>床铺分布:</Text>
                                        {selectedRoom.bedInfo?.map((bed, i) => (
                                            <Tag key={i} color="blue">{bed.bedType} ({bed.bedSize}) × {bed.bedNumber}张</Tag>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* 4. 设施服务 */}
                            <div style={{ marginTop: 24 }}>
                                <Title level={5} style={{ fontSize: 15 }}><CoffeeOutlined /> 设施服务</Title>
                                {selectedRoom.baseInfo.facilities?.map((category, i) => (
                                    <div key={i} style={{ marginBottom: 12 }}>
                                        <Tag color="cyan">{category.name}</Tag>
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

                            {/* 5. 入住政策 (渲染 HTML) */}
                            <div style={{ marginTop: 24 }}>
                                <Title level={5} style={{ fontSize: 15 }}><InfoCircleOutlined /> 入住政策</Title>
                                {selectedRoom.baseInfo.policies?.map((p, i) => (
                                    <div key={i} style={{ marginBottom: 8, paddingLeft: 8, borderLeft: '3px solid #1890ff' }}>
                                        <Text strong>{p.policyType}</Text>
                                        <div style={{ marginTop: 4, color: '#555', fontSize: 13 }} dangerouslySetInnerHTML={{ __html: p.content }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* 操作理由弹窗 */}
            <Modal
                title={actionType === 'reject' ? "确认驳回申请" : "确认下线房型"}
                open={modalVisible}
                onOk={() => {
                    const ids = isBulk ? selectedRowKeys : [currentId!];
                    executeAction(ids as string[], actionType!, reason);
                }}
                onCancel={() => setModalVisible(false)}
            >
                <div style={{ marginBottom: 8 }}>请输入操作原因（商户可见）：</div>
                <TextArea
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="例如：图片不清晰、价格设置异常等..."
                />
            </Modal>
        </div>
    );
};

export default AuditRooms;