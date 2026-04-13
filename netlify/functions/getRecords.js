const mysql = require('mysql2');

// ============================================
// ✅ 已填入你的 Aiven 真实信息
// ============================================
const pool = mysql.createPool({
  host: 'mysql-5456f0d-cutmy.l.aivencloud.com',
  port: 11636,
  user: 'avnadmin',
  password: 'AVNS_ePlD8mFxi4r3Jjk-xV_',
  database: 'defaultdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: false }
});

// ============================================
// 处理 GET 请求：获取所有工作记录
// ============================================
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: '只支持 GET 请求' })
    };
  }

  try {
    const sql = 'SELECT * FROM work_records ORDER BY id DESC';

    const results = await new Promise((resolve, reject) => {
      pool.query(sql, (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(results)
    };

  } catch (error) {
    console.error('查询失败:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: '查询失败，请稍后重试' })
    };
  }
};