Nice — let’s deep-dive into **Step 1 — Signup & Consent (first touch)** and make it fully implementation-ready. I’ll give you UI copy, fields & validations, API contracts (requests/responses), DB schema, security/privacy rules, flows (happy & edge cases), and operational knobs (OTP limits, captcha, audit). After this you’ll be able to implement the signup endpoint and produce the verification workflow token that drives the rest of onboarding.

# Goal

Get a minimal, trusted identity anchor for the driver and a legally-sound consent record that lets you continue KYC/document verification flows. Keep friction low while collecting what you need to proceed with automated checks later.

# UX flow (user-facing)

1. Launch “Become a Driver” → show short form:

   * Headline: “Create driver account — quick & secure”
   * Inputs: Full name, Mobile number, City, Email (optional but recommended)
   * CTA: “Send OTP”
2. Send OTP (SMS) → inline OTP entry (6 digits). Show countdown + “Resend in 30s”.
3. After phone verification show consent screen (checkboxes + short bullets + links):

   * “I agree to the Terms of Service and Privacy Policy.” (required)
   * “I consent to background checks, document verification and storing my documents for verification and claims.” (required)
   * “I consent to share verification results with law enforcement/insurers when required.” (optional but strongly recommended)
   * Button: “Start verification”
4. On success: create `driver_profile` and return `verification_workflow_token`. Show UI: “Account created — you’re ready to upload documents.”

**UI copy suggestions (concise):**

* OTP prompt: “Enter the 6-digit code sent to +91 XXXXXX”
* Consent summary: “We’ll verify your Driving License, RC & Insurance to keep riders safe. Documents are encrypted. Read full policy.”

# Data to collect at signup (minimal)

* `full_name` — string, 2..100 chars
* `phone` — E.164 (India) e.g. `+91XXXXXXXXXX` (unique)
* `phone_verified` — boolean
* `email` — optional, validate format, unique if provided
* `city` — picklist from supported cities
* `preferred_language` — optional
* `device_fingerprint` — optional (for fraud detection)
* `consent` object (see below)

# Consent record (must be stored)

Store a consent record for legal/traceability. Fields:

* `consent_given` — boolean
* `consent_version` — string (e.g., `v2025-09-01`)
* `consent_timestamp` — UTC ISO8601
* `consent_ip` — IP address when accepted
* `consent_user_agent` — user agent string
* `consent_scope` — array (e.g., `["KYC", "background_check", "document_storage", "share_with_insurer"]`)
* `policy_hash` — SHA256 of the policy text the user saw (verifies exact policy version)
  Keep this immutable and auditable.

# Verification workflow token

Give the client a token after signup to continue onboarding. Design options:

* JWT (signed, short-lived, stateless): claims = `jti`, `driver_id`, `workflow_id`, `step` (e.g., `signup_completed`), `exp` (24 hours). Sign with HS256 or RS256.
* Opaque token with DB-backed session: store `workflow_id` in DB mapped to token.

Recommendation: issue **two tokens**:

* `workflow_token` (short-lived JWT, 24h) — used to upload docs / query status.
* `refresh_workflow_token` (opaque, 30 days) — only for token refresh.

Sample JWT claims:

```json
{
  "iss": "your-app",
  "sub": "driver:1234",
  "jti": "wf_987654",
  "step": "signup_completed",
  "scopes": ["upload_docs","poll_status"],
  "iat": 1690000000,
  "exp": 1690086400
}
```

# API contract (example)

### 1) Request signup

`POST /api/v1/drivers/signup`
Request body:

```json
{
  "full_name": "Ravi Kumar",
  "phone": "+919876543210",
  "email": "ravi@example.com",
  "city": "Bengaluru",
  "device_fingerprint": "abc123" // optional
}
```

Response (accepted — OTP sent):

```json
{
  "status": "otp_sent",
  "phone": "+919876543210",
  "otp_expires_in": 300,
  "retry_after_seconds": 30
}
```

Errors:

* `409` if phone already exists (return `existing_driver_id` masked)
* `400` for invalid phone/email

### 2) Verify OTP

`POST /api/v1/drivers/verify-otp`
Request:

```json
{
  "phone": "+919876543210",
  "otp": "123456",
  "device_fingerprint": "abc123"
}
```

Response (on success):

```json
{
  "status": "verified",
  "driver_id": "drv_1234",
  "workflow_token": "eyJhbGciOiJ...",       // JWT short-lived
  "refresh_workflow_token": "r_tok_abc123"
}
```

Errors:

* `401` invalid/expired OTP
* `429` too many attempts

### 3) Submit consent & start verification

`POST /api/v1/drivers/{driver_id}/consent`
Request:

```json
{
  "consent_version": "v2025-09-01",
  "consent_scope": ["KYC","background_check","doc_storage"],
  "policy_hash": "sha256:abcd1234..."
}
```

Response:

