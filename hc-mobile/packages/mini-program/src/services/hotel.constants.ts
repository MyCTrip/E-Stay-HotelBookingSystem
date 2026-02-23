import type {
  BannerItem,
  CityOption,
  FeatureItem,
  GridMenuItem,
  InspirationItem,
  PriceOption,
  PromoInfo,
  StarOption,
  HotelSuggestionItem,
} from '../business/hotel/types'

export const QUICK_TAG_OPTIONS: string[] = ['亲子酒店', '免费停车', '高档奢华', '连住优惠']

export const BANNER_LIST: BannerItem[] = [
  { id: 1, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', link: '/pages/HotelDetail/index?id=1', title: '海滨度假首选' },
  { id: 2, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', link: '/pages/HotelDetail/index?id=2', title: '奢华体验' },
  { id: 3, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', link: '/pages/HotelDetail/index?id=3', title: '家庭亲子游' },
]

export const DOMESTIC_CITIES: CityOption[] = [
  { key: 'Beijing', label: '北京' },
  { key: 'Shanghai', label: '上海' },
  { key: 'Chengdu', label: '成都' },
  { key: 'Sanya', label: '三亚' },
]

export const INTERNATIONAL_CITIES: CityOption[] = [
  { key: 'Tokyo', label: '东京' },
  { key: 'Bangkok', label: '曼谷' },
  { key: 'Singapore', label: '新加坡' },
  { key: 'Seoul', label: '首尔' },
]

export const STAR_OPTIONS: StarOption[] = [
  { value: '2', label: '二星/经济', icon: '' },
  { value: '3', label: '三星/舒适', icon: '💎' },
  { value: '4', label: '四星/高档', icon: '💎💎' },
  { value: '5', label: '五星/豪华', icon: '👑' },
]

export const PRICE_OPTIONS: PriceOption[] = [
  { label: '¥150以下', min: '0', max: '150' },
  { label: '¥150-300', min: '150', max: '300' },
  { label: '¥300-600', min: '300', max: '600' },
  { label: '¥600-1000', min: '600', max: '1000' },
  { label: '¥1000以上', min: '1000', max: '' },
]

export const GRID_MENU_ITEMS: GridMenuItem[] = [
  { icon: '📄', title: '我的订单', url: '' },
  { icon: '❤️', title: '我的收藏', url: '' },
  { icon: '👑', title: '会员中心', url: '' },
  { icon: '🗨️', title: '联系客服', url: '' },
  { icon: '🧧', title: '领券中心', url: '' },
]

export const PROMO_INFO: PromoInfo = {
  tag: '特惠专区',
  title: '高星酒店 5折起',
  buttonText: '立即抢购',
}

export const FEATURE_ITEMS: FeatureItem[] = [
  { icon: '💰', title: '灵活定价', desc: '找不到更好的价格' },
  { icon: '🛡️', title: '安全预订', desc: '所有交易均受保护' },
  { icon: '🤝', title: '24/7 支持', desc: '随时随地获得帮助' },
  { icon: '⭐', title: '真实评价', desc: '真实客人的真实评价' },
]

export const HOT_SEARCH_TAGS: string[] = ['北京环球影城', '上海外滩', '三亚亚特兰蒂斯', '广州塔', '长沙五一广场', '西湖']

export const INSPIRATION_ITEMS: InspirationItem[] = [
  { title: '亲子·童话世界', tag: '乐园', img: 'https://img.yzcdn.cn/vant/cat.jpeg' },
  { title: '浪漫·海岛假日', tag: '海景', img: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400' },
  { title: '商务·城市中心', tag: 'CBD', img: 'https://img.yzcdn.cn/vant/apple-2.jpg' },
  { title: '隐居·山水之间', tag: '民宿', img: 'https://img.yzcdn.cn/vant/sand.jpg' },
]

export const DEFAULT_HISTORY_TAGS: string[] = ['上海迪士尼', '外滩', '全季酒店']

export const MOCK_HOTEL_DB: HotelSuggestionItem[] = [
  { id: 1, name: '汉庭酒店(北京王府井店)', city: '北京', area: '东城区', address: '灯市口大街', score: 4.8, price: 350, distance: 0.5, tags: ['近地铁', '市中心'] },
  { id: 2, name: '汉庭酒店(北京国贸店)', city: '北京', area: '朝阳区', address: '建国路', score: 4.6, price: 320, distance: 3.2, tags: ['商务'] },
  { id: 3, name: '汉庭酒店(北京西站南广场店)', city: '北京', area: '丰台区', address: '马连道', score: 4.5, price: 280, distance: 8.5, tags: ['火车站'] },
  { id: 4, name: '汉庭酒店(三亚湾店)', city: '三亚', area: '天涯区', address: '海坡度假区', score: 4.7, price: 220, distance: 2500, tags: ['海边'] },
  { id: 5, name: '全季酒店(上海外滩店)', city: '上海', area: '黄浦区', address: '广东路', score: 4.9, price: 450, distance: 1200, tags: ['外滩景观'] },
  { id: 6, name: '如家商旅(北京天安门店)', city: '北京', area: '西城区', address: '前门大街', score: 4.7, price: 380, distance: 1.2, tags: [] },
  { id: 7, name: '北京环球影城大酒店', city: '北京', area: '通州区', address: '环球大道', score: 5, price: 1200, distance: 25, tags: ['乐园'] },
  { id: 8, name: '汉庭酒店(上海虹桥枢纽店)', city: '上海', area: '闵行区', address: '沪青平公路', score: 4.6, price: 260, distance: 1300, tags: ['机场接送'] },
]

