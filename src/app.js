const fastify = require('fastify')({ logger: true });
const promClient = require('prom-client');

// 創建一個註冊指標的註冊表
const register = new promClient.Registry();

// 添加一個預設標籤，該標籤會添加到所有指標
register.setDefaultLabels({
  app: 'fastify-app'
});

// 啟用預設指標的收集
promClient.collectDefaultMetrics({ register });

// 創建一個自定義計數器指標
const httpRequestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

// Create a custom memory usage gauge metric
const memoryUsageGauge = new promClient.Gauge({
  name: 'fastify_memory_usage_bytes',
  help: 'Node.js memory usage in bytes',
  labelNames: ['type'],
  registers: [register]
});

const updateMemoryUsage = () => {
  const mem = process.memoryUsage();
  memoryUsageGauge.set({ type: 'rss' }, mem.rss);
  memoryUsageGauge.set({ type: 'heapTotal' }, mem.heapTotal);
  memoryUsageGauge.set({ type: 'heapUsed' }, mem.heapUsed);
  memoryUsageGauge.set({ type: 'external' }, mem.external);
};

updateMemoryUsage();
setInterval(updateMemoryUsage, 5000);

// 註冊指標端點
fastify.get('/metrics', async (request, reply) => {
  reply.header('Content-Type', register.contentType);
  return register.metrics();
});

// 一個簡單的路由
fastify.get('/', async (request, reply) => {
  httpRequestCounter.inc({ method: 'GET', route: '/', status_code: 200 });
  return { hello: 'world' };
});

// 另一個路由
fastify.get('/api/test', async (request, reply) => {
  httpRequestCounter.inc({ method: 'GET', route: '/api/test', status_code: 200 });
  return { message: 'This is a test endpoint' };
});

// 啟動伺服器
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server listening on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();