```json
{
  "status": "consent_recorded",
  "verification_workflow_token": "eyJhbGciOiJ..." // if not already returned
}
```

### 4) Query status

`GET /api/v1/drivers/{driver_id}/verification-status`
Response:

```json
{
  "driver_id": "drv_1234",
  "signup_completed": true,
  "phone_verified": true,
  "consent_given": true,
  "current_step": "awaiting_documents",
  "verification_level": "basic"
}
```

# `driver_profile` DB schema (simplified SQL)

```sql
CREATE TABLE drivers (
  id              TEXT PRIMARY KEY, -- drv_xxx
  full_name       TEXT NOT NULL,
  phone           TEXT UNIQUE NOT NULL,
  phone_verified  BOOLEAN DEFAULT FALSE,
  email           TEXT UNIQUE,
  city            TEXT,
  device_fingerprint TEXT,
  signup_completed BOOLEAN DEFAULT FALSE,
  consent_version  TEXT,
  consent_timestamp TIMESTAMP,
  is_blocked       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

# Audit & logs

* Create `verification_audit_logs` table: store every action (otp\_sent, otp\_verified, consent\_signed, token\_issued) with actor, IP, user\_agent, timestamp.
* Store all uploaded images/documents **encrypted** and record storage locations in DB, not the raw file content in logs.

# Security & privacy (non-negotiable)

* Use TLS everywhere.
* Encrypt PII/Docs at rest (AES-256). Use KMS-managed keys.
* Hash phone/email in analytic tables if not required in plaintext.
* Do **not** store raw Aadhaar images unless necessary. Prefer DigiLocker integration or store only a DigiLocker token or hashed identifier.
* Keep consent evidence (IP, UA, policy hash) immutable for compliance.
* Implement RBAC for internal reviewer access; access must be logged with reason.
* Minimum retention policy: keep verification records for at least 3–7 years for insurance/legal claims (consult legal). Offer a deletion flow compliant with law but preserve records required by law.

# OTP & abuse prevention

* OTP: 6 digits, TTL 5 minutes.
* Limit: max 5 OTP sends per phone per hour; 10 OTP attempts per phone per day. Return `429` with `Retry-After`.
* Rate-limit per IP + device fingerprint + phone.
* After N failed attempts, require CAPTCHA on signup.
* SMS providers: track delivery receipts; handle non-delivery gracefully.

# Duplicate account & merge strategies

* If phone exists, respond with `409` and recommend account recovery (send login OTP).
* If email exists but phone new, prompt “We found an account with this email — link accounts?” with secure flow (email OTP).
* Detect same person via: phone match, email match, device fingerprint, similar name + same RC later — escalate to manual review for possible fraud.

# Edge cases & error handling

* Phone not reachable: allow email verification fallback (less preferred).
* User abandons flow: keep `workflow_token` valid for short window (24h) so they can resume.
* User revokes consent: provide flow to withdraw consent; stop further background checks but keep required records to comply with law.
* Incomplete signup: remove ephemeral data after N days (e.g., 7 days) if user doesn’t proceed.

# Monitoring & metrics

Track:

* Signup conversion (%) — visits → OTP sent → OTP verify → consent
* OTP delivery success rate
* Duplicate rejections / fraud flags
* Time to complete consent
* Error rates on Parivahan/DigiLocker calls (later steps)

# Example Node.js/Express pseudo implementation (very small)

```js
// POST /api/v1/drivers/signup
app.post('/api/v1/drivers/signup', async (req, res) => {
  const { full_name, phone, email, city, device_fingerprint } = req.body;
  if (!isValidPhone(phone)) return res.status(400).send({ error: 'invalid_phone' });
  if (await phoneExists(phone)) return res.status(409).send({ error: 'phone_exists' });

  const driverId = 'drv_' + nanoid();
  await db.insert('drivers', { id: driverId, full_name, phone, email, city, device_fingerprint });
  const otp = await sendOtp(phone); // integrate with SMS provider
  await db.insert('otp_logs', { driver_id: driverId, otp_hash: hash(otp), expires_at: Date.now()+300000 });
  res.send({ status: 'otp_sent', otp_expires_in: 300 });
});
```

(Production: never log OTPs; use HSM/KMS; add idempotency keys & rate limiting.)

# Legal / policy copy (sample short consent blurb)

> I agree to the Terms & Privacy Policy. I authorize \[Platform] to verify my identity, Driving License and vehicle documents, run background checks and store verification documents securely. I understand this data will be used to assess my eligibility to provide rides and may be shared with insurers or law enforcement where required by law.

Link the full T\&Cs and Privacy policy (show them in a modal or new page) and require the user to open/read them OR show a summary with “Read full policy” link.

---

That’s a complete, production-minded run at Step 1. Want me to:

* generate the exact DB migration SQL and full JSON schema for `driver_profile` + `consent`?
* or move to **Step 2: Document upload UI + requirements** and design the upload endpoints & OCR flow next?
