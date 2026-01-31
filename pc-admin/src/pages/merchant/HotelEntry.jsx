// src/pages/merchant/HotelEntry.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, message } from 'antd';
import styles from './HotelEntry.module.scss';
import useRequest from '../../hooks/useRequest';
import { createHotel } from '../../services/hotel';

/**
 * 酒店录入页面（示例）
 * @param {{ initial: Object }} props
 */
const HotelEntry = ({ initial }) => {
  const [form] = Form.useForm();

  const { loading, run } = useRequest((payload) => createHotel(payload), [], { manual: true });

  const onFinish = (values) => {
    run(values)
      .then(() => {
        message.success('提交成功');
        form.resetFields();
      })
      .catch((err) => {
        message.error(err?.message || '提交失败');
      });
  };

  return (
    <div className={styles['hotel-entry']}>
      <h2 className={styles['hotel-entry__title']}>酒店信息录入</h2>
      <div className={styles['hotel-entry__form']}>
        <Form form={form} initialValues={initial} layout="vertical" onFinish={onFinish}>
          <Form.Item label="酒店名" name="name" rules={[{ required: true, message: '请输入酒店名' }]}> 
            <Input placeholder="输入酒店名" />
          </Form.Item>

          <Form.Item label="地址" name="address">
            <Input placeholder="输入酒店地址" />
          </Form.Item>

          <div className={styles['hotel-entry__actions']}>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

HotelEntry.propTypes = {
  initial: PropTypes.object,
};

export default HotelEntry;