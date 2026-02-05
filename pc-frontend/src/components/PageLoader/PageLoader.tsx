import React from 'react'
import { Layout, Spin } from 'antd'

const { Content } = Layout

function PageLoader() {
  return (
    <Content className='page-loader'>
      <Spin size='large' tip='Loading...' />
    </Content>
  )
}

export default PageLoader
