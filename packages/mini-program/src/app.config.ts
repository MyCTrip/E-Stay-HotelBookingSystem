export default defineAppConfig({
  pages: [
    'pages/Home/index',
    'pages/SearchResult/index',
    'pages/HotelDetail/index',
    'pages/RoomDetail/index',
    'pages/NotFound/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'E-Stay 酒店预订',
    navigationBarTextStyle: 'black'
  },
})
