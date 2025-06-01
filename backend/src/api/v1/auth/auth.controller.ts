/**
 * 認証コントローラー
 * 認証関連のHTTPリクエストを処理する関数群
 */

import type { Request, Response } from 'express';
import { registerUser, loginUser } from '../../../services/authService.js';
import type { LoginCredentials, RegisterRequest } from '@test-ai-search-assistant/types';

/**
 * ユーザー登録コントローラー
 * POST /api/v1/auth/register
 * @param req - Expressリクエストオブジェクト
 * @param res - Expressレスポンスオブジェクト
 */
export async function registerController(req: Request, res: Response): Promise<void> {
  try {
    // バリデーション済みのリクエストデータを取得
    const { email, password, name } = req.body;

    console.log(`新規ユーザー登録試行: ${email}`);

    // 認証サービスでユーザー登録を実行（個別引数で渡す）
    const result = await registerUser(email, password, name);

    if (result.success) {
      console.log(`ユーザー登録成功: ${email}`);
      res.status(201).json(result);
    } else {
      console.warn(`ユーザー登録失敗: ${email} - ${result.error}`);
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('登録コントローラーエラー:', error);
    res.status(500).json({
      success: false,
      error: '内部サーバーエラーが発生しました',
      message: 'ユーザー登録処理中にサーバーエラーが発生しました',
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * ユーザーログインコントローラー
 * POST /api/v1/auth/login
 * @param req - Expressリクエストオブジェクト
 * @param res - Expressレスポンスオブジェクト
 */
export async function loginController(req: Request, res: Response): Promise<void> {
  try {
    // バリデーション済みのリクエストデータを取得
    const { email, password } = req.body;

    console.log(`ログイン試行: ${email}`);

    // 認証サービスでログイン処理を実行（個別引数で渡す）
    const result = await loginUser(email, password);

    if (result.success) {
      console.log(`ログイン成功: ${email}`);
      res.status(200).json(result);
    } else {
      console.warn(`ログイン失敗: ${email} - ${result.error}`);
      res.status(401).json(result);
    }

  } catch (error) {
    console.error('ログインコントローラーエラー:', error);
    res.status(500).json({
      success: false,
      error: '内部サーバーエラーが発生しました',
      message: 'ログイン処理中にサーバーエラーが発生しました',
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * ユーザープロフィール取得コントローラー
 * GET /api/v1/auth/profile
 * @param req - Expressリクエストオブジェクト（req.userに認証済みユーザー情報）
 * @param res - Expressレスポンスオブジェクト
 */
export async function profileController(req: Request, res: Response): Promise<void> {
  try {
    // authenticateTokenミドルウェアでreq.userが設定されている
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: '認証が必要です',
        message: '認証ミドルウェアでユーザー情報が設定されていません',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    console.log(`プロフィール取得: ユーザーID ${req.user.id}`);

    // 認証済みユーザー情報を返す
    res.status(200).json({
      success: true,
      data: req.user,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('プロフィール取得エラー:', error);
    res.status(500).json({
      success: false,
      error: '内部サーバーエラーが発生しました',
      message: 'プロフィール取得処理中にサーバーエラーが発生しました',
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * ユーザーログアウトコントローラー
 * POST /api/v1/auth/logout
 * @param req - Expressリクエストオブジェクト
 * @param res - Expressレスポンスオブジェクト
 */
export async function logoutController(req: Request, res: Response): Promise<void> {
  try {
    // 現在は簡易実装：クライアント側でトークンを削除
    // 本格的な実装では以下を検討:
    // - トークンブラックリストの管理
    // - Redisでのセッション管理
    // - リフレッシュトークンの無効化
    
    if (req.user) {
      console.log(`ログアウト: ユーザーID ${req.user.id} (${req.user.email})`);
    }

    res.status(200).json({
      success: true,
      data: {
        message: 'ログアウトしました',
        instruction: 'クライアント側でアクセストークンを削除してください',
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('ログアウトエラー:', error);
    res.status(500).json({
      success: false,
      error: '内部サーバーエラーが発生しました',
      message: 'ログアウト処理中にサーバーエラーが発生しました',
      timestamp: new Date().toISOString(),
    });
  }
}
