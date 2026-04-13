const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'mysql-5456f0d-cutmy.l.aivencloud.com',
  port: 11636,
  user: 'avnadmin',
  password: 'AVNS_ePlD8mFxi4r3Jjk-xV_',
  database: 'defaultdb',
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: '只支持 POST' }) };
  }

  try {
    const data = JSON.parse(event.body);
    console.log('收到数据:', data);

    // 建表
    await new Promise((resolve, reject) => {
      pool.query(`
        CREATE TABLE IF NOT EXISTS work_records (
          id INT AUTO_INCREMENT PRIMARY KEY,
          client VARCHAR(255),
          req TEXT,
          total DECIMAL(10,2),
          paid DECIMAL(10,2),
          paidStatus VARCHAR(50),
          prodStatus VARCHAR(50),
          board VARCHAR(255),
          address TEXT,
          contact VARCHAR(100),
          note TEXT,
          date DATE,
          delivery DATE
        )
      `, (err) => err ? reject(err) : resolve());
    });

    // 插入
    const result = await new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO work_records (client, req, total, paid, paidStatus, prodStatus, board, address, contact, note, date, delivery) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.client, data.req, data.total, data.paid, data.paidStatus, data.prodStatus, data.board, data.address, data.contact, data.note, data.date, data.delivery],
        (err, result) => err ? reject(err) : resolve(result)
      );
    });

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, message: '保存成功', id: result.insertId })
    };
  } catch (error) {
    console.error('保存失败:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};