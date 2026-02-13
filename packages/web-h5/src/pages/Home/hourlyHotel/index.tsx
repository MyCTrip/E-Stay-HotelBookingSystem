import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.css'

/**
 * 钟点房首页
 */
export default function HomeHourlyHotelPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    city: 'Beijing',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date().toISOString().split('T')[0],
    checkInTime: '14:00',
    checkOutTime: '18:00',
    guests: 2,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) : value,
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
    navigate(`/search/hourlyHotel?${params.toString()}`)
  }

  return (
    <div className={styles.container}>
      {/* 首页横幅 */}
      <section className={styles.banner}>
        <div className={styles.bannerContent}>
          <h1>发现您的钟点房</h1>
          <p>在全国多家钟点房中搜索</p>
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
            <label htmlFor="checkIn">日期</label>
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
            <label htmlFor="checkInTime">入住时间</label>
            <input
              id="checkInTime"
              type="time"
              name="checkInTime"
              value={formData.checkInTime}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="checkOutTime">退房时间</label>
            <input
              id="checkOutTime"
              type="time"
              name="checkOutTime"
              value={formData.checkOutTime}
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

          <button type="submit" className={styles.searchButton}>
            搜索
          </button>
        </form>
      </section>

      {/* 特色推荐 */}
      <section className={styles.features}>
        <h2>为什么选择我们的钟点房？</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.icon}>💰</div>
            <h3>灵活定价</h3>
            <p>按小时计费，经济实惠</p>
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