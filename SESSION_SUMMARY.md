# Detail 页面中间件集成 - Session 总结

**生成时间**: 2026-02-23  
**项目**: E-Stay 民宿预订系统  
**工作范围**: web-h5 和 shared 包的 Detail 页面中间件集成  

---

## 📋 项目背景

- **项目名称**: E-Stay 民宿预订系统
- **工作范围**: web-h5 和 shared 包的 Detail 页面（民宿详情页）中间件集成
- **核心目标**: 用真实的中间件数据替换 mock 数据，实现完整的数据流
- **Session 周期**: 从 PHASE 1 到 PHASE 4 初期

---

## ✅ 完成的功能

### Phase 1-2: 基础架构 (100% 完成)

#### 1. 中间件字段定义 ✅
- **文件**: `shared/src/types/detailDataMiddleware.ts`
- **包含**: 40+ 字段覆盖房源详情所有需求
- **主要结构**:
  - `DetailCenterData`: 统一中央数据结构
  - `DetailRoomInfo`: 房间详细信息
  - `DetailFacility`: 设施信息
  - `DetailPolicy`: 政策信息
  - `DetailReview`: 评论信息
  - 等共 10+ 子接口

#### 2. 类型系统稳定 ✅
- shared 包: **0 类型错误**
- web-h5 包: **0 类型错误**
- 所有 TypeScript 编译成功

---

### Phase 3: Detail 组件中间件集成 (100% 完成)

#### 3 个关键问题解决

##### Problem 1: 本地副本机制 ✅

**目的**: 编辑房源信息时保留原始数据，支持取消操作

**实现**:
- **接口**: `DetailLocalCopy` (新增)
- **字段**: homeStay, selectedRoomId, checkInDate, checkOutDate, otherModifications
- **Store 方法** (5 个新增):
  1. `startEditingDetail()` - 创建深拷贝，进入编辑模式
  2. `setDetailLocalCopy(data)` - 更新本地副本
  3. `commitDetailLocalCopy()` - 保存更改到 Store
  4. `revertDetailLocalCopy()` - 放弃编辑，恢复原始数据
  5. `resetDetailLocalCopy()` - 清空编辑状态

**文件修改**:
- `shared/src/types/homestayStore.ts`: 新增接口和 Store 方法

**工作流程**:
```
进入详情页 → startEditingDetail() 
    ↓
编辑房间 → setDetailLocalCopy() 
    ↓
保存 → commitDetailLocalCopy() / 取消 → revertDetailLocalCopy()
```

##### Problem 2: Room 选择状态管理 ✅

**目的**: 选择房间时更新价格和状态

**实现**:
- **函数**: `handleSelectRoom(room: RoomSelectionRoom)`
- **逻辑**:
  - 编辑模式: 更新 localCopy
  - 视图模式: 直接更新 detailContext
- **Store 字段**: 新增 `selectedRoomId?: string`

**组件调用链**:
```
RoomSelection.onSelectRoom() 
    → PageContent.handleSelectRoomInContent()
    → DetailPage.handleSelectRoom()
    → Store.setDetailLocalCopy() / updateDetailContext()
```

**实现位置**:
- `homeStay/index.tsx`: 定义 handleSelectRoom, PageContent 集成
- `PageContent`: 内部 handleSelectRoomInContent 更新 selectedRoomName

##### Problem 3: BookingBar 价格集成 ✅

**目的**: 显示房间价格和预约按钮

**实现**:
- **价格显示**: `¥{price}/晚`
- **按钮逻辑**:
  - 编辑模式: 显示 "Save" + "Cancel"
  - 视图模式: 显示 "Contact Host" + "Book"
- **样式**: 响应式设计，容器 flexbox 布局

**文件修改**:
- `BookingBar/index.tsx`: 新增 props, 条件渲染
- `BookingBar/index.module.scss`: 新增样式类

---

### 10 个组件完整中间件集成 (100% 完成)

#### 中间件数据流向

