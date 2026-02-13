// src/config/hotelOptions.ts

export const HOTEL_FACILITIES = [
  {
    category: '基础设施',
    options: ['免费WiFi', '免费停车场', '电梯', '餐厅', '行李寄存', '24小时前台']
  },
  {
    category: '客房设施',
    options: ['空调', '24小时热水', '吹风机', '拖鞋', '洗漱用品']
  },
  {
    category: '休闲娱乐',
    options: ['健身房', '游泳池', '棋牌室', '茶室']
  }
];

export const HOTEL_POLICIES = [
  { label: '入住时间', value: 'check_in_out', type: 'time' },
  { label: '宠物政策', value: 'pet_policy', type: 'select', options: ['不可携带宠物', '允许携带宠物'] },
  { label: '取消政策', value: 'cancel_policy', type: 'text', placeholder: '如：入住前24小时可免费取消' }
];