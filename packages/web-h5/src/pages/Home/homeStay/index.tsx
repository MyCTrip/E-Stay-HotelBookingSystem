import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.css'

/**
 * 民宿首页
 */
export default function HomeHomeStayPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    city: 'Beijing',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    guests: 2,
    rooms: 1,
    beds: 1,
    baths: 1,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: ['guests', 'rooms', 'beds', 'baths'].includes(name) ? parseInt(value) : value,
    }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(
      Object.entries(formData).reduce((acc, [key, value]) => {
        acc[key] = String(value)
        return acc
      }, {} as Record<string, string>)
    )
    navigate(`/search/homeStay?${params.toString()}`)
  }

  return (
    <div className={styles.container}>
      {/* 首页横幅 */}
      <section className={styles.banner}>
        <div className={styles.bannerContent}>
          <h1>发现您的民宿</h1>
          <p>在全国多家民宿中搜索</p>
        </div>
      </section>

      {/* 搜索表单 */}
      <section className={styles.searchSection}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.formGroup}>
            <label htmlFor="city">目的地</label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="Beijing">北京</option>
              <option value="Shanghai">上海</option>
              <option value="Guangzhou">广州</option>
              <option value="Shenzhen">深圳</option>
              <option value="Chengdu">成都</option>
              <option value="Xian">西安</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="checkIn">入住日期</label>
            <input
              id="checkIn"
              type="date"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="checkOut">退房日期</label>
            <input
              id="checkOut"
              type="date"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="guests">房客数</label>
            <input
              id="guests"
              type="number"
              name="guests"
              min="1"
              max="9"
              value={formData.guests}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="rooms">房间数</label>
            <input
              id="rooms"
              type="number"
              name="rooms"
              min="1"
              max="5"
              value={formData.rooms}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="beds">床位数</label>
            <input
              id="beds"
              type="number"
              name="beds"
              min="1"
              max="5"
              value={formData.beds}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="baths">浴室数</label>
            <input
              id="baths"
              type="number"
              name="baths"
              min="1"
              max="5"
              value={formData.baths}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <button type="submit" className={styles.searchButton}>
            搜索
          </button>
        </form>
      </section>

      {/* 特色推荐 */}
      <section className={styles.features}>
        <h2>为什么选择我们的民宿？</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.icon}>💰</div>
            <h3>最佳价格保证</h3>
            <p>找不到更好的价格</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.icon}>🛡️</div>
            <h3>安全预订</h3>
            <p>所有交易均受保护</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.icon}>🤝</div>
            <h3>24/7 支持</h3>
            <p>随时随地获得帮助</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.icon}>⭐</div>
            <h3>真实评价</h3>
            <p>真实客人的真实评价</p>
          </div>
        </div>
      </section>
    </div>
  )
}