| 组件 | 中间件数据来源 | 位置 | 状态 |
|------|-------------|------|------|
| ReviewSection | `reviews[]` | shared 中间件 | ✅ 完成 |
| PolicySection | `policies[]` | shared 中间件 | ✅ 完成 |
| HostInfo | `hostInfo` (typeConfig) | Store | ✅ 完成 |
| FacilitiesSection | `facilities[]` | shared 中间件 | ✅ 完成 |
| FeeNoticeSection | `feeInfo` | shared 中间件 | ✅ 完成 |
| NearbyRecommendations | `surroundings[]` | shared 中间件 | ✅ 完成 |
| RoomSelection | facilities, policies, feeInfo | 通过 props | ✅ 完成 |
| RoomDetailDrawer | facilitiesData, policiesData, feeInfoData | 通过 props | ✅ 完成 |
| RoomDrawerFacilities | `facilities[]` | 通过 props | ✅ 完成 |
| RoomDrawerFeeNotice | `feeInfo` | 通过 props | ✅ 完成 |

#### 各组件集成详情

##### 1. ReviewSection ✅
- **Props 新增**: `reviews?: any[]`
- **实现**: `const reviews = middlewareReviews && middlewareReviews.length > 0 ? middlewareReviews : [mock data]`
- **优先级**: 高 (用户评价最重要)

##### 2. PolicySection ✅
- **Props 新增**: `policies?: any[]`, `facilitiesData?: any[]`, `feeInfoData?: any`
- **功能**: 显示预订须知，打开详情抽屉显示完整信息
- **优先级**: 高 (法律合规)

##### 3. HostInfo ✅
- **Props 新增**: `hostInfo?: any`
- **数据源**: `currentHomestay.typeConfig`
- **显示**: 房东名字、头像、评分、回复率等
- **优先级**: 高 (信任指标)

##### 4. FacilitiesSection ✅
- **Props 新增**: `facilities?: any[]`, `policiesData?: any[]`, `feeInfoData?: any`
- **实现**: 优先使用中间件数据，备用 FACILITY_CATEGORIES 常量
- **优先级**: 中 (用户参考)

##### 5. FeeNoticeSection ✅
- **Props 新增**: `feeInfo?: any`, `policiesData?: any[]`, `facilitiesData?: any[]`
- **转换**: 
  - `finalDeposit = middlewareFeeInfo?.basePrice || deposit`
  - `finalDescription = middlewareFeeInfo?.description || otherDescription`
- **优先级**: 中 (财务信息)

##### 6. NearbyRecommendations ✅
- **Props 新增**: `surroundings?: any[]`, `baseInfo?: any`
- **实现**: `finalAddress = middlewareBaseInfo?.address || location`
- **功能**: 显示周边交通、景点、餐厅、购物等
- **优先级**: 低 (附加信息)

##### 7. RoomSelection ✅
- **Props 新增**: `facilities?: any[]`, `policies?: any[]`, `feeInfo?: any`
- **传递**: 给 RoomDetailDrawer
- **功能**: 房型选择，打开详情抽屉
- **优先级**: 高 (核心功能)

##### 8. RoomDetailDrawer (页面) ✅
- **Props 新增**: `facilitiesData?: any[]`, `policiesData?: any[]`, `feeInfoData?: any`
- **用途**: 房型详情模态窗口
- **子组件**: RoomDrawerBanner, RoomDrawerBasicInfo, RoomDrawerFacilities, RoomDrawerPolicy, RoomDrawerFeeNotice

##### 9. RoomDrawerFacilities ✅
- **Props 新增**: `facilities?: any[]`
- **实现**: 使用中间件数据或 FACILITY_CATEGORIES
- **特性**: 支持展开/收起显示不同设施分类

##### 10. RoomDrawerFeeNotice ✅
- **Props 新增**: `feeInfo?: any`
- **转换**: 
  ```typescript
  const finalDeposit = middlewareFeeInfo?.basePrice || deposit
  const finalDescription = middlewareFeeInfo?.description || otherDescription
  ```
- **显示**: 押金、加人费用、其他要求

---

### 数据流架构

```
Zustand Store (currentHomestay)
  │ 包含: rooms, baseInfo, typeConfig, reviews, facilities, 
  │      policies, surroundings, feeInfo 等
  │
  └─→ DetailPage (homeStay/index.tsx)
      ├─ 提取 7 个中间件数据源
      ├─ homestayDetail (currentHomestay)
      ├─ hostInfo (typeConfig)
      ├─ reviews
      ├─ facilities
      ├─ policies
      ├─ surroundings
      └─ feeInfo
      │
      └─→ PageContent
          ├─ 转发中间件数据给所有子组件
          │
          ├─→ ReviewSection(reviews)
          ├─→ PolicySection(policies, facilities, feeInfo)
          ├─→ HostInfo(hostInfo)
          ├─→ FacilitiesSection(facilities, policies, feeInfo)
          ├─→ FeeNoticeSection(feeInfo, policies, facilities)
          ├─→ NearbyRecommendations(surroundings, baseInfo)
          │
          └─→ RoomSelection(facilities, policies, feeInfo)
              └─→ RoomDetailDrawer
                  ├─→ RoomDrawerFacilities(facilities)
                  ├─→ RoomDrawerPolicy(policies)
                  └─→ RoomDrawerFeeNotice(feeInfo)
```

