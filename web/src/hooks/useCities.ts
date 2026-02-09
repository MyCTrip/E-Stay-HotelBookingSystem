import { createUseCities } from '@estay/shared/hooks'
import api from '../services/api'

// 使用 api 实例创建 hook
export const useCities = createUseCities(api)
