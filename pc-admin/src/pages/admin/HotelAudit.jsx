// src/pages/admin/HotelAudit.jsx
import React from 'react';
import { List, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getHotels } from '../../services/hotel';

/**
 * 管理端酒店审核示例：使用 React Query 获取酒店列表
 */
const HotelAudit = () => {
  const { data, isLoading, error } = useQuery(['hotels'], () => getHotels());

  if (isLoading) return <Spin />;
  if (error) return <div style={{ padding: 20 }}>加载失败：{error?.message || '未知错误'}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>管理员审核</h1>
      <List
        bordered
        dataSource={data || []}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item.name} description={item.address} />
          </List.Item>
        )}
      />
    </div>
  );
};

export default HotelAudit;