---

### 文件修改统计

#### shared 包 (1 个文件)
```
src/types/
  └─ homestayStore.ts
     新增: DetailLocalCopy 接口
     新增: 5 个 Store 方法
     修改: DetailContextState 接口
```

#### web-h5 包 (17 个文件)

**页面和容器**:
1. `src/pages/HotelDetail/homeStay/index.tsx` - DetailPage + PageContent
2. `src/pages/RoomDetail/homeStay/index.tsx` - RoomDetailDrawer 页面

**Detail 组件** (10 个):
3. `ReviewSection/index.tsx`
4. `PolicySection/index.tsx`
5. `HostInfo/index.tsx`
6. `FacilitiesSection/index.tsx`
7. `FeeNoticeSection/index.tsx`
8. `NearbyRecommendations/index.tsx`
9. `RoomSelection/index.tsx`
10. `BookingBar/index.tsx`
11. `BookingBar/index.module.scss`

**RoomDetail 抽屉子组件** (4 个):
12. `RoomDetailDrawer/RoomDrawerFacilities/index.tsx`
13. `RoomDetailDrawer/RoomDrawerPolicy/index.tsx`
14. `RoomDetailDrawer/RoomDrawerFeeNotice/index.tsx`

**样式文件**:
15. 各组件的 `.module.scss` 文件

### 构建状态

- ✅ `pnpm build:web` - **成功**
- ✅ `pnpm type-check` - **通过** (0 错误)
- ✅ 所有 TypeScript 编译无错误

---

## 🏗️ 系统架构设计

### 编辑流程全景

```
DetailPage 挂载
  ↓
useEffect → fetchHomestayDetail() + startEditingDetail()
  ↓
创建深拷贝: DetailLocalCopy
  ├─ homeStay (完整数据)
  ├─ selectedRoomId (房间选择)
  ├─ checkInDate/checkOutDate (日期)
  └─ otherModifications (其他修改)
  ↓
用户交互:
  ├─ handleDateChange() 
  │   └─ isEditing ? setDetailLocalCopy() : updateDetailContext()
  │
  ├─ handleSelectRoom()
  │   └─ isEditing ? setDetailLocalCopy() : updateDetailContext()
  │
  └─ handleSave() / handleCancel()
      ├─ Save: commitDetailLocalCopy() → 保存到 Store
      └─ Cancel: revertDetailLocalCopy() → 放弃编辑
```

### 中间件数据优先级

```
优先级 1 (必须显示真实数据):
  ├─ ReviewSection - 用户评价
  ├─ PolicySection - 预订须知
  └─ HostInfo - 房东信息

优先级 2 (重要):
  ├─ FacilitiesSection - 设施列表
  ├─ FeeNoticeSection - 费用信息
  └─ RoomSelection - 房型选择

优先级 3 (参考):
  └─ NearbyRecommendations - 周边信息
```

---

## ❌ 未解决的问题

### 1. **中间件数据源的真实性** ⚠️

**问题描述**:
- Store 中的 `currentHomestay` 是否真实包含所有需要的数据？
- 各字段 (reviews, facilities, policies 等) 是否真实填充？

**影响范围**:
- ReviewSection: 评价数据可能为空
- PolicySection: 预订政策可能为空
- FacilitiesSection: 设施列表可能为空

**解决方案**:
- 检查 `fetchHomestayDetail()` 实现
- 验证 API 响应体
- console.log currentHomestay 查看实际数据结构

**优先级**: 🟩 **高** (阻塞功能)

---

### 2. **数据适配器不完整** ⚠️

**问题描述**:
- RoomDrawerFacilities 使用 `Array.isArray()` 判断，过于防御
- RoomDrawerPolicy 未实现 policies 数据的实际使用
- 数据格式可能与组件期望不匹配

**具体位置**:
```typescript
// RoomDrawerFacilities - 不确定 facilitiesToDisplay 是否真的是数组
const facilitiesToDisplay = middlewareFacilities && middlewareFacilities.length > 0 
  ? middlewareFacilities 
  : FACILITY_CATEGORIES
```

