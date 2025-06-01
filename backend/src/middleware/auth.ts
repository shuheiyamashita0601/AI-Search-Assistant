/**
 * 認証ミドルウェア
 * JWTトークンの検証とユーザー認証を行います
 */

import type { Request, Response, NextFunction } from 'express';
import { getUserFromToken } from '../services/authService.js';
import type { User } from '@test-ai-search-assistant/types';

// Express Requestオブジェクトにuser プロパティを追加
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

/**
 * JWT認証ミドルウェア（必須認証）
 * Authorizationヘッダーからトークンを抽出し、ユーザー情報を検証
 * 認証に失敗した場合は401エラーを返す
 * @param req - Expressリクエストオブジェクト
 * @param res - Expressレスポンスオブジェクト
 * @param next - 次のミドルウェアを呼び出す関数
 */
export async function authenticateToken(
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> {
  try {
    // Authorizationヘッダーを取得
    const authHeader = req.headers.authorization;
    
    // ヘッダーの存在とBearerスキームの確認
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'アクセストークンが必要です',
        message: 'Authorization ヘッダーに Bearer トークンを含めてください',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // "Bearer " プレフィックスを除去してトークンを抽出
    const token = authHeader.substring(7);

    // トークンからユーザー情報を取得
    const user = await getUserFromToken(token);

    if (!user) {
      res.status(401).json({
        success: false,
        error: '無効なアクセストークンです',
        message: 'トークンが無効、期限切れ、または存在しないユーザーです',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // アカウントの有効性をチェック
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        error: 'アカウントが無効化されています',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // リクエストオブジェクトにユーザー情報を追加
    req.user = user;
    
    // 次のミドルウェアまたはルートハンドラーに進む
    next();

  } catch (error) {
    console.error('認証エラー:', error);
    res.status(401).json({
      success: false,
      error: '認証に失敗しました',
      message: '内部認証エラーが発生しました',
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * 管理者権限チェックミドルウェア（将来の拡張用）
 * 管理者のみアクセス可能なエンドポイントで使用
 * 現在は基本実装、将来的にロール機能を追加予定
 * @param req - Expressリクエストオブジェクト
 * @param res - Expressレスポンスオブジェクト
 * @param next - 次のミドルウェアを呼び出す関数
 */
export function requireAdmin(
  req: Request, 
  res: Response, 
  next: NextFunction
): void {
  // 認証チェック
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: '認証が必要です',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // 将来的にユーザーロール機能を追加する際に実装
  // 現在は全ての認証済みユーザーを許可（プレースホルダー）
  // if (req.user.role !== 'admin') {
  //   res.status(403).json({
  //     success: false,
  //     error: '管理者権限が必要です',
  //     timestamp: new Date().toISOString(),
  //   });
  //   return;
  // }

  next();
}

/**
 * オプション認証ミドルウェア
 * トークンが存在する場合のみユーザー情報を設定
 * エラーが発生してもリクエストを続行（パブリックエンドポイント用）
 * @param req - Expressリクエストオブジェクト
 * @param res - Expressレスポンスオブジェクト
 * @param next - 次のミドルウェアを呼び出す関数
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    // トークンが存在する場合のみ処理
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const user = await getUserFromToken(token);

      // 有効なユーザーの場合のみ設定
      if (user && user.isActive) {
        req.user = user;
      }
    }

    // エラーが発生してもそのまま続行
    next();

  } catch (error) {
    // オプション認証なのでエラーをログに記録するのみ
    console.warn('オプション認証でエラー:', error);
    next();
  }
}
