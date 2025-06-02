/**
 * 認証関連のルート定義
 * 認証機能のエンドポイントを定義し、適切なミドルウェアを適用
 */

import { Router } from "express";
import type { Request, Response } from "express";
import {
  registerController,
  loginController,
  profileController,
  logoutController,
} from "./auth.controller.js";
import { authenticateToken } from "../../../middleware/auth.js";
import { validateRegistration, validateLogin } from "./auth.validation.js";
import * as authService from "../../../services/authService.js";

// Expressルーターのインスタンスを作成
const router = Router();

/**
 * POST /api/v1/auth/register
 * @desc    新規ユーザー登録
 * @access  Public（誰でもアクセス可能）
 * @middleware validateRegistration - 登録データのバリデーション
 * @controller registerController - 登録処理
 */
router.post("/register", validateRegistration, registerController);

/**
 * POST /api/v1/auth/login
 * @desc    ユーザーログイン
 * @access  Public（誰でもアクセス可能）
 * @middleware validateLogin - ログインデータのバリデーション
 * @controller loginController - ログイン処理
 */
router.post("/login", validateLogin, loginController);

/**
 * GET /api/v1/auth/profile
 * @desc    ログイン中のユーザー情報取得
 * @access  Private（認証必須）
 * @middleware authenticateToken - JWT認証
 * @controller profileController - プロフィール取得処理
 */
router.get("/profile", authenticateToken, profileController);

/**
 * POST /api/v1/auth/logout
 * @desc    ユーザーログアウト
 * @access  Private（認証必須）
 * @middleware authenticateToken - JWT認証
 * @controller logoutController - ログアウト処理
 */
router.post("/logout", authenticateToken, logoutController);

// その他の認証関連エンドポイント（将来実装予定）

/**
 * POST /api/v1/auth/refresh
 * @desc    アクセストークンの更新（将来実装）
 * @access  Private
 */
// router.post('/refresh', refreshTokenController);

/**
 * POST /api/v1/auth/forgot-password
 * @desc    パスワードリセット要求（将来実装）
 * @access  Public
 */
// router.post('/forgot-password', forgotPasswordController);

/**
 * POST /api/v1/auth/reset-password
 * @desc    パスワードリセット実行（将来実装）
 * @access  Public
 */
// router.post('/reset-password', resetPasswordController);

/**
 * POST /api/v1/auth/verify-email
 * @desc    メールアドレス認証（将来実装）
 * @access  Public
 */
// router.post('/verify-email', verifyEmailController);

export default router;
