/**
 * 認証サービス
 * ユーザーの登録、ログイン、認証トークンの管理を行います
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import type {
  LoginCredentials,
  AuthTokens,
  User,
  RegisterRequest,
  ApiSuccessResponse,
  ApiErrorResponse
} from '@test-ai-search-assistant/types';

// Prismaクライアントのインスタンス化
const prisma = new PrismaClient();

// JWT設定の取得（環境変数から）
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-development-only';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '86400'; // 24時間（秒）

// セキュリティ設定の定数
const MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5');
const LOCK_TIME = parseInt(process.env.ACCOUNT_LOCK_TIME || '7200000'); // 2時間
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');

/**
 * パスワードをハッシュ化する関数
 * bcryptを使用してセキュアなハッシュ値を生成
 * @param password - 平文のパスワード
 * @returns Promise<string> - ハッシュ化されたパスワード
 */
async function hashPassword(password: string): Promise<string> {
  try {
    // bcryptでソルト付きハッシュを生成
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    console.error('パスワードハッシュ化エラー:', error);
    throw new Error('パスワードのハッシュ化に失敗しました');
  }
}

/**
 * パスワードを検証する関数
 * 入力されたパスワードとハッシュ値を比較
 * @param password - 平文のパスワード
 * @param hashedPassword - データベース保存されたハッシュ値
 * @returns Promise<boolean> - 検証結果（true: 一致, false: 不一致）
 */
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    // bcryptで安全に比較
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('パスワード検証エラー:', error);
    return false;
  }
}

/**
 * JWTトークンを生成する関数
 * ユーザー情報を含む署名付きトークンを作成
 * @param userId - ユーザーの一意ID
 * @param email - ユーザーのメールアドレス
 * @returns string - 生成されたJWTトークン
 */
function generateToken(userId: number, email: string): string {
  // JWTペイロードの構成
  const payload = {
    userId,          // ユーザーID
    email,           // メールアドレス
    iat: Math.floor(Date.now() / 1000), // 発行時刻（Unix時間）
  };

  // 署名付きトークンの生成
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN, // 有効期限
  });
}

/**
 * JWTトークンを検証する関数
 * トークンの署名と有効期限をチェック
 * @param token - 検証するJWTトークン
 * @returns any - デコードされたペイロード
 * @throws Error - 無効なトークンの場合
 */
export function verifyToken(token: string): any {
  try {
    // トークンの検証とデコード
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('トークンの有効期限が切れています');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('無効なトークンです');
    } else {
      throw new Error('トークンの検証に失敗しました');
    }
  }
}

/**
 * ユーザーを登録します
 * @param email - メールアドレス
 * @param password - パスワード
 * @param name - 名前（オプション）
 * @returns 登録されたユーザー情報
 */
export async function registerUser(
  email: string, 
  password: string, 
  name?: string
): Promise<any> {
  try {
    // メールアドレスの重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: {
          code: 'EMAIL_EXISTS',
          message: 'このメールアドレスは既に登録されています',
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        }
      };
    }

    // パスワードをハッシュ化
    const passwordHash = await hashPassword(password);

    // ユーザーを作成
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        isActive: true,
        emailVerified: false, // 実際の本番環境ではメール認証を実装
      },
    });

    // JWTトークンを生成
    const accessToken = generateToken(user.id, user.email);

    // パスワードハッシュを除外したユーザー情報
    const { passwordHash: _, ...userWithoutPassword } = user;

    const tokens = {
      accessToken,
      refreshToken: accessToken, // 簡易実装
      expiresIn: parseInt(JWT_EXPIRES_IN),
      tokenType: 'Bearer',
    };

    return {
      success: true,
      data: {
        user: {
          ...userWithoutPassword,
          id: user.id.toString(), // 型定義に合わせてstringに変換
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
          lastLoginAt: user.lastLoginAt?.toISOString(),
        },
        tokens,
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      }
    };

  } catch (error) {
    console.error('ユーザー登録エラー:', error);
    return {
      success: false,
      error: {
        code: 'REGISTRATION_FAILED',
        message: 'ユーザー登録に失敗しました',
        details: process.env.NODE_ENV === 'development' ? { message: error instanceof Error ? error.message : String(error) } : undefined
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      }
    };
  }
}

