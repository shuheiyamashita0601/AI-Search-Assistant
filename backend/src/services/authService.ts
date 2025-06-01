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
const MAX_LOGIN_ATTEMPTS = 5;        // 最大ログイン試行回数
const LOCK_TIME = 2 * 60 * 60 * 1000; // アカウントロック時間（2時間、ミリ秒）
const SALT_ROUNDS = 12;              // bcryptのソルトラウンド数（セキュリティレベル）

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
 * ユーザー登録処理
 * 新規ユーザーをデータベースに登録し、認証トークンを発行
 * @param registerData - 登録データ（メール、パスワード、名前）
 * @returns Promise<ApiSuccessResponse | ApiErrorResponse> - 登録結果
 */
export async function registerUser(
  registerData: RegisterRequest
): Promise<ApiSuccessResponse<{ user: User; tokens: AuthTokens }> | ApiErrorResponse> {
  try {
    const { email, password, name } = registerData;

    // メールアドレスの重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: 'このメールアドレスは既に登録されています',
        timestamp: new Date().toISOString(),
      };
    }

    // パスワードをセキュアにハッシュ化
    const passwordHash = await hashPassword(password);

    // データベースに新規ユーザーを作成
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        isActive: true,      // アカウント有効状態
        emailVerified: false, // メール認証は未実装（将来対応）
      },
    });

    // 認証トークンを生成
    const accessToken = generateToken(user.id, user.email);

    // セキュリティ：パスワードハッシュを除外したユーザー情報
    const { passwordHash: _, ...userWithoutPassword } = user;

    // レスポンス用のトークン情報
    const tokens: AuthTokens = {
      accessToken,
      refreshToken: accessToken, // 簡易実装（本格版では別途リフレッシュトークン）
      expiresIn: parseInt(JWT_EXPIRES_IN),
      tokenType: 'Bearer',
    };

    // 成功レスポンス
    return {
      success: true,
      data: {
        user: {
          ...userWithoutPassword,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
          lastLoginAt: user.lastLoginAt?.toISOString(),
        } as User,
        tokens,
      },
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error('ユーザー登録エラー:', error);
    return {
      success: false,
      error: 'ユーザー登録に失敗しました',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * ユーザーログイン処理
 * 認証情報を検証し、成功時にトークンを発行
 * @param credentials - ログイン認証情報
 * @returns Promise<ApiSuccessResponse | ApiErrorResponse> - ログイン結果
 */
export async function loginUser(
  credentials: LoginCredentials
): Promise<ApiSuccessResponse<{ user: User; tokens: AuthTokens }> | ApiErrorResponse> {
  try {
    const { username: email, password } = credentials;

    // ユーザーをメールアドレスで検索
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        error: 'メールアドレスまたはパスワードが正しくありません',
        timestamp: new Date().toISOString(),
      };
    }

    // アカウントロック状態のチェック
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return {
        success: false,
        error: 'アカウントがロックされています。しばらくしてから再度お試しください',
        timestamp: new Date().toISOString(),
      };
    }

    // アカウントの有効性チェック
    if (!user.isActive) {
      return {
        success: false,
        error: 'このアカウントは無効化されています',
        timestamp: new Date().toISOString(),
      };
    }

    // パスワード検証
    const isPasswordValid = await verifyPassword(password, user.passwordHash);

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
        error: 'メールアドレスまたはパスワードが正しくありません',
        timestamp: new Date().toISOString(),
      };
    }

    // ログイン成功：セキュリティ情報をリセット
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,    // 失敗回数をリセット
        lockedUntil: null,         // ロック状態を解除
        lastLoginAt: new Date(),   // 最終ログイン時刻を更新
      },
    });

    // 認証トークンを生成
    const accessToken = generateToken(user.id, user.email);

    // セキュリティ：パスワードハッシュを除外
    const { passwordHash: _, ...userWithoutPassword } = user;

    const tokens: AuthTokens = {
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
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
          lastLoginAt: new Date().toISOString(),
        } as User,
        tokens,
      },
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error('ログインエラー:', error);
    return {
      success: false,
      error: 'ログインに失敗しました',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * ユーザーIDでユーザー情報を取得
 * @param userId - ユーザーID
 * @returns Promise<User | null> - ユーザー情報（見つからない場合はnull）
 */
export async function getUserById(userId: number): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    // セキュリティ：パスワードハッシュを除外
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString(),
    } as User;

  } catch (error) {
    console.error('ユーザー取得エラー:', error);
    return null;
  }
}

/**
 * JWTトークンからユーザー情報を取得
 * @param token - JWTトークン
 * @returns Promise<User | null> - ユーザー情報（無効トークンの場合はnull）
 */
export async function getUserFromToken(token: string): Promise<User | null> {
  try {
    const decoded = verifyToken(token);
    return await getUserById(decoded.userId);
  } catch (error) {
    console.error('トークンからユーザー取得エラー:', error);
    return null;
  }
}
