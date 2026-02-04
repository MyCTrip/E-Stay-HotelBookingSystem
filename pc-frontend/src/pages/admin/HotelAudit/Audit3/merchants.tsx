// import React from 'react';
// import { Typography } from 'antd';

// const AuditMerchants: React.FC = () => {
//     return (
//         <div style={{ padding: 24 }}>
//             <Typography.Title level={2}> 酒店商户审核管理 </Typography.Title>
//             < p > 这里将放置酒店商户审核管理组件...</p>
//         </div>
//     );
// };

// export default AuditMerchants;
import React, { useState, useEffect, useCallback } from 'react';
import {
    Typography, Table, Tag, Space, Button, Modal,
    Input, message, Popconfirm, Card, Select, Descriptions, Divider
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    CheckCircleOutlined, CloseCircleOutlined,
    EyeOutlined, SearchOutlined
} from '@ant-design/icons';
import request from '@/services/request';

const { Title, Text } = Typography;
const { Search, TextArea } = Input;

// 1. 定义商户数据类型
interface IMerchant {
    _id: string;
    baseInfo: {
        merchantName: string;
        contactName: string;
        contactPhone: string;
        contactEmail: string;
    };
    auditInfo: {
        // 对应后端 verifyStatus 逻辑
        verifyStatus: 'pending' | 'verified' | 'rejected';
        rejectReason?: string;
    };
    createdAt: string;
}

