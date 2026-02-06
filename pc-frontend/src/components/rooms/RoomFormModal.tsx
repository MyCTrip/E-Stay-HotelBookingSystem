import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Switch, Row, Col } from 'antd';
import ImageUpload from '@/components/shared/ImageUpload';
import type { HotelRoom } from '@/types/hotel';

const { TextArea } = Input;
const { Option } = Select;

interface Props {
  open: boolean;
  title: string;
  initialValues?: HotelRoom | null; // 如果有值就是编辑，没值就是创建
  loading: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

export const RoomFormModal: React.FC<Props> = ({ open, title, initialValues, loading, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  // 数据回显逻辑：把后端嵌套数据 -> 扁平化表单数据
  useEffect(() => {
    if (open && initialValues) {
        const images = initialValues.baseInfo.images?.map((url: string, i: number) => ({
         uid: String(i), name: `img-${i}`, status: 'done', url 
      })) || [];

      form.setFieldsValue({
        name: initialValues.baseInfo.type,
        price: initialValues.baseInfo.price,
        stock: initialValues.baseInfo.stock,
        description: '暂无描述', // 假设你的 HotelRoom 类型里暂时没这个字段，先mock
        size: parseFloat(initialValues.headInfo.size),
        facilities: [
             initialValues.headInfo.wifi ? 'WiFi' : '',
             initialValues.headInfo.windowAvailable ? '有窗' : ''
        ].filter(Boolean),
        hasBreakfast: initialValues.breakfastInfo?.hasBreakfast,
        images: images,
      });
    } else {
      form.resetFields(); // 创建模式清空
    }
  }, [open, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values); // 把原始表单数据传给父组件处理
    } catch (e) {
      console.log('Validate Failed:', e);
    }
  };

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
      confirmLoading={loading}
      width={700}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="房间名称" name="name" rules={[{ required: true, message: '必填' }]}>
              <Input placeholder="如：豪华海景房" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="房间代码/类型" name="code">
               <Input placeholder="系统自动生成" disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="房价 (元)" name="price" rules={[{ required: true }]}>
               <InputNumber style={{ width: '100%' }} min={0} prefix="￥" />
            </Form.Item>
          </Col>
          <Col span={8}>
             <Form.Item label="库存数量" name="stock" rules={[{ required: true }]}>
               <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
             <Form.Item label="房间大小 (m²)" name="size" rules={[{ required: true }]}>
               <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="房间描述" name="description">
          <TextArea rows={3} placeholder="输入房间描述..." />
        </Form.Item>

        <Form.Item label="额外设施" name="facilities">
           <Select mode="tags" placeholder="输入后回车"><Option value="WiFi">WiFi</Option><Option value="有窗">有窗</Option><Option value="智能马桶">智能马桶</Option></Select>
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
             <Form.Item label="提供早餐" name="hasBreakfast" valuePropName="checked">
               <Switch checkedChildren="是" unCheckedChildren="否" />
             </Form.Item>
          </Col>
        </Row>

        <Form.Item label="房间图片" name="images" valuePropName="value" getValueFromEvent={normFile}>
           <ImageUpload maxCount={5} />
        </Form.Item>
      </Form>
    </Modal>
  );
};