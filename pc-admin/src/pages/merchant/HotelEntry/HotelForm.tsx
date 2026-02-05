// import React, { useEffect, useState } from 'react'
// import {
//   SaveOutlined, HomeOutlined, TagOutlined, EnvironmentOutlined,
//   PlusOutlined, MinusCircleOutlined, CloudUploadOutlined,
//   ClockCircleOutlined, GiftOutlined, CompassOutlined
// } from '@ant-design/icons'
// import {
//   Button, Form, Input, InputNumber, Select, Upload,
//   Row, Col, Card, DatePicker, Space, message, Spin, Rate, Switch, Empty
// } from 'antd'
// import type { UploadFile } from 'antd/es/upload/interface'
// import { useParams, useNavigate } from 'react-router-dom'
// import dayjs from 'dayjs'
// import { hotelApi } from '@/services/hotel'
// import notify from '@/utils/notification'
// import type { Hotel, AuditStatus } from '@/types/hotel'

// const { TextArea } = Input
// const { Option } = Select

// // === 表单数据结构定义 (UI层) ===
// interface FormValues {
//   // 基础信息
//   nameCn: string
//   nameEn?: string
//   address: string
//   city?: string
//   star?: number
//   openTime?: any
//   description?: string
//   images?: UploadFile[]

//   // 入住政策 (新增)
//   checkinInfo?: {
//     checkinTime?: string
//     checkoutTime?: string
//     breakfastType?: string
//     breakfastPrice?: number
//   }

//   // 营销信息 (结构化录入 -> 拼接至简介)
//   nearbyList?: { type?: string; name?: string; distance?: string }[]
//   discountRules?: { title?: string; type?: string; value?: string }[]

//   // 房型列表
//   rooms?: Array<{
//     name: string
//     price: number
//     stock: number
//     size?: number
//     facilities?: string[]
//     hasBreakfast?: boolean
//   }>
// }

// const HotelForm: React.FC = () => {
//   const { id } = useParams<{ id: string }>()
//   const navigate = useNavigate()
//   const [form] = Form.useForm<FormValues>()
  
//   const [loading, setLoading] = useState(false)
//   const [fetching, setFetching] = useState(!!id)
//   const [fileList, setFileList] = useState<UploadFile[]>([])

//   const isEditMode = !!id

//   // === 1. 数据加载与回显 ===
//   useEffect(() => {
//     if (isEditMode) {
//       const loadData = async () => {
//         try {
//           // 强类型断言，确保 res 符合结构
//           const res: any = await hotelApi.getDetail(id)
//           const data: Hotel = res?.data || res
//           const base = data.baseInfo
//           const checkin = data.checkinInfo

//           form.setFieldsValue({
//             // 基础信息回显
//             nameCn: base.nameCn,
//             nameEn: base.nameEn,
//             city: base.city,
//             address: base.address,
//             star: base.star,
//             openTime: base.openTime ? dayjs(base.openTime) : undefined,
//             description: base.description, // 注意：这里回显的是拼接后的长文本
            
//             // 入住信息回显
//             checkinInfo: checkin
//                 ? {
//                     checkinTime: checkin.checkinTime,
//                     checkoutTime: checkin.checkoutTime,
//                     breakfastType: (checkin as any).breakfastType,
//                     breakfastPrice: (checkin as any).breakfastPrice
//                 }
//                 : undefined,


//             // 房型回显 (Backend -> UI Transformation)
//             rooms: data.rooms?.map((r: any) => ({
//                 name: r.baseInfo?.type || r.type,
//                 price: r.baseInfo?.price || r.price,
//                 stock: r.baseInfo?.stock || r.stock,
//                 size: r.headInfo?.size ? parseFloat(r.headInfo.size) : 0,
//                 // 将 boolean 转换为 UI 的 Tag 选中状态
//                 facilities: [
//                     r.headInfo?.wifi ? 'WiFi' : '',
//                     r.headInfo?.windowAvailable ? '有窗' : ''
//                 ].filter(Boolean),
//                 // 检查是否有早餐信息
//                 hasBreakfast: !!r.breakfastInfo?.hasBreakfast || !!r.breakfastInfo?.breakfastType
//             }))
//           })

//           // 图片回显
//           if (base.images?.length) {
//             setFileList(base.images.map((url: string, index: number) => ({
//                 uid: String(index), name: `image-${index}`, status: 'done', url
//             })))
//           }
//         } catch (err) {
//           notify('error', '加载失败', '无法获取酒店详情')
//         } finally {
//           setFetching(false)
//         }
//       }
//       loadData()
//     } else {
//         // 创建模式默认值
//         form.setFieldsValue({
//             star: 3,
//             checkinInfo: { checkinTime: '14:00', checkoutTime: '12:00' }, // 默认入住退房时间
//             rooms: [{ name: '标准大床房', price: 299, stock: 10, size: 25, hasBreakfast: false }]
//         })
//     }
//   }, [id, isEditMode, form])