const AuditMerchants: React.FC = () => {
    // 列表与查询状态
    const [merchants, setMerchants] = useState<IMerchant[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [filters, setFilters] = useState<{ status?: string; search?: string }>({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    // 详情查看状态
    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedMerchant, setSelectedMerchant] = useState<IMerchant | null>(null);

    // 审批弹窗状态
    const [modalVisible, setModalVisible] = useState(false);
    const [isBulk, setIsBulk] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [reason, setReason] = useState('');

    // 2. 获取商户列表
    const fetchData = useCallback(async (page = 1, size = 10) => {
        setLoading(true);
        try {
            const res: any = await request.get('/admin/merchants', {
                params: {
                    page,
                    limit: size,
                    status: filters.status,
                    search: filters.search
                }
            });
            // 适配后端返回格式 { data: [], meta: { total } }
            setMerchants(res.data || []);
            setPagination(prev => ({ ...prev, current: page, total: res.meta?.total || 0 }));
        } catch (err) {
            console.error('加载商户列表失败');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // 3. 执行审核动作 (支持单体和批量审批)
    const executeAction = async (ids: string[], action: 'approve' | 'reject', opReason?: string) => {
        try {
            if (ids.length > 1 || isBulk) {
                // 批量审批商户
                await request.post('/admin/merchants/bulk', { ids, action, reason: opReason });
            } else {
                // 单体审批商户
                await request.post(`/admin/merchants/${ids[0]}/${action}`, { reason: opReason });
            }

            message.success('审核操作已成功');
            setModalVisible(false);
            setReason('');
            setSelectedRowKeys([]);
            fetchData(pagination.current);
        } catch (err) { /* 报错由拦截器处理 */ }
    };

    const columns: ColumnsType<IMerchant> = [
        {
            title: '商户名称',
            dataIndex: ['baseInfo', 'merchantName'],
            render: (text) => <Text strong>{text}</Text>
        },
        {
            title: '联系人',
            render: (_, record) => (
                <Space orientation="vertical" size={0}>
                    <Text>{record.baseInfo.contactName}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.baseInfo.contactPhone}</Text>
                </Space>
            )
        },
        {
            title: '审核状态',
            dataIndex: ['auditInfo', 'verifyStatus'],
            render: (status: IMerchant['auditInfo']['verifyStatus'], record) => {
                const map = { pending: { color: 'blue', text: '待审核' }, verified: { color: 'green', text: '已认证' }, rejected: { color: 'red', text: '已驳回' } };
                const config = map[status] ?? { color: 'default', text: String(status ?? '未知') };
                return (
                    <Space orientation="vertical" size={0}>
                        <Tag color={config.color}>{config.text}</Tag>
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
                <Button type="link" icon={<EyeOutlined />} onClick={() => { setSelectedMerchant(record); setDetailVisible(true); }}>
                    查看资料
                </Button>
            )
        },
        {
            title: '管理操作',
            key: 'action',
            render: (_, record) => {
                const { verifyStatus } = record.auditInfo;
                return (
                    <Space size="small">
                        {verifyStatus === 'pending' && (
                            <>
                                <Popconfirm title="确认批准该商户入驻？" onConfirm={() => executeAction([record._id], 'approve')}>
                                    <Button type="link" size="small">批准</Button>
                                </Popconfirm>
                                <Button type="link" size="small" danger onClick={() => { setCurrentId(record._id); setIsBulk(false); setModalVisible(true); }}>
                                    驳回
                                </Button>
                            </>
                        )}
                        {(verifyStatus === 'rejected') && (
                            <Button type="link" size="small" onClick={() => executeAction([record._id], 'approve')}>重新批准</Button>
                        )}
                    </Space>
                );
            }
        }
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card variant="borderless">
                <Title level={3} style={{ marginBottom: 24 }}>酒店商户审核管理</Title>

                {/* 4. 管理端列表查询与批量工具栏 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <Space size="middle">
                        <Select placeholder="审核状态" style={{ width: 120 }} allowClear onChange={(v) => setFilters(p => ({ ...p, status: v }))}>
                            <Select.Option value="pending">待审核</Select.Option>
                            <Select.Option value="verified">已认证</Select.Option>
                            <Select.Option value="rejected">已驳回</Select.Option>
                        </Select>
                        <Search placeholder="搜索商户名/联系人..." onSearch={(v) => setFilters(p => ({ ...p, search: v }))} style={{ width: 250 }} enterButton={<SearchOutlined />} />
                    </Space>

                    {selectedRowKeys.length > 0 && (
                        <Space>
                            <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => executeAction(selectedRowKeys as string[], 'approve')}>批量批准</Button>
                            <Button danger icon={<CloseCircleOutlined />} onClick={() => { setIsBulk(true); setModalVisible(true); }}>批量驳回</Button>
                        </Space>
                    )}
                </div>

                <Table
                    rowSelection={{ selectedRowKeys, onChange: (keys) => setSelectedRowKeys(keys) }}
                    columns={columns}
                    dataSource={merchants}
                    rowKey="_id"
                    loading={loading}
                    pagination={{ ...pagination, onChange: (p, s) => fetchData(p, s) }}
                />
            </Card>

            {/* 5. 商户详细资料 Modal */}
            <Modal
                title="商户入驻详细资料"
                open={detailVisible}
                onCancel={() => setDetailVisible(false)}
                footer={[<Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>]}
                width={700}
            >
                {selectedMerchant && (
                    <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                        <Descriptions title="工商基础信息" bordered column={1}>
                            <Descriptions.Item label="商户名称">{selectedMerchant.baseInfo.merchantName}</Descriptions.Item>
                            <Descriptions.Item label="联系人姓名">{selectedMerchant.baseInfo.contactName}</Descriptions.Item>
                            <Descriptions.Item label="联系电话">{selectedMerchant.baseInfo.contactPhone}</Descriptions.Item>
                            <Descriptions.Item label="联系邮箱">{selectedMerchant.baseInfo.contactEmail}</Descriptions.Item>
                            <Descriptions.Item label="申请时间">{new Date(selectedMerchant.createdAt).toLocaleString()}</Descriptions.Item>
                        </Descriptions>

                        <Divider orientation={"left" as any}>资质证明</Divider>
                        <div style={{ padding: '20px', textAlign: 'center', background: '#f5f5f5', borderRadius: '4px' }}>
                            <Text type="secondary">此处可展示商户上传的营业执照等图片资料</Text>
                        </div>
                    </div>
                )}
            </Modal>

            {/* 6. 驳回理由 Modal */}
            <Modal
                title="确定驳回商户入驻申请？"
                open={modalVisible}
                onOk={() => {
                    const ids = isBulk ? selectedRowKeys : [currentId!];
                    executeAction(ids as string[], 'reject', reason);
                }}
                onCancel={() => { setModalVisible(false); setReason(''); }}
            >
                <div style={{ marginBottom: 10 }}>请输入驳回理由（商户可见）：</div>
                <TextArea rows={4} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="例如：营业执照模糊、联系方式无效等..." />
            </Modal>
        </div>
    );
};

export default AuditMerchants;