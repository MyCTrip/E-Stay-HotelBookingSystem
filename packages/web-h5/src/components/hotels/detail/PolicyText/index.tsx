import React from 'react';
import styles from './index.module.scss';

interface PolicyTextProps {
  data?: any; // 接收当前酒店的详情数据
}

const PolicyText: React.FC<PolicyTextProps> = ({ data }) => {
  // 提取实时入离时间，若无则显示默认值
  const checkinTime = data?.checkinInfo?.checkinTime || '14:00';
  const checkoutTime = data?.checkinInfo?.checkoutTime || '12:00';

  return (
    <div className={styles.policyWrapper}>
      <h3 className={styles.sectionTitle}>订房必读</h3>

      {/* 城市通知 - 经典的灰底通知块 */}
      <div className={styles.policyItem}>
        <div className={styles.itemHeader}>
          <span className={styles.icon}>🏢</span> <h4>城市通知</h4>
        </div>
        <p className={styles.noticeText}>
          为贯彻落实相关规定，推进生活垃圾源头减量，旅游住宿业将不再主动提供牙刷、梳子、浴擦、剃须刀、指甲锉、鞋擦这些一次性日用品。若需要可咨询酒店。
        </p>
      </div>

      <div className={styles.divider}></div>
      <h3 className={styles.subTitle}>酒店政策</h3>

      <div className={styles.policyList}>
        {/* 入离时间 - 动态数据 */}
        <div className={styles.listItem}>
          <span className={styles.icon}>🕒</span>
          <div className={styles.content}>
            <h4>入离时间</h4>
            <div className={styles.times}>
              <span>入住时间: {checkinTime}后</span>
              <span>退房时间: {checkoutTime}前</span>
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

        {/* 儿童政策 - 漂亮表格复刻 */}
        <div className={styles.listItem}>
          <span className={styles.icon}>🧒</span>
          <div className={styles.content}>
            <h4>儿童入住及加床政策</h4>
            <p>欢迎携带儿童入住；不同房型政策不同，请以预订房型内政策为准。</p>
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
              </tbody>
            </table>
          </div>
        </div>

        {/* 宠物政策 */}
        <div className={styles.listItem}>
          <span className={styles.icon}>🐾</span>
          <div className={styles.content}>
            <h4>宠物政策</h4>
            <p>请咨询酒店是否允许携带宠物入住。</p>
          </div>
        </div>

        {/* 支付方式 */}
        <div className={styles.listItem}>
          <span className={styles.icon}>💳</span>
          <div className={styles.content}>
            <h4>支付方式</h4>
            <div className={styles.paymentMethods}>
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

export default PolicyText;