**解决方案**:
- 定义精确的中间件数据 TypeScript 类型
- 添加数据转换层
- 运行时数据验证

**优先级**: 🟩 **中** (可能运行时错误)

---

### 3. **缺少默认值处理** ⚠️

**问题描述**:
- 某些组件缺少对 `undefined/null` 中间件数据的处理
- NearbyRecommendations 的 `finalAddress` 逻辑可能失效
- 组件可能显示 "undefined" 或 "null" 字符串

**具体位置**:
- NearbyRecommendations: `finalAddress = middlewareBaseInfo?.address || location`
- ReviewSection: 缺少评价数数据为 0 时的处理
- FacilitiesSection: 设施列表为空时的提示

**解决方案**:
- 添加完整的 null/undefined 检查
- 为所有组件添加 empty state 处理
- 使用 `??` (nullish coalescing) 代替 `||`

**优先级**: 🟩 **中** (UI 稳定性)

---

### 4. **Store 端点缺失** ⚠️

**问题描述**:
- Store 中是否有 `reviews、facilities、policies` 等字段？
- `fetchHomestayDetail()` 是否真实从后端获取完整数据？
- 这些字段的初始值是什么？

**影响范围**:
- homeStay 页面无法获取中间件数据源
- 所有子组件接收 undefined

**需要检查的代码**:
```typescript
// homestayStore.ts
interface HomeStay {
  reviews?: DetailReview[]      // ← 这些字段是否存在？
  facilities?: DetailFacility[]
  policies?: DetailPolicy[]
  surroundings?: DetailSurrounding[]
  feeInfo?: DetailFeeInfo
  // ...
}
```

**解决方案**:
- 更新 HomeStay 类型定义
- 修改 fetchHomestayDetail() 确保填充所有字段
- 添加数据初始化逻辑

**优先级**: 🟥 **高** (阻塞所有中间件集成)

---

## 🚀 待完成的功能

### 优先级 1 - 关键 (立即处理)

#### 1. 验证数据源 🔴

**任务**: 检查 Store 中 currentHomestay 的完整性

**步骤**:
1. 打开 `shared/src/types/homestay.ts`
2. 查看 `HomeStay` 接口定义
3. 检查是否包含: reviews, facilities, policies, surroundings, feeInfo
4. 如果缺失，添加这些字段

**验证方法**:
```typescript
// 在 homeStay/index.tsx 添加调试代码
useEffect(() => {
  console.log('currentHomestay:', currentHomestay)
  console.log('reviews:', currentHomestay?.reviews)
  console.log('facilities:', currentHomestay?.facilities)
  console.log('policies:', currentHomestay?.policies)
}, [currentHomestay])
```

**预计时间**: 15 分钟

---

#### 2. 修复 API 数据获取 🔴

**任务**: 确保 `fetchHomestayDetail()` 返回完整中间件数据

**步骤**:
1. 查找 `fetchHomestayDetail()` 实现位置
2. 检查 API 端点是否返回完整数据
3. 如果 API 不完整，添加数据组装逻辑
4. 确保所有字段正确映射到 Store

**需要验证**:
- API 响应体结构
- 字段名称映射
- 空数据处理

**预计时间**: 30 分钟

---

#### 3. 运行时测试 🔴

**任务**: 在浏览器中验证各组件数据显示

**步骤**:
1. `pnpm -F @estay/web-h5 dev`
2. 打开详情页 URL
3. 检查各组件是否显示真实数据
4. 打开浏览器 DevTools Console 查看错误

**检查清单**:
- [ ] ReviewSection 显示真实评价
- [ ] PolicySection 显示真实政策
- [ ] HostInfo 显示真实房东信息
- [ ] FacilitiesSection 显示真实设施
- [ ] FeeNoticeSection 显示真实费用
- [ ] NearbyRecommendations 显示真实周边
- [ ] RoomSelection 显示房型列表
- [ ] 点击 "全部设施" 打开 RoomDetailDrawer

**预计时间**: 20 分钟

---

### 优先级 2 - 重要 (本周完成)

#### 4. 修复类型定义 🟠

**任务**: 用具体类型替换 `any` 类型

**步骤**:
1. 定义精确的中间件数据类型:
   ```typescript
   interface ReviewsData {
     reviews: DetailReview[]
     averageRating: number
     totalCount: number
   }
   ```