//   // === 2. 提交逻辑 (Data Cleaning & Payload Construction) ===
//   const onFinish = async (values: FormValues) => {
//     setLoading(true)
//     try {
//       // 2.1 描述信息拼接 (UI结构化 -> Backend字符串)
//       let finalDesc = values.description || ''
      
//       // 拼接周边
//       if (values.nearbyList?.length) {
//         finalDesc += '\n\n【周边信息】'
//         values.nearbyList.forEach(i => {
//           if (i?.name) finalDesc += `\n• [${i.type || '其他'}] ${i.name} ${i.distance ? `(距${i.distance})` : ''}`
//         })
//       }
//       // 拼接优惠
//       if (values.discountRules?.length) {
//         finalDesc += '\n\n【优惠活动】'
//         values.discountRules.forEach(r => {
//           if (r?.title) finalDesc += `\n• ${r.title}: ${r.value || '详询前台'}`
//         })
//       }

//       // 2.2 构造 BaseInfo
//       const baseInfoPayload = {
//         nameCn: values.nameCn,
//         nameEn: values.nameEn || '',
//         address: values.address,
//         city: values.city || '未填写',
//         star: values.star ?? 3,
//         openTime: values.openTime ? dayjs(values.openTime).format('YYYY-MM-DD') : '',
//         description: finalDesc,
//         roomTotal: values.rooms?.length ?? 0,
//         phone: '待完善',
//         // 过滤掉上传失败或空的图片链接
//         images: fileList.map(f => f.url || (f.response && f.response.url)).filter(Boolean) as string[]
//       }

//       // 2.3 构造 Rooms (UI -> Backend Nested Structure)
//       const roomsPayload = values.rooms?.map(room => ({
//         baseInfo: {
//             type: room.name,
//             price: room.price,
//             stock: room.stock,
//             images: [], // 暂未支持房型图片
//             status: 'draft',
//             maxOccupancy: 2
//         },
//         headInfo: {
//             size: String(room.size || 0),
//             floor: '1-10', // 默认楼层
//             wifi: room.facilities?.includes('WiFi') || false,
//             windowAvailable: room.facilities?.includes('有窗') || false,
//             smokingAllowed: false
//         },
//         breakfastInfo: room.hasBreakfast ? { hasBreakfast: true, breakfastType: '自助' } : {},
//         bedInfo: [], // 必填数组兜底
//         auditInfo: { status: 'draft' }
//       })) || []

//       // 2.4 组装最终 Payload
//       const payload: Partial<Hotel> = {
//         baseInfo: baseInfoPayload,
//         // 修复 checkinInfo 类型
//         checkinInfo: values.checkinInfo?.checkinTime ? {
//             checkinTime: values.checkinInfo.checkinTime,
//             checkoutTime: values.checkinInfo.checkoutTime || '12:00',
//             breakfastType: values.checkinInfo.breakfastType,
//             breakfastPrice: values.checkinInfo.breakfastPrice
//         } : undefined,
//         auditInfo: { status: 'draft' as AuditStatus },
//         rooms: roomsPayload as any // 类型兼容处理
//       }

//       if (isEditMode) {
//         await hotelApi.update(id, payload)
//         message.success('更新成功')
//       } else {
//         await hotelApi.create(payload)
//         message.success('创建成功')
//       }
      
//       navigate('/merchant/hotels')

//     } catch (err: any) {
//       notify('error', '提交失败', err?.response?.data?.message || '网络错误')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const normFile = (e: any) => (Array.isArray(e) ? e : e?.fileList)

//   if (fetching) return <div style={{textAlign: 'center', padding: 80}}><Spin size="large" tip="正在加载数据..."/></div>

//   // 样式定义
//   const styles = {
//     container: { maxWidth: 1000, margin: '0 auto', paddingBottom: 80 },
//     header: { marginBottom: 24 },
//     card: { marginBottom: 24, borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.03)' },
//     roomItem: { marginBottom: 16, background: '#fafafa', border: '1px solid #f0f0f0' },
//     subItemRow: { marginBottom: 8 },
//     footer: { position: 'fixed' as const, bottom: 0, right: 0, width: '100%', padding: '12px 24px', background: '#fff', borderTop: '1px solid #e8e8e8', textAlign: 'right' as const, zIndex: 99 }
//   }

//   return (
//     <div style={styles.container}>
//       {/* 头部 */}
//       <div style={styles.header}>
//         <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
//           {isEditMode ? '编辑酒店信息' : '发布新酒店'}
//         </h2>
//         <p style={{ color: '#888' }}>请完善酒店详情、入住政策及房型数据，提交后将进入审核流程。</p>
//       </div>

