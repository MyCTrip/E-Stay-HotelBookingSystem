import React from 'react';
import styles from './index.module.scss';

interface PolicySectionProps {
  data?: any; // 后续你可以替换为真实的类型定义
}

const PolicySection: React.FC<PolicySectionProps> = ({ data }) => {
  return (
    <div className={styles.policyWrapper}>
      <h3 className={styles.sectionTitle}>订房必读</h3>

      {/* 城市通知 */}
      <div className={styles.policyItem}>
        <div className={styles.itemHeader}>
          <span className={styles.icon}>🏢</span> <h4>城市通知</h4>
        </div>
        <p className={styles.noticeText}>
          为贯彻落实《上海市生活垃圾管理条例》相关规定，推进生活垃圾源头减量，上海市文化和旅游局特制定《关于本市旅游住宿业不主动提供客房一次性日用品的实施意见》，2019年7月1日起，上海市旅游住宿业将不再主动提供牙刷、梳子、浴擦、剃须刀、指甲锉、鞋擦这些一次性日用品。若需要可咨询酒店。
        </p>
      </div>

      <div className={styles.divider}></div>

      <h3 className={styles.subTitle}>酒店政策</h3>

      <div className={styles.policyList}>

        {/* 入离时间 */}
        <div className={styles.listItem}>
          <span className={styles.icon}>🕒</span>
          <div className={styles.content}>
            <h4>入离时间</h4>
            <div className={styles.times}>
              <span>入住时间: 14:00后</span>
              <span>退房时间: 12:00前</span>
            </div>
          </div>
        </div>

        {/* 入住方式 */}
        <div className={styles.listItem}>
          <span className={styles.icon}>📋</span>
          <div className={styles.content}>
            <h4>入住方式</h4>
            <p>在预订后，我们会提前向您发送入住说明</p>
          </div>
        </div>

        {/* 可接待人群 */}
        <div className={styles.listItem}>
          <span className={styles.icon}>👥</span>
          <div className={styles.content}>
            <h4>可接待人群</h4>
            <p>接待来自任何国家/地区的客人</p>
          </div>
        </div>

        {/* 儿童入住及加床政策 */}
        <div className={styles.listItem}>
          <span className={styles.icon}>🧒</span>
          <div className={styles.content}>
            <h4>儿童入住及加床政策</h4>
            <p>欢迎携带儿童入住</p>
            <p>所有房型不可加床；不同房型婴儿床政策不同，请以预订房型内政策为准</p>

            {/* 政策表格 */}
            <table className={styles.policyTable}>
              <thead>
                <tr>
                  <th>年龄</th>
                  <th>床铺</th>
                  <th>费用</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>5岁及以下</td>
                  <td>使用现有床铺</td>
                  <td className={styles.highlight}>免费</td>
                </tr>
                <tr>
                  <td>6-17岁</td>
                  <td>使用现有床铺</td>
                  <td>同成人</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 早餐 */}
        <div className={styles.listItem}>
          <span className={styles.icon}>🍽️</span>
          <div className={styles.content}>
            <h4>早餐</h4>
            <div className={styles.detailsList}>
              <p>类型：自助餐</p>
              <p>菜品：西式、中式、素食</p>
              <p>营业时间：周一至周日06:30-10:00开放</p>
              <p>成人加早：¥39/人</p>
            </div>

            <table className={styles.policyTable}>
              <thead>
                <tr>
                  <th>儿童身高</th>
                  <th>费用</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1.2米以下</td>
                  <td className={styles.highlight}>免费</td>
                </tr>
                <tr>
                  <td>1.2-1.8米以下</td>
                  <td>¥30/人</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 年龄限制 */}
        <div className={styles.listItem}>
          <span className={styles.icon}>👤</span>
          <div className={styles.content}>
            <h4>年龄限制</h4>
            <p>入住办理人需年满18岁</p>
          </div>
        </div>

        {/* 前台服务 */}
        <div className={styles.listItem}>
          <span className={styles.icon}>🛎️</span>
          <div className={styles.content}>
            <h4>前台服务</h4>
            <p>前台营业时间：24小时营业</p>
          </div>
        </div>

        {/* 宠物 */}
        <div className={styles.listItem}>
          <span className={styles.icon}>🐾</span>
          <div className={styles.content}>
            <h4>宠物</h4>
            <p>不可携带宠物</p>
          </div>
        </div>

        {/* 服务型动物 */}
        <div className={styles.listItem}>
          <span className={styles.icon}>🦮</span>
          <div className={styles.content}>
            <h4>服务型动物</h4>
            <p>不可携带服务型动物</p>
          </div>
        </div>

        {/* 预订提示 */}
        <div className={styles.listItem}>
          <span className={styles.icon}>📝</span>
          <div className={styles.content}>
            <h4>预订提示</h4>
            <p>订单需等酒店或供应商确认后生效，订单确认结果以平台短信、邮件或app通知为准。</p>
          </div>
        </div>

        {/* 押金 */}
        <div className={styles.listItem}>
          <span className={styles.icon}>💰</span>
          <div className={styles.content}>
            <h4>押金</h4>
            <p>住宿方不收取押金</p>
          </div>
        </div>

        {/* 住宿可用支付方式 */}
        <div className={styles.listItem}>
          <span className={styles.icon}>💳</span>
          <div className={styles.content}>
            <h4>住宿可用支付方式</h4>
            <div className={styles.paymentMethods}>
              {/* 这里由于没有真实图片，暂时用带颜色的方块模拟支付图标，你可以换成真实的 img */}
              <div className={styles.payIcon} style={{ background: '#00aae7' }}>支付宝</div>
              <div className={styles.payIcon} style={{ background: '#eb001b' }}>Master</div>
              <div className={styles.payIcon} style={{ background: '#1a1f71' }}>VISA</div>
              <div className={styles.payIcon} style={{ background: '#0070ba' }}>银联</div>
              <div className={styles.payIcon} style={{ background: '#09b83e' }}>微信支付</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PolicySection;