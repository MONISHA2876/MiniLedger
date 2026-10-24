# MiniLedger 💸

MiniLedger is a mobile app for keeping track of money lent to friends. It pairs an Expo/React Native client with an Express API and PostgreSQL database.

## ✨ Features

- Sign up and log in with a phone number and one-time password (OTP)
- Record loans, due dates, and repayment status
- View totals for money lent, repaid, and overdue
- Keep loan data associated with the signed-in user

> **Development OTP:** The current API generates mock OTPs and prints them in the server terminal. It does not send SMS messages. This is for local development only.

## 🧰 Requirements

- Git
- Node.js (use a current LTS release) and npm
- PostgreSQL running locally, or a PostgreSQL database you can access
- For mobile testing: Expo Go on a physical device, or an Android emulator. The iOS Simulator requires macOS and Xcode.

Check the installed Node.js and npm versions:

```sh
node --version
npm --version
```

## 📥 Get the project

Clone the repository and enter its directory:

```sh
git clone <repository-url>
cd MiniLedger
```

If you already have the project, open a terminal at the repository root.

## 🗄️ Set up PostgreSQL

1. Start PostgreSQL and create a database named `miniledger`. For example, if `createdb` is available:

   ```sh
   createdb miniledger
   ```

   You can also create the database using a database administration tool such as pgAdmin.

2. Apply the schema once to the new database, from the repository root:

   ```sh
   psql -d miniledger -f server/sql/schema.sql
   ```

   If your local PostgreSQL user is not the default, specify it with `-U your_username`. If `psql` is not on your `PATH`, use pgAdmin's query tool to run [`server/sql/schema.sql`](server/sql/schema.sql).

The schema creates the user, OTP-verification, and loan tables. It is intended for a new database; do not reapply it to a database where these tables already exist.

## 🔐 Configure environment variables

The API and mobile app read separate environment files. Create or edit `server/.env`:

```dotenv
PORT=5000
DATABASE_URL=postgresql://postgres:your_local_password@localhost:5432/miniledger
JWT_SECRET=replace_with_a_long_random_secret
```

- Update the database username and password to match your PostgreSQL setup. Percent-encode special characters in URL credentials.
- Replace the JWT placeholder with a strong, private random value. You can generate one with Node.js:

  ```sh
  node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
  ```

Create or edit `mobile/.env` with the address that the mobile app can use to reach the API:

```dotenv
EXPO_PUBLIC_API_URL=http://localhost:5000
```

Choose the correct host for where the app is running:

| Client | Example API URL |
| --- | --- |
| Web or iOS Simulator on the same computer | `http://localhost:5000` |
| Android Studio emulator | `http://10.0.2.2:5000` |
| Physical phone running Expo Go | `http://YOUR_COMPUTER_LAN_IP:5000` |

For a physical phone, use your computer's local network IP address (for example, `192.168.1.25`), connect both devices to the same Wi-Fi network, and allow the API port through your computer's firewall if prompted. Do not use `localhost` on a physical phone: it points to the phone itself. Keep the URL free of a trailing slash.

> **Keep credentials private:** Never put real database passwords or production signing secrets in documentation, source code, or a public repository. The example values above are placeholders. Restart the relevant development server after changing an environment file.

> **Existing environment files:** This repository currently tracks `server/.env` and `mobile/.env`. The ignore rules do not untrack files that are already committed. Review their contents before sharing the repository; if either contains real credentials, rotate those credentials and remove the files from Git tracking and history.

## 🚀 Run locally

Install and start the API in one terminal:

```sh
cd server
npm ci
npm run dev
```

The API listens on port `5000` by default. Check that it is running at `http://localhost:5000/health`; it should return a JSON status response.

In a second terminal, install and start the Expo app:

```sh
cd mobile
npm ci
npm start
```

Use the Expo terminal options to open the app in a simulator, emulator, or web browser, or scan the QR code with Expo Go. When connecting from a physical device, make sure `mobile/.env` uses your computer's LAN IP as described above.

## 🧪 Verify the code

Run the TypeScript checks from each project directory:

```sh
# From server/
npx tsc --noEmit -p tsconfig.json

# From mobile/
npx tsc --noEmit -p tsconfig.json
```

## 🔌 API overview

The API base URL is the value configured as `EXPO_PUBLIC_API_URL`.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Check API availability |
| `POST` | `/api/auth/signup` | Request a signup OTP |
| `POST` | `/api/auth/login` | Request a login OTP |
| `POST` | `/api/auth/verify-otp` | Verify an OTP and receive an auth token |
| `GET` | `/api/loans` | List the signed-in user's loans |
| `POST` | `/api/loans` | Add a loan |
| `PATCH` | `/api/loans/:id/repay` | Mark a loan as repaid |
| `GET` | `/api/summary` | Get lending totals |

Loan and summary endpoints require the token returned by OTP verification.

## 🛠️ Troubleshooting

- **Database connection fails:** Confirm PostgreSQL is running, the `miniledger` database exists, the schema has been applied, and `DATABASE_URL` matches your local credentials.
- **The app cannot reach the API:** Check the API's `/health` endpoint from the computer, then confirm `EXPO_PUBLIC_API_URL` uses the correct host for your simulator or phone. Verify both devices are on the same network and that the firewall allows the API port.
- **The API reports a missing secret:** Confirm `server/.env` contains `JWT_SECRET`, then restart the API.
- **The app cannot find environment changes:** Stop and restart Expo after editing `mobile/.env`.
- **OTP verification fails:** In local development, read the mock OTP from the terminal running the API.
