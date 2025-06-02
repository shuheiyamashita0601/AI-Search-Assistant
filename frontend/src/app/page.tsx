"use client";

import { useState, useEffect } from "react";

interface HealthStatus {
  status: string;
  timestamp: string;
  environment: string;
  version: string;
}

export default function HomePage() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch("/api/v1/health");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setHealthStatus(data.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "不明なエラーが発生しました",
        );
      } finally {
        setLoading(false);
      }
    };

    checkBackendHealth();
  }, []);

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem",
        lineHeight: "1.6",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1
          style={{
            color: "#333",
            marginBottom: "0.5rem",
            fontSize: "2.5rem",
          }}
        >
          🏠 AI検索アシスタント
        </h1>
        <p
          style={{
            color: "#666",
            fontSize: "1.1rem",
          }}
        >
          不動産物件をAIで検索できるアシスタントアプリケーション
        </p>
      </header>

      <main>
        {/* システム状態表示 */}
        <section
          style={{
            background: "#f5f5f5",
            padding: "1.5rem",
            borderRadius: "8px",
            marginBottom: "2rem",
          }}
        >
          <h2 style={{ marginTop: 0, color: "#333" }}>🔧 システム状態</h2>

          {loading && (
            <p style={{ color: "#666" }}>バックエンドAPI接続確認中...</p>
          )}

          {error && (
            <div
              style={{
                background: "#fee",
                border: "1px solid #fcc",
                padding: "1rem",
                borderRadius: "4px",
                color: "#c00",
              }}
            >
              <strong>❌ バックエンドAPI接続エラー:</strong>
              <br />
              {error}
              <br />
              <small>
                Dockerコンテナが起動していることを確認してください。
              </small>
            </div>
          )}

          {healthStatus && (
            <div
              style={{
                background: "#efe",
                border: "1px solid #cfc",
                padding: "1rem",
                borderRadius: "4px",
                color: "#060",
              }}
            >
              <strong>✅ バックエンドAPI接続成功</strong>
              <ul style={{ margin: "0.5rem 0", paddingLeft: "1.5rem" }}>
                <li>ステータス: {healthStatus.status}</li>
                <li>環境: {healthStatus.environment}</li>
                <li>バージョン: {healthStatus.version}</li>
                <li>
                  時刻:{" "}
                  {new Date(healthStatus.timestamp).toLocaleString("ja-JP")}
                </li>
              </ul>
            </div>
          )}
        </section>

        {/* 機能説明 */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#333" }}>🚀 実装予定機能</h2>
          <ul style={{ color: "#666" }}>
            <li>自然言語による物件検索</li>
            <li>AIによるキーワード抽出とフィルタリング</li>
            <li>詳細な物件情報表示</li>
            <li>検索履歴の管理</li>
            <li>お気に入り物件の保存</li>
          </ul>
        </section>

        {/* 技術スタック */}
        <section>
          <h2 style={{ color: "#333" }}>⚙️ 技術スタック</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            <div
              style={{
                background: "#f9f9f9",
                padding: "1rem",
                borderRadius: "6px",
              }}
            >
              <h3 style={{ margin: "0 0 0.5rem 0", color: "#333" }}>
                フロントエンド
              </h3>
              <ul style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
                <li>Next.js 15.3.3</li>
                <li>React 19.1.0</li>
                <li>TypeScript 5.8.3</li>
              </ul>
            </div>
            <div
              style={{
                background: "#f9f9f9",
                padding: "1rem",
                borderRadius: "6px",
              }}
            >
              <h3 style={{ margin: "0 0 0.5rem 0", color: "#333" }}>
                バックエンド
              </h3>
              <ul style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
                <li>Express.js 5.1.0</li>
                <li>Node.js 22.16.0</li>
                <li>PostgreSQL 17.5</li>
              </ul>
            </div>
            <div
              style={{
                background: "#f9f9f9",
                padding: "1rem",
                borderRadius: "6px",
              }}
            >
              <h3 style={{ margin: "0 0 0.5rem 0", color: "#333" }}>
                インフラ
              </h3>
              <ul style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
                <li>Docker & Docker Compose</li>
                <li>Nginx 1.28.0</li>
                <li>Redis 7.4</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
