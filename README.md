# Fastify + Prometheus + Grafana 生產環境

這是一個簡單的生產環境設置，使用 Fastify 作為網頁伺服器，Prometheus 用於監控，Grafana 用於視覺化。

## 組件

- **Fastify 應用程式**：一個在端口 3000 上運行的 Node.js 應用程式，在 `/metrics` 處公開指標。
- **Prometheus**：每 15 秒從 Fastify 應用程式抓取指標，可在端口 9090 上訪問。
- **Grafana**：視覺化儀表板，可在端口 3001 上訪問（預設管理員密碼：admin）。

## 本地運行

1. 安裝依賴：
   ```
   npm install
   ```

2. 啟動 Fastify 應用程式：
   ```
   npm start
   ```

3. 在 http://localhost:3000 訪問應用程式

4. 指標在 http://localhost:3000/metrics

## 使用 Docker Compose 運行

1. 建置並啟動所有服務：
   ```
   docker-compose up --build
   ```

2. 訪問：
   - Fastify 應用程式：http://localhost/api/
   - Prometheus：http://localhost/prometheus/
   - Grafana：http://localhost/ (admin/admin)

## Grafana 設置

1. 使用 admin/admin 登入 Grafana。
2. 添加 Prometheus 作為資料來源：URL `http://prometheus:9090`
3. 從 `config/grafana-dashboard.json` 匯入儀表板，以視覺化如 `http_requests_total` 和 CPU 使用率的指標。

## 自定義指標

應用程式包含 HTTP 請求的自定義計數器。您可以使用 prom-client 添加更多指標。