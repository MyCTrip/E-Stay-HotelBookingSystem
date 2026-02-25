import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Radio, Checkbox, Row, Col, Button, message, Divider, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import ImageUpload from '@/components/shared/ImageUpload';
import { FACILITY_CATEGORIES, facilitiesToFormValues, formValuesToFacilities } from '@/config/facilities';
import type { UploadFile } from 'antd/es/upload/interface';

// 如果没有定义 HotelRoom 类型，可以用 any 或补充定义
import type { HotelRoom } from '@/types/hotel';

interface Props {
  open: boolean;      // 保持和你原代码一致
  title: string;
  initialValues?: any | null; 
  loading: boolean;   // 父组件控制的 loading
  onCancel: () => void;
  onSubmit: (values: any) => void; // 提交给父组件
}

export const RoomFormModal: React.FC<Props> = ({ open, title, initialValues, loading, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  // === 1. 数据回显逻辑 ===
  useEffect(() => {
    if (open) {
      if (initialValues) {
        // 编辑模式：回显数据
        const images = initialValues.baseInfo?.images?.map((url: string, i: number) => ({
             uid: String(i), name: `img-${i}`, status: 'done', url 
        })) || [];

        // 将后端的 facilities 结构转换为表单的 checkbox 选中值
        const facilitiesFormValues = facilitiesToFormValues(initialValues.baseInfo?.facilities || []);

        form.setFieldsValue({
            type: initialValues.baseInfo.type,
            price: initialValues.baseInfo.price,
            stock: initialValues.baseInfo.stock,
            maxOccupancy: initialValues.baseInfo.maxOccupancy,
            
            size: initialValues.headInfo.size,
            floor: initialValues.headInfo.floor,
            wifi: initialValues.headInfo.wifi,
            windowAvailable: initialValues.headInfo.windowAvailable,
            smokingAllowed: initialValues.headInfo.smokingAllowed,
            
            bedInfo: initialValues.bedInfo,
            images: images,
            
            // 回显设施（checkbox 选中状态）
            facilities: facilitiesFormValues
        });
      } else {
        // 新增模式：设置默认值
        form.resetFields();
        form.setFieldsValue({
            maxOccupancy: 2,
            stock: 10,
            wifi: true,
            windowAvailable: true,
            smokingAllowed: false,
            bedInfo: [{ bedType: '大床', bedNumber: 1, bedSize: '1.8m' }],
            // 默认勾选一些基础设施
            facilities: {
              basic: ['wifi', 'elevator', 'window'],
              bathroom: ['hot_water', 'private_bathroom']
            }
        });
      }
    }
  }, [open, initialValues, form]);

  // === 2. 提交逻辑 (数据清洗) ===
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      // --- A. 图片处理 ---
      let imageList = values.images?.map(
        (f: any) => f.url || (f.response && f.response.url)
      ).filter(Boolean) || [];
      
      if (imageList.length === 0) {
         imageList = ['https://via.placeholder.com/600x400?text=Room+Image']; 
      }

      // --- B. Facilities 转换 (UI -> 后端结构) ---
      // 将表单的 checkbox 选中值转换为完整的 facilities 结构
      const facilitiesDB = formValuesToFacilities(values.facilities || {});

      // --- C. Bed Remark (自动生成) ---
      const bedRemarkList = values.bedInfo.map((b: any) => 
          `${b.bedType}${b.bedSize} * ${b.bedNumber}张`
      );
      if (bedRemarkList.length === 0) bedRemarkList.push("暂无床型备注");

      // --- D. Policies (自动生成) ---
      const policiesDB = [
          { 
              policyType: 'smoking', 
              content: values.smokingAllowed ? '<p>允许吸烟</p>' : '<p>禁止吸烟</p>' 
          },
          {
              policyType: 'addBed',
              content: '<p>如需加床请咨询前台</p>' 
          }
      ];

      // --- E. 构造最终 Payload ---
      const payload = {
        baseInfo: {
            type: values.type,
            price: values.price,
            images: imageList,
            status: 'draft',
            maxOccupancy: values.maxOccupancy,
            stock: values.stock,
            
            // 新结构：facilities 包含分类和每个设施的 available 状态
            facilities: facilitiesDB,
            policies: policiesDB,
            bedRemark: bedRemarkList
        },
        headInfo: {
            size: String(values.size), 
            floor: values.floor || '2-5',
            wifi: values.wifi,
            windowAvailable: values.windowAvailable,
            smokingAllowed: values.smokingAllowed
        },
        bedInfo: values.bedInfo,
        
        breakfastInfo: {
            breakfastType: '无', 
        }
      };

      // 将清洗后的数据传给父组件
      onSubmit(payload); 

    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  // 处理 Upload 组件
  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      width={800}
      confirmLoading={loading}
      destroyOnClose
      maskClosable={false}
    >
      <Form form={form} layout="vertical">
        {/* === 1. 基础信息 === */}
        <Divider orientation="left">基础信息</Divider>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item label="房型名称" name="type" rules={[{ required: true, message: '请输入房型名称' }]}>
                    <Input placeholder="例如：豪华大床房" />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item label="价格 (每晚)" name="price" rules={[{ required: true, message: '请输入价格' }]}>
                    <InputNumber prefix="￥" style={{ width: '100%' }} min={0} />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item label="每日库存" name="stock" rules={[{ required: true, message: '请输入库存' }]}>
                    <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>
            </Col>
        </Row>
        
        <Form.Item label="房型图片" name="images" valuePropName="fileList" getValueFromEvent={normFile}>
             <ImageUpload maxCount={5} />
        </Form.Item>

        {/* === 2. 规格属性 (HeadInfo) === */}
        <Divider orientation="left">规格属性</Divider>
        <Row gutter={16}>
             <Col span={6}>
                <Form.Item label="面积 (㎡)" name="size" rules={[{ required: true, message: '必填' }]}>
                    <Input placeholder="如: 25-30" />
                </Form.Item>
             </Col>
             <Col span={6}>
                <Form.Item label="楼层" name="floor" rules={[{ required: true, message: '必填' }]}>
                    <Input placeholder="如: 2-5层" />
                </Form.Item>
             </Col>
             <Col span={6}>
                <Form.Item label="最大入住" name="maxOccupancy" rules={[{ required: true, message: '必填' }]}>
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
             </Col>
        </Row>
        
        <Row gutter={16}>
            <Col span={8}>
                <Form.Item label="是否有窗" name="windowAvailable" rules={[{ required: true }]}>
                    <Radio.Group>
                        <Radio value={true}>有窗</Radio>
                        <Radio value={false}>无窗</Radio>
                    </Radio.Group>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label="允许吸烟" name="smokingAllowed" rules={[{ required: true }]}>
                    <Radio.Group>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                    </Radio.Group>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label="WIFI" name="wifi" rules={[{ required: true }]}>
                    <Radio.Group>
                        <Radio value={true}>免费</Radio>
                        <Radio value={false}>无</Radio>
                    </Radio.Group>
                </Form.Item>
            </Col>
        </Row>

        {/* === 3. 床铺信息 (BedInfo Array) === */}
        <Divider orientation="left">床铺信息 (必填)</Divider>
        <Form.List name="bedInfo">
            {(fields, { add, remove }) => (
            <>
                {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                        {...restField}
                        name={[name, 'bedType']}
                        rules={[{ required: true, message: '选床型' }]}
                    >
                        <Select placeholder="床型" style={{ width: 120 }}>
                            {BED_TYPES.map(t => <Select.Option key={t} value={t}>{t}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        {...restField}
                        name={[name, 'bedSize']}
                        rules={[{ required: true, message: '选尺寸' }]}
                    >
                        <Select placeholder="尺寸" style={{ width: 100 }}>
                            {BED_SIZES.map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        {...restField}
                        name={[name, 'bedNumber']}
                        rules={[{ required: true, message: '填数量' }]}
                    >
                        <InputNumber placeholder="数量" min={1} />
                    </Form.Item>
                    {fields.length > 1 && (
                        <MinusCircleOutlined onClick={() => remove(name)} />
                    )}
                </Space>
                ))}
                <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    添加床铺
                </Button>
                </Form.Item>
            </>
            )}
        </Form.List>

        {/* === 4. 房型设施 (Facilities) === */}
        <Divider orientation="left">房内设施</Divider>
        <p style={{ color: '#999', fontSize: 12, marginBottom: 16 }}>勾选房间提供的设施。</p>
        {FACILITY_CATEGORIES.map((category) => (
            <Form.Item key={category.id} label={category.name}>
              <Form.Item noStyle name={['facilities', category.id]}>
                <Checkbox.Group>
                  <Row gutter={[32, 32]}>
                    {category.facilities.map((facility) => (
                      <Col span={6} key={facility.id}>
                        <Checkbox value={facility.id} style={{ whiteSpace: 'nowrap' }}>{facility.name}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Form.Item>
        ))}

      </Form>
    </Modal>
  );
};