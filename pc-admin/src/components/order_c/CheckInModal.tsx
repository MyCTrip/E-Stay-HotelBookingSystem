import React from 'react';
import { Modal, Form, Input, Select, DatePicker, message } from 'antd';
import type { Order } from '@/types/order';

interface Props {
  open: boolean;
  order: Order | null;
  onCancel: () => void;
  onSubmit: (roomNumber: string) => void;
  loading: boolean;
}

export const CheckInModal: React.FC<Props> = ({ open, order, onCancel, onSubmit, loading }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values.roomNumber);
    } catch (e) {}
  };

  return (
    <Modal
      title="办理入住"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      destroyOnHidden={true}
    >
      <p>正在为客人 <b>{order?.userInfo.name}</b> 办理入住</p>
      <p>预订房型：{order?.roomInfo.roomType}</p>
      
      <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
        <Form.Item 
          label="分配房间号" 
          name="roomNumber" 
          rules={[{ required: true, message: '请输入房间号' }]}
          extra="请根据实际空房情况分配"
        >
          <Input placeholder="例如：8205" size="large" />
        </Form.Item>
        {/* 这里未来可以扩展：调用API获取可用空房列表做成下拉框 */}
      </Form>
    </Modal>
  );
};