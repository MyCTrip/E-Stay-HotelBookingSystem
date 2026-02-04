import React, { useEffect, useState } from 'react';
import {
  PlusOutlined,
  MinusCircleOutlined,
  SaveOutlined,
  HomeOutlined,
  TagOutlined,
  EnvironmentOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Row,
  Col,
  Card,
  DatePicker,
  Space,
  message,
  Spin,
  Empty,
} from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { hotelApi } from '@/services/hotel';
import notify from '@/utils/notification';

const { TextArea } = Input;
const { Option } = Select;

// 定义表单的数据结构 (扁平化，方便 Antd 绑定)
interface FormValues {
  nameCn: string;
  nameEn?: string;
  address: string;
  city?: string;
  star?: number;
  openTime?: any;
  description?: string;
  images?: UploadFile[];

  // 动态房型数组
  rooms?: Array<{
    name: string;
    price: number;
    stock: number;
    size?: number;
    facilities?: string[];
  }>;
}

const HotelForm: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // 获取 URL 里的 ID
  const navigate = useNavigate();
  const [form] = Form.useForm<FormValues>();

  const [loading, setLoading] = useState(false); // 提交加载中
  const [fetching, setFetching] = useState(!!id); // 数据回显加载中
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const isEditMode = !!id;

  // === 1. 初始化 / 数据回显逻辑 ===
  useEffect(() => {
    if (isEditMode) {
      const loadData = async () => {
        try {
          const res: any = await hotelApi.getDetail(id);
          const data = res?.data || res;
          const base = data?.baseInfo || {};

          // 填充表单
          form.setFieldsValue({
            nameCn: base.nameCn,
            nameEn: base.nameEn,
            city: base.city,
            address: base.address,
            star: base.star,
            openTime: base.openTime ? dayjs(base.openTime) : undefined,
            description: base.description,
            // 房型回显：注意要把后端结构转回前端表单结构
            rooms: data.rooms?.map((r: any) => ({
              name: r.baseInfo?.type || r.type,
              price: r.baseInfo?.price || r.price,
              stock: r.baseInfo?.stock || r.stock,
              size: r.headInfo?.size ? Number(r.headInfo.size) : 0,
              facilities: r.headInfo?.wifi ? ['WiFi'] : [], // 简单示例
            })),
          });

          // 图片回显
          if (base.images?.length) {
            setFileList(
              base.images.map((url: string, index: number) => ({
                uid: String(index),
                name: `image-${index}`,
                status: 'done',
                url: url,
              }))
            );
          }
        } catch (err) {
          notify('error', '加载失败', '无法获取酒店详情');
        } finally {
          setFetching(false);
        }
      };
      loadData();
    } else {
      // 创建模式：给一点默认值方便测试
      form.setFieldsValue({
        star: 3,
        rooms: [{ name: '标准大床房', price: 299, stock: 5, size: 25 }],
      });
    }
  }, [id, isEditMode, form]);

  // === 2. 提交逻辑 ===
  const onFinish = async (values: FormValues) => {
    setLoading(true);
    try {
      // A. 构造 baseInfo
      const baseInfoPayload = {
        nameCn: values.nameCn,
        nameEn: values.nameEn,
        address: values.address,
        city: values.city || '未填写',
        star: values.star || 3,
        openTime: values.openTime
          ? dayjs(values.openTime).format('YYYY-MM-DD')
          : dayjs().format('YYYY-MM-DD'),
        description: values.description || '',
        roomTotal: values.rooms?.length || 0,
        phone: '待完善',
        images: fileList.map((f) => f.url || (f.response && f.response.url) || ''),
      };

      // B. 构造 Rooms 数组 (转换为后端需要的嵌套结构)
      const roomsPayload =
        values.rooms?.map((room) => ({
          baseInfo: {
            type: room.name,
            price: room.price,
            stock: room.stock,
            images: [],
            status: 'draft',
            maxOccupancy: 2,
          },
          headInfo: {
            size: String(room.size || 0),
            floor: '1-10',
            wifi: room.facilities?.includes('WiFi') || false,
            windowAvailable: true,
            smokingAllowed: false,
          },
          bedInfo: [],
          auditInfo: { status: 'draft' },
        })) || [];

      // C. 组装最终 Payload
      const payload: any = {
        baseInfo: baseInfoPayload,
        auditInfo: { status: 'draft' },
        rooms: roomsPayload,
      };

      // D. 发送请求 (根据模式选择 API)
      if (isEditMode) {
        await hotelApi.update(id, payload);
        message.success('更新成功！');
      } else {
        await hotelApi.create(payload);
        message.success('创建成功！');
      }

      // 成功后跳回列表
      navigate('/merchant/hotels');
    } catch (err: any) {
      notify('error', '提交失败', err?.response?.data?.message || '网络错误');
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e: any) => (Array.isArray(e) ? e : e?.fileList);

  if (fetching) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Spin size="large" tip="加载数据中..." />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Form form={form} name="hotel-form" onFinish={onFinish} layout="vertical">
        {/* === 模块一：基础信息 === */}
        <Card
          title={
            <Space>
              <HomeOutlined />
              <span>基础信息</span>
            </Space>
          }
          bordered={false}
          style={{ marginBottom: 24, borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="酒店中文名"
                name="nameCn"
                rules={[{ required: true, message: '请输入酒店名称' }]}
              >
                <Input placeholder="例如：易宿大酒店" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="所在城市"
                name="city"
                rules={[{ required: true, message: '请选择城市' }]}
              >
                <Input placeholder="例如：上海" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={16}>
              <Form.Item
                label="详细地址"
                name="address"
                rules={[{ required: true, message: '请输入地址' }]}
              >
                <Input
                  prefix={<EnvironmentOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="省/市/区/街道门牌号"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="星级" name="star">
                <InputNumber min={1} max={5} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="开业时间" name="openTime">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item label="酒店简介" name="description">
                <TextArea rows={1} placeholder="一句话描述酒店特色" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="images"
            label="酒店封面/相册"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              listType="picture-card"
              onChange={({ fileList: newList }) => setFileList(newList)}
              accept=".jpg,.jpeg,.png"
              beforeUpload={() => false}
              fileList={fileList}
              maxCount={8}
            >
              {fileList.length >= 8 ? null : (
                <div>
                  <CloudUploadOutlined />
                  <div style={{ marginTop: 8 }}>上传</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Card>

        {/* === 模块二：房型管理 === */}
        <Card
          title={
            <Space>
              <TagOutlined />
              <span>房型管理</span>
            </Space>
          }
          bordered={false}
          style={{ marginBottom: 24, borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
          extra={
            <Button
              type="dashed"
              size="small"
              onClick={() => {
                const rooms = form.getFieldValue('rooms') || [];
                form.setFieldsValue({ rooms: [...rooms, { name: '', price: 200, stock: 10 }] });
              }}
              icon={<PlusOutlined />}
            >
              快捷添加
            </Button>
          }
        >
          <Form.List name="rooms">
            {(fields, { add, remove }) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {fields.length === 0 && (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无房型，请添加" />
                )}

                {fields.map(({ key, name, ...restField }, index) => (
                  <Card
                    key={key}
                    type="inner"
                    size="small"
                    title={`房型 #${index + 1}`}
                    extra={
                      <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                      >
                        移除
                      </Button>
                    }
                    style={{ background: '#fafafa', border: '1px solid #f0f0f0' }}
                  >
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'name']}
                          label="房型名称"
                          rules={[{ required: true, message: '必填' }]}
                        >
                          <Input placeholder="如：豪华大床房" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'price']}
                          label="单价 (元)"
                          rules={[{ required: true, message: '必填' }]}
                        >
                          <InputNumber min={0} style={{ width: '100%' }} prefix="￥" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'stock']}
                          label="库存"
                          rules={[{ required: true, message: '必填' }]}
                        >
                          <InputNumber min={0} max={999} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item {...restField} name={[name, 'facilities']} label="配套设施">
                          <Select mode="tags" placeholder="回车添加">
                            <Option value="WiFi">WiFi</Option>
                            <Option value="含早">含早</Option>
                            <Option value="落地窗">落地窗</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item {...restField} name={[name, 'size']} label="面积 (m²)">
                          <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}

                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  style={{ height: 40, marginTop: 8 }}
                >
                  添加更多房型
                </Button>
              </div>
            )}
          </Form.List>
        </Card>

        {/* === 底部保存 === */}
        <div style={{ textAlign: 'right', marginTop: 16 }}>
          <Space size="large">
            <Button size="large" onClick={() => navigate('/merchant/hotels')}>
              取消返回
            </Button>
            <Button
              htmlType="submit"
              type="primary"
              size="large"
              icon={<SaveOutlined />}
              loading={loading}
            >
              {isEditMode ? '保存修改' : '立即发布'}
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default HotelForm;
