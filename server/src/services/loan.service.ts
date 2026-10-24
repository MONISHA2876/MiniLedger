import db = require("../config/db");

const pool = db.pool;

async function addLoan(
  userId: number,
  friendName: string,
  amount: number,
  dueDate: string
) {
  const result = await pool.query(
    `INSERT INTO loans (user_id, friend_name, amount, due_date)
     VALUES ($1, $2, $3, $4)
     RETURNING id, friend_name, amount, due_date,
               is_repaid, created_at`,
    [userId, friendName, amount, dueDate]
  );

  return result.rows[0];
}

async function getLoans(userId: number) {
  const result = await pool.query(
    `SELECT id, friend_name, amount, due_date,
            is_repaid, repaid_at, created_at,
            (due_date < CURRENT_DATE AND NOT is_repaid) AS is_overdue
     FROM loans
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
}

async function repayLoan(userId: number, loanId: number) {
  const result = await pool.query(
    `UPDATE loans
     SET is_repaid = TRUE, repaid_at = NOW()
     WHERE id = $1 AND user_id = $2 AND is_repaid = FALSE
     RETURNING id, friend_name, amount, due_date,
               is_repaid, repaid_at`,
    [loanId, userId]
  );

  return result.rows[0] ?? null;
}

async function getSummary(userId: number) {
  const result = await pool.query(
    `SELECT
       COALESCE(SUM(amount), 0) AS total_lent,
       COALESCE(SUM(amount) FILTER (WHERE is_repaid), 0) AS total_repaid,
       COALESCE(
         SUM(amount) FILTER (
           WHERE NOT is_repaid AND due_date < CURRENT_DATE
         ), 0
       ) AS overdue_amount
     FROM loans
     WHERE user_id = $1`,
    [userId]
  );

  return result.rows[0];
}

export = { addLoan, getLoans, repayLoan, getSummary };