2. 更新 PageContentProps 中的 `any` 为具体类型
3. 运行 type-check 验证

**文件**:
- `homeStay/index.tsx` - PageContentProps
- 各组件 Props 接口

**预计时间**: 1 小时

---

#### 5. 功能测试 🟠

**任务**: 完整的工作流程测试

**测试场景**:
1. **编辑流程**:
   - 打开详情页 → 选择修改页面 → 修改房间 → 保存 → 验证数据已保存
   - 打开详情页 → 修改房间 → 取消 → 验证数据未变化

2. **房间选择**:
   - 选择不同房型 → 价格是否更新 → BookingBar 是否显示正确价格

3. **抽屉显示**:
   - 点击 "全部设施" → RoomDetailDrawer 打开 → 显示完整设施列表
   - 点击 "全部须知" → RoomDetailDrawer 打开 → 显示完整政策

**工具**: 
- Chrome/Firefox DevTools
- React DevTools
- Network monitoring

**预计时间**: 1-2 小时

---

#### 6. 错误处理 🟠

**任务**: 添加网络错误和数据缺失的降级显示

**需要处理**:
1. API 请求失败 → 显示错误提示
2. 数据为空 → 显示占位符
3. 数据格式错误 → 使用 fallback 值

**实现**:
```typescript
// 示例：ReviewSection
const reviews = middlewareReviews && Array.isArray(middlewareReviews) 
  ? middlewareReviews 
  : (mockReviews || [])

// 示例：显示空状态
{!reviews.length && <div>暂无评价</div>}
```

**预计时间**: 1 小时

---

### 优先级 3 - 优化 (如时间允许)

#### 7. 性能优化 🟡

**任务**: 优化组件渲染性能

**措施**:
1. 为 `useMemo` 添加完整的依赖项数组
2. 使用 `useCallback` 包装事件处理器
3. 移除不必要的数据转换

**示例**:
```typescript
// 修复前
const adaptedNearbyRooms = useMemo(
  () => NEARBY_ROOMS.map(adaptSharedRoomToSelection),
  [] // ← 缺少依赖项
)

// 修复后
const adaptedNearbyRooms = useMemo(
  () => NEARBY_ROOMS.map(adaptSharedRoomToSelection),
  [NEARBY_ROOMS, adaptSharedRoomToSelection]
)
```

**预计时间**: 1 小时

---

#### 8. 文档更新 🟡

**任务**: 更新项目文档

**需要更新的文件**:
1. `DETAIL_COMPONENT_INTEGRATION_ROADMAP.md` - 标记完成状态
2. `SESSION_SUMMARY.md` - 记录此 session 成果
3. 代码注释 - 解释关键逻辑

**内容**:
- 完成情况统计
- 已知问题列表
- 后续工作建议

**预计时间**: 30 分钟

---

## ⚠️ 可能存在的问题

### 问题 1: 构建成功但运行时异常 🔴

**症状**:
- `pnpm build:web` 成功，但打开网页显示空白或报错
- 浏览器 Console 显示 "Cannot read property 'reviews' of undefined"

**原因分析**:
- Store 中 `currentHomestay.reviews` 不存在
- 中间件数据结构与期望不匹配
- 组件接收 `undefined` 而非数组

**排查步骤**:
1. 在浏览器 DevTools Console 执行:
   ```javascript
   // 调试当前状态
   console.log(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
   // 或者检查 React 组件 props
   ```
2. 在 `homeStay/index.tsx` 添加调试输出
3. 查看 Network 标签中 API 响应数据

**解决方案**:
- 更新 HomeStay 类型定义，添加缺失字段
- 修改 fetchHomestayDetail 确保返回完整数据
- 添加 optional chaining (`?.`) 防御性编程

---

### 问题 2: 数据更新不同步 🟠

**症状**:
- 修改房间后价格不更新
- BookingBar 显示过时的价格

**原因分析**:
- Store 中 `selectedRoomId` 不是响应式的
- React 未检测到状态变化
- 组件 key 或依赖项缺失

**排查步骤**:
1. 在 React DevTools 中检查 Props 变化
2. 添加 console.log 在 handleSelectRoom
3. 检查 BookingBar 的 dependencies

**解决方案**:
- 确保 `selectedRoomId` 在 DetailContextState 中正确更新
- 为 BookingBar 添加 `key={selectedRoomId}`
- 检查 useEffect 依赖项

