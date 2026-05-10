 cat TransactionService.js
const dbcreds = require(__dirname + '/DbConfig');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: dbcreds.DB_HOST,
  user: dbcreds.DB_USER,
  password: dbcreds.DB_PWD,
  database: dbcreds.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Insert into `desc` column (escaped with backticks)
async function addTransaction(amount, desc) {
  const sql = "INSERT INTO transactions (amount, `desc`) VALUES (?, ?)";
  const [result] = await pool.query(sql, [amount, desc]);
  console.log("Transaction added successfully");
  return result;
}

async function getAllTransactions() {
  const sql = "SELECT * FROM transactions";
  const [rows] = await pool.query(sql);
  console.log("Fetched all transactions");
  return rows;
}

async function findTransactionById(id) {
  const sql = "SELECT * FROM transactions WHERE id = ?";
  const [rows] = await pool.query(sql, [id]);
  console.log(`Fetched transaction with id ${id}`);
  return rows;
}

async function deleteAllTransactions() {
  const sql = "DELETE FROM transactions";
  const [result] = await pool.query(sql);
  console.log("Deleted all transactions");
  return result;
}

async function deleteTransactionById(id) {
  const sql = "DELETE FROM transactions WHERE id = ?";
  const [result] = await pool.query(sql, [id]);
  console.log(`Deleted transaction with id ${id}`);
  return result;
}

module.exports = {
  addTransaction,
  getAllTransactions,
  findTransactionById,
  deleteAllTransactions,
  deleteTransactionById
};