-- Google Calendar connection for the operator dashboard.
--
-- The refresh token used to live in GOOGLE_REFRESH_TOKEN, which meant that every
-- time Google expired or revoked it the fix was: mint a new one by hand, edit a
-- Vercel environment variable, redeploy. Storing it here instead means
-- reconnecting is a button on the dashboard.
--
-- One row, ever. The check constraint enforces that rather than trusting the
-- code to remember.

CREATE TABLE IF NOT EXISTS operator_google_auth (
    id SMALLINT PRIMARY KEY DEFAULT 1,
    refresh_token TEXT NOT NULL,
    scope TEXT,
    -- Which Google account is connected, so the dashboard can say so. Never used
    -- to authenticate anything.
    account_email TEXT,
    connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT operator_google_auth_single_row CHECK (id = 1)
);

-- Reached only through the operator API, which gates on OPERATOR_PASSWORD and
-- uses the service role key, so row-level policies would never be consulted.
-- Enabled anyway so nothing is reachable if an anon key ever touches it.
ALTER TABLE operator_google_auth ENABLE ROW LEVEL SECURITY;
