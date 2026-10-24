import crypto = require("node:crypto");
import db = require("../config/db");

const pool = db.pool;

type Purpose = "signup" | "login";

function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

async function requestOtp(
  phoneInput: string,
  purpose: Purpose,
  username?: string
) {
  const phone = phoneInput;

  const existing = await pool.query(
    "SELECT id FROM users WHERE phone = $1",
    [phone]
  );

  if (purpose === "signup" && existing.rowCount) {
    throw new Error("This number is already registered. Please log in.");
  }

  if (purpose === "login" && !existing.rowCount) {
    throw new Error("Number not registered. Please sign up.");
  }

  if (purpose === "signup" && !username?.trim()) {
    throw new Error("Username is required");
  }

  await pool.query(
    "DELETE FROM otp_verifications WHERE phone = $1 AND purpose = $2",
    [phone, purpose]
  );

  const otp = crypto.randomInt(100000, 1000000).toString();
  const otpHash = hashOtp(otp);

  await pool.query(
    `INSERT INTO otp_verifications
      (phone, otp_hash, purpose, expires_at)
     VALUES ($1, $2, $3, NOW() + INTERVAL '5 minutes')`,
    [phone, otpHash, purpose]
  );

  console.log(`[MiniLedger] Mock OTP for ${phone}: ${otp}`);

  return {
    phone,
    purpose,
    message: "OTP generated. Check the server terminal.",
  };
}

async function verifyOtp(
  phoneInput: string,
  otp: string,
  purpose: Purpose,
  username?: string
) {
  const phone = phoneInput;

  if (!/^\d{6}$/.test(otp)) {
    throw new Error("OTP must contain 6 digits");
  }

  const result = await pool.query(
    `SELECT id, otp_hash, attempts
     FROM otp_verifications
     WHERE phone = $1 AND purpose = $2
       AND expires_at > NOW()
     ORDER BY created_at DESC
     LIMIT 1`,
    [phone, purpose]
  );

  const record = result.rows[0];

  if (!record) {
    throw new Error("OTP expired or not found. Request a new one.");
  }

  if (record.attempts >= 5) {
    await pool.query(
      "DELETE FROM otp_verifications WHERE id = $1",
      [record.id]
    );
    throw new Error("Too many attempts. Request a new OTP.");
  }

  if (hashOtp(otp) !== record.otp_hash) {
    await pool.query(
      "UPDATE otp_verifications SET attempts = attempts + 1 WHERE id = $1",
      [record.id]
    );
    throw new Error("Incorrect OTP");
  }

  // Consume the code so it cannot be reused.
  await pool.query(
    "DELETE FROM otp_verifications WHERE id = $1",
    [record.id]
  );

  let user;

  if (purpose === "signup") {
    if (!username?.trim()) throw new Error("Username is required");

    const created = await pool.query(
      `INSERT INTO users (username, phone)
       VALUES ($1, $2)
       RETURNING id, username, phone`,
      [username.trim(), phone]
    );

    user = created.rows[0];
  } else {
    const found = await pool.query(
      "SELECT id, username, phone FROM users WHERE phone = $1",
      [phone]
    );

    user = found.rows[0];

    if (!user) throw new Error("User not found. Please sign up.");
  }

  return user;
}

export = { requestOtp, verifyOtp };
