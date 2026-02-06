// import React, { useEffect, useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { Descriptions, Image, List, Result, Tag, Typography, Button, Card, Space } from 'antd'
// import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons'
// import { hotelApi } from '@/services/hotel'
// import PageLoader from '@/components/PageLoader/PageLoader'
// // 注意：确保 responseAsStatus 工具函数能处理新的 status 字符串
// import { roomStatusAsResponse } from '@/utils/responseAsStatus'
// import type { Hotel } from '@/types/hotel'

// const HotelDetails: React.FC = () => {
//   const { id } = useParams<{ id: string }>()
//   const navigate = useNavigate()

//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [data, setData] = useState<Hotel | null>(null)

//   useEffect(() => {
//     if (!id) return;

//     const load = async () => {
//       try {
//         const res = await hotelApi.getDetail(id)
//         const payload: any = res?.data || res
//         setData(payload)
//       } catch (err: any) {
//         setError(err?.response?.data?.message || 'Network error')
//       }
//       setLoading(false)
//     }
//     load()
//   }, [id])

//   const goBack = () => navigate(-1)
//   const goToEdit = () => navigate(`/merchant/hotels/${id}/edit`)

//   if (loading) return <PageLoader />
  
//   if (error) return (
//     <Result 
//       title='Failed to fetch' 
//       subTitle={error} 
//       status='error' 
//       extra={<Button onClick={goBack}>返回列表</Button>} 
//     />
//   )

//   // 简化读取路径的 helper
//   const base = data?.baseInfo
//   const audit = data?.auditInfo

//   return (
//     <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
//       <Card
//         title={
//           <Space>
//             <Button icon={<ArrowLeftOutlined />} onClick={goBack} type="text" />
//             <span>酒店详情</span>
//           </Space>
//         }
//         extra={
//           <Button type="primary" icon={<EditOutlined />} onClick={goToEdit}>
//             编辑酒店
//           </Button>
//         }
//         variant="borderless"
//       >
//         <Descriptions bordered column={3}>
//           {/* 图片展示: 改为从 baseInfo 读取 */}
//           <Descriptions.Item label='酒店图片' span={3}>
//             {base?.images && base.images.length > 0 ? (
//               <Image.PreviewGroup>
//                 {base.images.map((image, idx) => (
//                   <Image 
//                     key={idx} 
//                     className='p-2' 
//                     src={image} 
//                     width={120} 
//                     height={100} 
//                     style={{ objectFit: 'cover', marginRight: 8, borderRadius: 4 }}
//                   />
//                 ))}
//               </Image.PreviewGroup>
//             ) : <span style={{color: '#999'}}>暂无图片</span>}
//           </Descriptions.Item>

//           {/* 基础信息: 改为从 baseInfo 读取 */}
//           <Descriptions.Item label='酒店名称'>{base?.nameCn}</Descriptions.Item>
//           <Descriptions.Item label='所在城市' span={2}>{base?.city || '未填写'}</Descriptions.Item>

//           <Descriptions.Item label='详细描述' span={3}>
//              {base?.description || '暂无描述'}
//           </Descriptions.Item>

//           <Descriptions.Item label='当前状态' span={3}>
//              {/* 状态信息: 改为从 auditInfo 读取 */}
//              {audit?.status && (
//                 <Tag color={roomStatusAsResponse(audit.status).color}>
//                   {roomStatusAsResponse(audit.status).level}
//                 </Tag>
//              )}
//           </Descriptions.Item>

//           <Descriptions.Item label='最后更新'>{data?.updatedAt?.split('T')[0]}</Descriptions.Item>
//           <Descriptions.Item label='创建时间' span={2}>{data?.createdAt?.split('T')[0]}</Descriptions.Item>

//           {/* 房型列表: 注意 Item 里的读取路径也变了 */}
//           <Descriptions.Item label='房型列表' span={3}>
//             <List 
//               bordered 
//               dataSource={data?.rooms || []} 
//               renderItem={(item: any) => (
//                 <List.Item>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
//                     {/* 根据新类型，Room 的数据也在 baseInfo 里 */}
//                     <Typography.Text strong>{item.baseInfo?.type || item.type}</Typography.Text>
//                     <span>
//                        <Tag color="blue">￥{item.baseInfo?.price || item.price}</Tag>
//                        {/* stock 字段在 schema 里暂时没看到，先做兼容处理 */}
//                        {item.baseInfo?.stock !== undefined && <Tag>库存: {item.baseInfo.stock}</Tag>}
//                     </span>
//                   </div>
//                 </List.Item>
//               )} 
//               locale={{ emptyText: '暂无房型数据' }}
//             />
//           </Descriptions.Item>
//         </Descriptions>
//       </Card>
//     </div>
//   )
// }

// export default HotelDetails