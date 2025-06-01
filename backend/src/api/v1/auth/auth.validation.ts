/**
 * 認証関連のリクエストバリデーション
 * Zodライブラリを使用して入力データの検証を行います
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import type { ValidationErrorResponse } from '@test-ai-search-assistant/types';

// ユーザー登録用のバリデーションスキーマ
const registrationSchema = z.object({
  email: z
    .string({ required_error: 'メールアドレスは必須です' })
    .email('有効なメールアドレスを入力してください')
    .max(255, 'メールアドレスは255文字以内で入力してください')
    .toLowerCase(), // 小文字に正規化

  password: z
    .string({ required_error: 'パスワードは必須です' })
    .min(8, 'パスワードは8文字以上で入力してください')
    .max(128, 'パスワードは128文字以内で入力してください')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'パスワードは英大文字、英小文字、数字をそれぞれ1文字以上含む必要があります'
    ),

  name: z
    .string()
    .max(100, '名前は100文字以内で入力してください')
    .trim() // 前後の空白を削除
    .optional(),
});

// ログイン用のバリデーションスキーマ
const loginSchema = z.object({
  email: z
    .string({ required_error: 'メールアドレスは必須です' })
    .email('有効なメールアドレスを入力してください')
    .toLowerCase(), // 小文字に正規化
  
  password: z
    .string({ required_error: 'パスワードは必須です' })
    .min(1, 'パスワードを入力してください'),
  
  rememberMe: z
    .boolean()
    .optional()
    .default(false), // デフォルト値を設定
});

/**
 * ユーザー登録のバリデーションミドルウェア
 * 登録データの形式と制約をチェック
 * @param req - Expressリクエストオブジェクト
 * @param res - Expressレスポンスオブジェクト
 * @param next - 次のミドルウェアを呼び出す関数
 */
export function validateRegistration(
  req: Request, 
  res: Response, 
  next: NextFunction
): void {
  try {
    // スキーマでリクエストボディを検証
    const validatedData = registrationSchema.parse(req.body);
    
    // 検証済みデータでリクエストボディを更新
    req.body = validatedData;
    
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Zodバリデーションエラーの詳細な情報を作成
      const validationErrorResponse: ValidationErrorResponse = {
        success: false,
        error: 'VALIDATION_ERROR',
        validationErrors: error.errors.map(err => ({
          field: err.path.join('.'),       // エラーフィールドのパス
          message: err.message,            // エラーメッセージ
          code: err.code,                  // エラーコード
          value: err.input,                // 入力値
        })),
        timestamp: new Date().toISOString(),
      };

      res.status(400).json(validationErrorResponse);
    } else {
      // 予期しないエラー
      console.error('バリデーションエラー:', error);
      res.status(400).json({
        success: false,
        error: 'バリデーションエラーが発生しました',
        timestamp: new Date().toISOString(),
      });
    }
  }
}

/**
 * ログインのバリデーションミドルウェア
 * ログインデータの形式をチェック
 * @param req - Expressリクエストオブジェクト
 * @param res - Expressレスポンスオブジェクト
 * @param next - 次のミドルウェアを呼び出す関数
 */
export function validateLogin(
  req: Request, 
  res: Response, 
  next: NextFunction
): void {
  try {
    // スキーマでリクエストボディを検証
    const validatedData = loginSchema.parse(req.body);
    
    // 検証済みデータでリクエストボディを更新
    req.body = validatedData;
    
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Zodバリデーションエラーの詳細な情報を作成
      const validationErrorResponse: ValidationErrorResponse = {
        success: false,
        error: 'VALIDATION_ERROR',
        validationErrors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
          value: err.input,
        })),
        timestamp: new Date().toISOString(),
      };

      res.status(400).json(validationErrorResponse);
    } else {
      // 予期しないエラー
      console.error('ログインバリデーションエラー:', error);
      res.status(400).json({
        success: false,
        error: 'バリデーションエラーが発生しました',
        timestamp: new Date().toISOString(),
      });
    }
  }
}

/**
 * 共通のバリデーションユーティリティ
 * カスタムバリデーション関数の定義
 */

// 強力なパスワードの検証（より厳しいルール）
export const strongPasswordSchema = z
  .string()
  .min(12, 'パスワードは12文字以上で入力してください')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    'パスワードは英大文字、英小文字、数字、特殊文字をそれぞれ1文字以上含む必要があります'
  );

// 日本語名前の検証
export const japaneseNameSchema = z
  .string()
  .max(50, '名前は50文字以内で入力してください')
  .regex(
    /^[ひらがなカタカナ漢字a-zA-Z\s]+$/,
    '名前はひらがな、カタカナ、漢字、英字のみ使用できます'
  );