//       <Form form={form} layout="vertical" onFinish={onFinish} scrollToFirstError>
        
//         {/* === 1. 基础信息 (Card + Icons) === */}
//         <Card title={<Space><HomeOutlined /><span>基础信息</span></Space>} variant="borderless" style={styles.card}>
//           <Row gutter={24}>
//             <Col span={12}>
//               <Form.Item label="酒店中文名称" name="nameCn" rules={[{ required: true, message: '必填' }]}>
//                 <Input placeholder="例如：易宿大酒店 (上海陆家嘴店)" size="large" />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item label="英文名称" name="nameEn">
//                 <Input placeholder="E.g. E-Stay Hotel Shanghai" size="large" />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={24}>
//             <Col span={12}>
//                <Form.Item label="所在城市" name="city" rules={[{ required: true, message: '必填' }]}>
//                  <Input placeholder="例如：上海" size="large" />
//                </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item label="详细地址" name="address" rules={[{ required: true, message: '必填' }]}>
//                 <Input prefix={<EnvironmentOutlined style={{color:'#bfbfbf'}}/>} placeholder="省/市/区/街道门牌号" size="large" />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={24}>
//             <Col span={8}>
//               <Form.Item label="酒店星级" name="star">
//                 <Rate allowHalf />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item label="开业时间" name="openTime">
//                 <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Form.Item label="酒店封面/相册" name="images" valuePropName="fileList" getValueFromEvent={normFile}>
//              <Upload listType='picture-card' onChange={({ fileList: newList }) => setFileList(newList)} accept='.jpg,.jpeg,.png' beforeUpload={() => false} fileList={fileList} maxCount={8}>
//               {fileList.length < 8 && <div><CloudUploadOutlined /><div style={{ marginTop: 8 }}>上传</div></div>}
//             </Upload>
//           </Form.Item>

//           <Form.Item label="酒店简介" name="description">
//             <TextArea rows={3} showCount maxLength={800} placeholder="请简要介绍酒店特色、历史或服务理念..." />
//           </Form.Item>
//         </Card>

//         {/* === 2. 入住政策 (New Feature) === */}
//         <Card title={<Space><ClockCircleOutlined /><span>入住政策</span></Space>} variant="borderless" style={styles.card}>
//            <Row gutter={24}>
//              <Col span={6}>
//                 <Form.Item label="最早入住时间" name={['checkinInfo', 'checkinTime']} rules={[{ required: true, message: '必填' }]}>
//                    <Input placeholder="如: 14:00" />
//                 </Form.Item>
//              </Col>
//              <Col span={6}>
//                 <Form.Item label="最晚退房时间" name={['checkinInfo', 'checkoutTime']} rules={[{ required: true, message: '必填' }]}>
//                    <Input placeholder="如: 12:00" />
//                 </Form.Item>
//              </Col>
//              <Col span={6}>
//                 <Form.Item label="早餐类型" name={['checkinInfo', 'breakfastType']}>
//                    <Input placeholder="如: 自助餐/定食" />
//                 </Form.Item>
//              </Col>
//              <Col span={6}>
//                 <Form.Item label="早餐价格" name={['checkinInfo', 'breakfastPrice']}>
//                    <InputNumber min={0} style={{ width: '100%' }} prefix="￥" placeholder="0" />
//                 </Form.Item>
//              </Col>
//            </Row>
//         </Card>

//         {/* === 3. 营销信息 (结构化录入) === */}
//         <Card title={<Space><CompassOutlined /><span>周边与优惠 (辅助生成简介)</span></Space>} variant="borderless" style={styles.card}>
//             <Row gutter={24}>
//                 {/* 左栏：周边 */}
//                 <Col span={12}>
//                     <div style={{ marginBottom: 16, fontWeight: 500 }}>周边交通/景点</div>
//                     <Form.List name="nearbyList">
//                         {(fields, { add, remove }) => (
//                             <>
//                                 {fields.map(({ key, name }) => (
//                                     <Row key={key} gutter={8} style={styles.subItemRow}>
//                                         <Col span={6}><Form.Item name={[name, 'type']} noStyle><Select placeholder="类型"><Option value="地铁">地铁</Option><Option value="景点">景点</Option><Option value="商圈">商圈</Option></Select></Form.Item></Col>
//                                         <Col span={10}><Form.Item name={[name, 'name']} noStyle><Input placeholder="名称" /></Form.Item></Col>
//                                         <Col span={6}><Form.Item name={[name, 'distance']} noStyle><Input placeholder="距离" /></Form.Item></Col>
//                                         <Col span={2}><MinusCircleOutlined onClick={() => remove(name)} style={{color:'#ff4d4f', cursor:'pointer'}} /></Col>
//                                     </Row>
//                                 ))}
//                                 <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>添加周边信息</Button>
//                             </>
//                         )}
//                     </Form.List>
//                 </Col>
//                 {/* 右栏：优惠 */}
//                 <Col span={12}>
//                     <div style={{ marginBottom: 16, fontWeight: 500 }}>优惠活动</div>
//                     <Form.List name="discountRules">
//                         {(fields, { add, remove }) => (
//                             <>
//                                 {fields.map(({ key, name }) => (
//                                     <Row key={key} gutter={8} style={styles.subItemRow}>
//                                         <Col span={8}><Form.Item name={[name, 'title']} noStyle><Input placeholder="活动标题" /></Form.Item></Col>
//                                         <Col span={6}><Form.Item name={[name, 'type']} noStyle><Select placeholder="方式"><Option value="折扣">折扣</Option><Option value="立减">立减</Option></Select></Form.Item></Col>
//                                         <Col span={8}><Form.Item name={[name, 'value']} noStyle><Input placeholder="内容 (如8折)" /></Form.Item></Col>
//                                         <Col span={2}><MinusCircleOutlined onClick={() => remove(name)} style={{color:'#ff4d4f', cursor:'pointer'}} /></Col>
//                                     </Row>
//                                 ))}
//                                 <Button type="dashed" onClick={() => add()} block icon={<GiftOutlined />}>添加优惠规则</Button>
//                             </>
//                         )}
//                     </Form.List>
//                 </Col>
//             </Row>
//         </Card>