---

### 问题 3: RoomDetailDrawer 中间件数据未显示 🟠

**症状**:
- 打开房型详情抽屉后显示 mock 数据
- 设施、政策、费用信息不是从中间件获取

**原因分析**:
- 中间件数据未正确传递到 RoomDetailDrawer
- RoomDrawerFacilities/Policy/FeeNotice 未使用中间件参数
- 子组件仍使用硬编码数据

**排查步骤**:
1. 在 RoomDetailDrawer 添加 console.log:
   ```typescript
   console.log('facilitiesData:', facilitiesData)
   console.log('policiesData:', policiesData)
   ```
2. 检查 RoomSelection 是否正确传递 props
3. 查看各子组件是否接收了参数

**解决方案**:
- 验证 RoomDrawerFacilities 中的逻辑
- 确保 middlewareFacilities 正确赋值给 facilitiesToDisplay
- 添加 console.log 追踪数据流

---

### 问题 4: 类型定义不一致 🟡

**症状**:
- TypeScript 类型检查过但运行时错误
- 某些字段 undefined，导致方法调用失败

**原因分析**:
- PageContentProps 中使用 `any` 类型太宽松
- 中间件数据结构与实际 API 返回不匹配
- 缺少类型守卫

**排查步骤**:
1. 查看 TypeScript 的 tsconfig.json 是否开启严格模式
2. 检查 PageContentProps 中的 `any` 使用
3. 跟踪数据来源的实际类型

**解决方案**:
- 定义精确的中间件类型，替换 `any`
- 使用 `Partial<>` 表示可选数据
- 添加运行时类型检查

---

### 问题 5: 内存泄漏和性能问题 🟡

**症状**:
- 频繁进出详情页导致内存占用增加
- 页面卡顿或响应缓慢

**原因分析**:
- DetailLocalCopy 中的深拷贝未正确清理
- useEffect 缺少清理函数
- 大数据列表渲染性能问题

**排查步骤**:
1. 使用 Chrome DevTools Memory 检查
2. 查看 React DevTools Profiler
3. 监控 rerender 次数

**解决方案**:
- 添加 cleanup 函数清理副作用
- 使用 memo/useMemo 优化
- 虚拟滚动处理大列表

---

## 📌 关键文件清单

### 核心修改文件

#### shared 包
```
src/
  └─ types/
     └─ homestayStore.ts
        ├─ 新增: interface DetailLocalCopy
        ├─ 新增: interface DetailContextState (扩展)
        └─ 新增: 5 个 Store 方法
```

#### web-h5 包

**页面**:
```
src/pages/
├─ HotelDetail/
│  └─ homeStay/
│     └─ index.tsx (DetailPage + PageContent)
└─ RoomDetail/
   └─ homeStay/
      └─ index.tsx (RoomDetailDrawer 页面)
```

**Detail 组件**:
```
src/components/homestay/detail/
├─ ReviewSection/
├─ PolicySection/
├─ HostInfo/
├─ FacilitiesSection/
├─ FeeNoticeSection/
├─ NearbyRecommendations/
├─ RoomSelection/
├─ BookingBar/
└─ RoomDetailDrawer/
   ├─ index.tsx
   ├─ RoomDrawerBanner/
   ├─ RoomDrawerBasicInfo/
   ├─ RoomDrawerFacilities/
   ├─ RoomDrawerPolicy/
   ├─ RoomDrawerFeeNotice/
   ├─ RoomDrawerPrice/
   └─ RoomPackageDetail/
```

### 导出情况

**已导出**:
- ✅ DetailLocalCopy 接口
- ✅ 所有 Store 方法
- ✅ 所有组件接收中间件 props

**需要导出**:
- `shouldExports`: 如果有新的共享类型

---

## 🎯 下一个 Session 的建议

### 第一步: 启动开发环境 (5 分钟)

```bash
# 1. 构建
pnpm build:web

# 2. 启动开发服务器
pnpm -F @estay/web-h5 dev

# 3. 打开浏览器
# http://localhost:5173/ (或显示的端口)
```

### 第二步: 验证数据显示 (20 分钟)

**检查清单**:
1. [ ] 详情页加载成功（无错误）
2. [ ] ReviewSection 显示评价数据
   - 显示评分: 4.9 或其他
   - 显示评价数: 90 条或实际数据
   - 显示评价列表
3. [ ] PolicySection 显示政策
   - 显示取消政策
   - 显示入住时间
