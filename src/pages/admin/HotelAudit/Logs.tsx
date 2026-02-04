// import React from 'react';
// import { Typography } from 'antd';

// const Logs: React.FC = () => {
//     return (
//         <div style={{ padding: 24 }
//         }>
//             <Typography.Title level={2}> 酒店日志管理 </Typography.Title>
//             < p > 这里将放置日志管理组件...</p>
//         </div>
//     );
// };

// export default Logs;
import React, { useState, useEffect, useCallback } from 'react';
import {
    Typography, Table, Tag, Space, Card, Form,
    Select, DatePicker, Button, Tooltip
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, ReloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import request from '@/services/request';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// 1. 定义审计日志数据类型
interface IAuditLog {
    _id: string;
    targetType: 'hotel' | 'merchant' | 'room';
    targetId: string;
    action: string; // approve | reject | offline | submit ...
    operatorId: {
        _id: string;
        baseInfo?: { name: string; employeeNo: string };
    } | string;
    reason?: string;
    createdAt: string;
}

const Logs: React.FC = () => {
    const [form] = Form.useForm();
    const [logs, setLogs] = useState<IAuditLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

    // 2. 获取日志列表逻辑
    const fetchLogs = useCallback(async (page = 1, limit = 10) => {
        setLoading(true);
        const values = form.getFieldsValue();

        // 处理日期范围
        const startDate = values.range?.[0]?.startOf('day').toISOString();
        const endDate = values.range?.[1]?.endOf('day').toISOString();

        try {
            const res: any = await request.get('/admin/audit-logs', {
                params: {
                    page,
                    limit,
                    targetType: values.targetType,
                    action: values.action,
                    startDate,
                    endDate,
                }
            });
            // 适配后端返回格式 { data: AuditLog[], meta: { total, page, limit } }
            setLogs(res.data || []);
            setPagination({
                current: res.meta?.page || page,
                pageSize: res.meta?.limit || limit,
                total: res.meta?.total || 0,
            });
        } catch (err) {
            console.error('加载日志失败');
        } finally {
            setLoading(false);
        }
    }, [form]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    // 3. 表格列定义
    const columns: ColumnsType<IAuditLog> = [
        {
            title: '操作时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            render: (val) => dayjs(val).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '操作人',
            dataIndex: 'operatorId',
            key: 'operator',
            render: (op) => {
                if (typeof op === 'object' && op?.baseInfo) {
                    return (
                        <Space direction="vertical" size={0}>
                            <Text strong>{op.baseInfo.name}</Text>
                            <Text type="secondary" style={{ fontSize: '11px' }}>工号: {op.baseInfo.employeeNo}</Text>
                        </Space>
                    );
                }
                return <Text type="secondary">系统/管理员</Text>;
            }
        },
        {
            title: '操作行为',
            dataIndex: 'action',
            key: 'action',
            render: (action: string) => {
                const actionMap: Record<string, { color: string; text: string }> = {
                    approve: { color: 'green', text: '批准通过' },
                    reject: { color: 'red', text: '驳回申请' },
                    offline: { color: 'default', text: '强制下线' },
                    submit: { color: 'blue', text: '提交审核' },
                };
                const config = actionMap[action] || { color: 'orange', text: action.toUpperCase() };
                return <Tag color={config.color}>{config.text}</Tag>;
            }
        },
        {
            title: '目标类型',
            dataIndex: 'targetType',
            key: 'targetType',
            render: (type: string) => {
                const typeMap: Record<string, string> = { hotel: '酒店', merchant: '商户', room: '房型' };
                return <Tag variant="outlined">{typeMap[type] || type}</Tag>;
            }
        },
        {
            title: '操作原因/备注',
            dataIndex: 'reason',
            key: 'reason',
            ellipsis: true,
            render: (reason) => reason ? (
                <Tooltip title={reason}>
                    <span>{reason}</span>
                </Tooltip>
            ) : <Text type="secondary">-</Text>
        },
        {
            title: '对象 ID',
            dataIndex: 'targetId',
            key: 'targetId',
            width: 120,
            render: (id) => (
                <Space>
                    <Text copyable={{ text: id }} style={{ fontSize: '12px', color: '#8c8c8c' }}>
                        {id.slice(-6)}
                    </Text>
                    <Tooltip title="点击复制完整 ID">
                        <InfoCircleOutlined style={{ color: '#bfbfbf' }} />
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card bordered={false}>
                <Title level={3} style={{ marginBottom: 24 }}>系统审计日志</Title>

                {/* 4. 筛选工具栏 */}
                <Form
                    form={form}
                    layout="inline"
                    onFinish={() => fetchLogs(1)}
                    style={{ marginBottom: 24, gap: '12px' }}
                >
                    <Form.Item name="targetType" label="目标类型">
                        <Select placeholder="全部类型" allowClear style={{ width: 120 }}>
                            <Select.Option value="merchant">商户</Select.Option>
                            <Select.Option value="hotel">酒店</Select.Option>
                            <Select.Option value="room">房型</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="action" label="操作行为">
                        <Select placeholder="全部行为" allowClear style={{ width: 120 }}>
                            <Select.Option value="submit">提交</Select.Option>
                            <Select.Option value="approve">批准</Select.Option>
                            <Select.Option value="reject">驳回</Select.Option>
                            <Select.Option value="offline">下线</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="range" label="时间范围">
                        <RangePicker />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                                查询
                            </Button>
                            <Button icon={<ReloadOutlined />} onClick={() => { form.resetFields(); fetchLogs(1); }}>
                                重置
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>

                <Table
                    columns={columns}
                    dataSource={logs}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        onChange: (page, size) => fetchLogs(page, size),
                        showTotal: (total) => `共 ${total} 条日志记录`,
                    }}
                />
            </Card>
        </div>
    );
};

export default Logs;