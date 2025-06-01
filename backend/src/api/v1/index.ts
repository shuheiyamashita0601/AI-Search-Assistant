/**
 * API v1 統合ルーター
 */

import { Router } from 'express';
import authRoutes from './auth/auth.routes';

const router = Router();

// 認証関連ルートをマウント
router.use('/auth', authRoutes);

export default router;