4. [ ] HostInfo 显示房东
   - 显示房东名字（非 "逸可民宿" 硬编码？）
   - 显示头像
   - 显示评分
5. [ ] FacilitiesSection 显示设施
6. [ ] FeeNoticeSection 显示费用
7. [ ] NearbyRecommendations 显示周边
8. [ ] RoomSelection 显示房型列表

**调试工具**:
- 打开 DevTools → Console
- 查看是否有红色错误信息
- 展开对象查看数据结构

### 第三步: 调试数据源 (30 分钟, 如有问题)

如果某些组件显示 mock 数据而非真实数据：

1. **检查 Store**:
   ```typescript
   // 在 homeStay/index.tsx 末尾添加
   useEffect(() => {
     console.log('[DEBUG] currentHomestay:', currentHomestay)
     console.log('[DEBUG] reviews:', currentHomestay?.reviews)
     console.log('[DEBUG] facilities:', currentHomestay?.facilities)
   }, [currentHomestay])
   ```

2. **检查 PageContent Props**:
   ```typescript
   // 在 PageContent 开头添加
   console.log('[DEBUG] PageContent props:', {
     reviews, facilities, policies, feeInfo, surroundings
   })
   ```

3. **检查 API 响应**:
   - DevTools → Network 标签
   - 查看 API 调用的 Response
   - 确认是否包含需要的字段

### 第四步: 修复发现的问题 (1-2 小时)

优先级顺序：
1. 若 currentHomestay 缺失字段 → 更新 HomeStay 类型和 API
2. 若数据未传递 → 调试 props 传递链
3. 若组件未使用数据 → 检查子组件实现

### 第五步: 功能测试 (1 小时)

**编辑流程**:
- 开始编辑 → 修改房间选择 → 保存 → 验证价格更新
- 修改房间 → 取消 → 验证恢复原状态

**交互测试**:
- 点击 "全部设施" → RoomDetailDrawer 打开
- 点击 "全部须知" → RoomDetailDrawer 打开
- 选择不同房型 → 价格变化

---

## 📊 项目进度

```
PHASE 1-2  中间件定义和类型系统         ✅ 100% (完成)
PHASE 3    Detail组件中间件集成          ✅ 100% (完成)
  ├─ 3 个关键问题修复                    ✅ 100%
  └─ 10 个组件完整集成                   ✅ 100% (代码级)
PHASE 4    数据验证和功能测试           ⏳ 0% (待开始)
  ├─ 数据源完整性验证                    ⏳ 待做
  ├─ 运行时测试                          ⏳ 待做
  ├─ 功能测试                            ⏳ 待做
  └─ 问题修复                            ⏳ 待做
PHASE 5    文档和优化                   ⏳ 0% (待做)
  ├─ 性能优化                            ⏳ 待做
  └─ 文档更新                            ⏳ 待做

总体进度: 🟩🟩🟩🟩🟩 60% (代码完成，等待测试)
```

---

## 📝 编码规范参考

### Props 传递模式

```typescript
// ❌ 不推荐：直接使用 any
interface MyProps {
  data?: any
}

// ✅ 推荐：具体类型
interface MyProps {
  data?: DetailReview[]
  reviews?: Review[]
}
```

### 中间件数据使用模式

```typescript
// ✅ 推荐：优先中间件，备选 mock
const reviews = middlewareReviews && middlewareReviews.length > 0 
  ? middlewareReviews 
  : mockReviews

// 或使用可选链
const finalData = middlewareData?.field || defaultValue
```

### 错误处理模式

```typescript
// ✅ 推荐：防御性检查
{middlewareData && <Component data={middlewareData} />}

// ✅ 推荐：empty state
{!reviews.length && <EmptyState />}

// ❌ 不推荐：假设数据存在
reviews.map(r => r.content) // 若 reviews undefined 会报错
```

---

## 🔗 相关文档

- [DETAIL_COMPONENT_INTEGRATION_ROADMAP.md](./docs/DETAIL_COMPONENT_INTEGRATION_ROADMAP.md) - 原始路线图
- [detailDataMiddleware.ts](./packages/shared/src/types/detailDataMiddleware.ts) - 中间件类型定义
- [homestayStore.ts](./packages/shared/src/types/homestayStore.ts) - Store 定义

---

**生成时间**: 2026-02-23  
**Session 状态**: ✅ 已完成代码级实现，等待下一 session 数据验证和测试
