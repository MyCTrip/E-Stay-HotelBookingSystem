import { Layout, Spin } from 'antd';

const { Content } = Layout;

function PageLoader() {
  return (
    <Content className="page-loader" style={{ textAlign: 'center', padding: 48 }}>
      <Spin size="large" tip="加载中..." />
    </Content>
  );
}

export default PageLoader;
