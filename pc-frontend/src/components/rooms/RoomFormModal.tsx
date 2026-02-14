import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Radio, Checkbox, Row, Col, Button, message, Divider, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import ImageUpload from '@/components/shared/ImageUpload';
import { ROOM_FACILITIES, BED_TYPES, BED_SIZES } from '@/config/roomOptions'; // 记得确认这个文件存在
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
        // 注意：这里假设父组件传进来的 initialValues 已经是后端返回的结构
        // 如果需要反向解析 HTML -> Checkbox 勾选，逻辑会比较复杂
        // 这里暂时做简单回显，主要字段对上即可
        const images = initialValues.baseInfo?.images?.map((url: string, i: number) => ({
             uid: String(i), name: `img-${i}`, status: 'done', url 
        })) || [];

        form.setFieldsValue({
            type: initialValues.baseInfo.type,
            price: initialValues.baseInfo.price,
            stock: initialValues.baseInfo.stock, // 注意：后端可能在 inventory 字段
            maxOccupancy: initialValues.baseInfo.maxOccupancy,
            
            size: initialValues.headInfo.size,
            floor: initialValues.headInfo.floor,
            wifi: initialValues.headInfo.wifi,
            windowAvailable: initialValues.headInfo.windowAvailable,
            smokingAllowed: initialValues.headInfo.smokingAllowed,
            
            bedInfo: initialValues.bedInfo, // 回显床铺数组
            
            images: images
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
            // 默认给一个床位，防止用户忘填报错 500
            bedInfo: [{ bedType: '大床', bedNumber: 1, bedSize: '1.8m' }],
            // 默认勾选一些设施
            facilities: { '基础设施': ['免费WiFi', '24小时热水'] }
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

      // --- B. Facilities 转换 (UI -> DB HTML) ---
      const facilitiesDB = Object.keys(values.facilities || {}).map(key => {
        const contentText = (values.facilities as any)[key]?.join(', ') || '';
        return {
            category: key,
            content: `<p>${contentText}</p>`
        };
      }).filter(item => item.content !== '<p></p>');

      if (facilitiesDB.length === 0) {
          facilitiesDB.push({ category: '基础配置', content: '<p>标准客房配置</p>' });
      }

      // --- C. Bed Remark (自动生成) ---
      // 必填非空数组
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
            type: values.type,         // 房型名称
            price: values.price,       // 价格
            images: imageList,
            status: 'draft',           
            maxOccupancy: values.maxOccupancy,
            stock: values.stock,       
            
            // 🔥 必须符合后端要求的字段
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
        // 🔥 必填数组
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
        {ROOM_FACILITIES.map(group => (
            <Form.Item key={group.category} label={group.category} name={['facilities', group.category]}>
                <Checkbox.Group options={group.options} />
            </Form.Item>
        ))}

      </Form>
    </Modal>
  );
};