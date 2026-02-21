export default defineAppConfig({
  pages: [
    'pages/Home/hotel/index',
    'pages/Home/hourlyHotel/index',
    'pages/Home/homeStay/index',
    'pages/SearchResult/index',
    'pages/SearchResult/hotel/index',
    'pages/SearchResult/hourlyHotel/index',
    'pages/SearchResult/homeStay/index',
    'pages/HotelDetail/index',
    'pages/HotelDetail/hotel/index',
    'pages/HotelDetail/hourlyHotel/index',
    'pages/HotelDetail/homeStay/index',
    'pages/RoomDetail/index',
    'pages/RoomDetail/hotel/index',
    'pages/RoomDetail/hourlyHotel/index',
    'pages/RoomDetail/homeStay/index',
    'pages/NotFound/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'E-Stay 酒店预订',
    navigationBarTextStyle: 'black'
  },
  // --- 对应微信文档中的 permission 字段 ---
  permission: {
    'scope.userLocation': {
      desc: '您的位置信息将用于推荐您所在城市的酒店' // 这一句就是对应文档里的 desc
    }
  },
  // --- 对应微信文档中的 requiredPrivateInfos 字段 ---
  requiredPrivateInfos: [
    'getLocation'
  ]
})