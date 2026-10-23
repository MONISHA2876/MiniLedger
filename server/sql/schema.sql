CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    phone VARCHAR(15) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE otp_verifications (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(15) NOT NULL,
    otp_hash VARCHAR(64) NOT NULL,
    purpose VARCHAR(10) NOT NULL
        CHECK (purpose IN ('signup', 'login')),
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);