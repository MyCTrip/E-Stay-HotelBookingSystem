// import React from 'react';
// import { Card, Row, Col, Statistic } from 'antd';
// import { HomeOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

// // 简单的统计卡片组件
// const StatCard = ({ title, value, icon, color }: any) => (
//     <Card 
//       variant="borderless" 
//       style={{ height: '100%', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
//     >
//         <Statistic 
//           title={<span style={{ fontSize: 14, color: '#888' }}>{title}</span>}
//           value={value}
//           valueStyle={{ fontSize: 24, fontWeight: 600, color }}
//           prefix={icon}
//         />
//     </Card>
// );

// const Manage: React.FC = () => {
//   return (
//     <div style={{ padding: 24 }}>
//       <h2 style={{ marginBottom: 24 }}>Manage Operations</h2>

//       <Row gutter={[24, 24]}>
//         <Col span={6}>
//           <StatCard title="总房间数" value={12} icon={<HomeOutlined />} color="#1890ff" />
//         </Col>
//         <Col span={6}>
//           <StatCard title="已预订" value={8} icon={<ClockCircleOutlined />} color="#faad14" />
//         </Col>
//         <Col span={6}>
//           <StatCard title="可用房间" value={4} icon={<CheckCircleOutlined />} color="#52c41a" />
//         </Col>
//         <Col span={6}>
//           <StatCard title="不可用/维修" value={0} icon={<CloseCircleOutlined />} color="#ff4d4f" />
//         </Col>
//       </Row>
      
//       {/* 后续这里可以放员工列表或订单图表 */}
//       <Card style={{ marginTop: 24, minHeight: 400 }} title="近期动态">
//         <p style={{ color: '#999' }}>暂无数据...</p>
//       </Card>
//     </div>
//   );
// };

// export default Manage;