import React from 'react';
import { Card } from 'antd';

interface Props {
  loading: boolean;
}

export const SalesTrendChart: React.FC<Props> = ({ loading }) => {
  return (
    <Card title="近期销售趋势" variant="borderless" loading={loading} style={{ height: '100%', minHeight: 400 }}>
       <div style={{ 
         display: 'flex', 
         justifyContent: 'center', 
         alignItems: 'center', 
         height: 300, 
         color: '#ccc',
         background: '#fafafa',
         borderRadius: 8
       }}>
          {/* 这里后续可以集成 ECharts 或 Ant Design Charts */}
          📊 Chart Placeholder (等待数据接入)
       </div>
    </Card>
  );
};