/**
 * ユーザーログインを処理します
 * @param email - メールアドレス
 * @param password - パスワード
 * @returns 認証結果とトークン
 */
export async function loginUser(
  email: string, 
  password: string
): Promise<any> {
  try {
    // ユーザーを検索
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // ユーザーが存在しない場合
    if (!user) {
      return {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'メールアドレスまたはパスワードが正しくありません',
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        }
      };
    }

    // アカウントロックチェック
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return {
        success: false,
        error: {
          code: 'ACCOUNT_LOCKED',
          message: 'アカウントがロックされています。しばらくしてから再度お試しください',
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        }
      };
    }

    // アカウントの有効性チェック
    if (!user.isActive) {
      return {
        success: false,
        error: {
          code: 'ACCOUNT_DISABLED',
          message: 'このアカウントは無効化されています',
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        }
      };
    }

    // パスワード検証
    const isPasswordValid = await verifyPassword(password, user.passwordHash);

    // パスワードが正しくない場合
    if (!isPasswordValid) {
      // ログイン失敗回数を増加
      const failedAttempts = user.failedLoginAttempts + 1;
      const updateData: any = {
        failedLoginAttempts: failedAttempts,
      };

      // 最大試行回数に達した場合はアカウントをロック
      if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
        updateData.lockedUntil = new Date(Date.now() + LOCK_TIME);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });

      return {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'メールアドレスまたはパスワードが正しくありません',
          details: process.env.NODE_ENV === 'development' ? 
            { 
              attempts: failedAttempts, 
              maxAttempts: MAX_LOGIN_ATTEMPTS,
              locked: failedAttempts >= MAX_LOGIN_ATTEMPTS
            } : undefined
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        }
      };
    }

    // ログイン成功：失敗回数をリセットし、最終ログイン時刻を更新
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    // JWTトークンを生成
    const accessToken = generateToken(user.id, user.email);

    // パスワードハッシュを除外したユーザー情報
    const { passwordHash: _, ...userWithoutPassword } = user;

    const tokens = {
      accessToken,
      refreshToken: accessToken, // 簡易実装
      expiresIn: parseInt(JWT_EXPIRES_IN),
      tokenType: 'Bearer',
    };

    return {
      success: true,
      data: {
        user: {
          ...userWithoutPassword,
          id: user.id.toString(), // 型定義に合わせてstringに変換
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
          lastLoginAt: new Date().toISOString(),
        },
        tokens,
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      }
    };

  } catch (error) {
    console.error('ログインエラー:', error);
    return {
      success: false,
      error: {
        code: 'LOGIN_FAILED',
        message: 'ログインに失敗しました',
        details: process.env.NODE_ENV === 'development' ? { message: error instanceof Error ? error.message : String(error) } : undefined
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      }
    };
  }
}

/**
 * ユーザー情報を取得します
 * @param userId - ユーザーID
 * @returns ユーザー情報
 */
export async function getUserById(userId: number): Promise<any> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    // パスワードハッシュなどの機密情報を除外
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
      id: user.id.toString(), // 型定義に合わせてstringに変換
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString(),
    };

  } catch (error) {
    console.error('ユーザー取得エラー:', error);
    return null;
  }
}

/**
 * トークンからユーザー情報を取得します
 * @param token - JWTトークン
 * @returns ユーザー情報
 */
export async function getUserFromToken(token: string): Promise<any> {
  try {
    // トークンを検証してペイロードを取得
    const decoded = verifyToken(token);

    // ペイロードからユーザーIDを取得してユーザー情報を検索
    return await getUserById(decoded.userId);
  } catch (error) {
    console.error('トークンからユーザー取得エラー:', error);
    return null;
  }
}