//         {/* === 4. 房型管理 (High-end UX) === */}
//         <Card 
//           title={<Space><TagOutlined /><span>房型管理</span></Space>} 
//           variant="borderless"
//           style={styles.card}
//           extra={<span style={{fontSize: 12, color: '#999'}}>* 至少录入一种房型，未使用的房型请删除</span>}
//         >
//           <Form.List name="rooms">
//             {(fields, { add, remove }) => (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//                 {fields.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无房型" />}
                
//                 {fields.map(({ key, name, ...restField }, index) => (
//                   <Card 
//                     key={key} type="inner" size="small" style={styles.roomItem}
//                     title={`房型 #${index + 1}`}
//                     extra={fields.length > 1 ? <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)}>删除</Button> : null}
//                   >
//                     <Row gutter={16}>
//                       <Col span={8}>
//                         <Form.Item {...restField} name={[name, 'name']} label="房型名称" rules={[{ required: true, message: '必填' }]}>
//                           <Input placeholder="如：豪华江景房" />
//                         </Form.Item>
//                       </Col>
//                       <Col span={8}>
//                         <Form.Item {...restField} name={[name, 'price']} label="单价 (元/晚)" rules={[{ required: true, message: '必填' }]}>
//                           <InputNumber min={0} style={{ width: '100%' }} prefix="￥" />
//                         </Form.Item>
//                       </Col>
//                       <Col span={8}>
//                         <Form.Item {...restField} name={[name, 'stock']} label="每日库存" rules={[{ required: true, message: '必填' }]}>
//                           <InputNumber min={0} max={999} style={{ width: '100%' }} />
//                         </Form.Item>
//                       </Col>
//                     </Row>

//                     <Row gutter={16}>
//                       <Col span={6}>
//                         <Form.Item {...restField} name={[name, 'size']} label="面积 (m²)">
//                           <InputNumber min={0} style={{width:'100%'}} />
//                         </Form.Item>
//                       </Col>
//                       <Col span={12}>
//                         <Form.Item {...restField} name={[name, 'facilities']} label="基础配套">
//                           <Select mode="tags" placeholder="输入后回车 (如: WiFi, 浴缸)">
//                             <Option value="WiFi">WiFi</Option>
//                             <Option value="有窗">有窗</Option>
//                             <Option value="24h热水">24h热水</Option>
//                             <Option value="浴缸">浴缸</Option>
//                           </Select>
//                         </Form.Item>
//                       </Col>
//                       <Col span={6}>
//                         <Form.Item {...restField} name={[name, 'hasBreakfast']} label="包含早餐" valuePropName="checked">
//                           <Switch checkedChildren="含早" unCheckedChildren="无早" />
//                         </Form.Item>
//                       </Col>
//                     </Row>
//                   </Card>
//                 ))}
                
//                 <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ marginTop: 8, height: 40 }}>
//                   添加新房型
//                 </Button>
//               </div>
//             )}
//           </Form.List>
//         </Card>

//         {/* 占位，防遮挡 */}
//         <div style={{ height: 60 }} />

//         {/* === 悬浮底部 === */}
//         <div style={styles.footer}>
//           <Space size="middle">
//              <Button size="large" onClick={() => navigate('/merchant/hotels')}>取消返回</Button>
//              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large" loading={loading}>
//                 {isEditMode ? '保存修改' : '立即发布'}
//              </Button>
//           </Space>
//         </div>
//       </Form>
//     </div>
//   )
// }

// export default HotelForm