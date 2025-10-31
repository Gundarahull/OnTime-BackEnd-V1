# Step-by-step verification pipeline (driver + car) — full checklist

Nice — below is a practical, production-ready breakdown you can implement **step by step**. I’ll show what to collect, what automated checks to run, what to escalate to manual review, what to display to passengers, and common edge cases.

---

## Verification levels (quick view)

* **Basic** — phone + email + identity doc (signup).
* **Standard** — Driving License (DL) + Registration Certificate (RC) + Insurance.
* **Full** — Standard + liveness/face match + background check + vehicle inspection.
  Platforms can show badges for each level (e.g., Verified, Verified+, Trusted).

---

## 1) Signup & consent (first touch)

* Collect: full name, mobile (OTP), email (verification), city.
* Present clear consent: user agrees to document checks, background verification, and data storage per platform policy.
* Create a `driver_profile` record and return a verification workflow token to the driver.

---

## 2) Document upload UI + requirements

* Ask driver to upload (front + back where applicable):

  * Driving License (DL) — photo(s) or PDF.
  * Vehicle RC (Registration Certificate).
  * Insurance policy document (policy page with number & validity).
  * Optional: Aadhaar / PAN / Passport (identity KYC) — only if needed.
* Photo checklist in UI: good lighting, readable text, no glare; limit file size & accepted formats (JPEG/PNG/PDF).
* Require timestamped selfie (see Step 4).

---

## 3) Automated document parsing & basic validation

* Run OCR on each uploaded doc to extract fields (name, DL number, expiry, RC number, chassis/VIN, registration plate, insurance policy number, insurance expiry).
* Validate: required fields present, expiry dates valid (not expired), formats comply.
* If OCR fails or key fields missing → prompt re-upload with tips.
* Save raw images encrypted; store extracted text in secure DB with an audit trail.

---

## 4) Liveness check & face match

* Ask driver for a short liveness flow (selfie + random gestures or short video).
* Compare captured face to the photo on the DL/RC using face-match model.
* Outcomes: `match_pass`, `match_fail`, `uncertain`.

  * `match_pass` → proceed.
  * `uncertain/fail` → allow 1–2 reattempts, then escalate to manual review.
* Record confidence score and evidence (audit).

---

## 5) Government data cross-checks (automated)

* Integrate with **Parivahan / DigiLocker** or insurer APIs where possible:

  * Verify DL number and validity.
  * Verify RC details (owner name, registration number, vehicle class).
  * Verify insurance policy validity with insurer API or check policy number + expiry from uploaded doc.
* If an API lookup returns no match → flag for manual review and show an informative error to driver.

---

## 6) Plate / RC photo cross-validation

* Require photos of the vehicle: front (plate visible), rear, odometer, interior, VIN/chassis (if visible).
* Use plate OCR to read plate and compare with RC registration number.
* Confirm vehicle model/color from RC matches uploaded photos and user-provided metadata.

---

## 7) Ownership & consent checks

* If the RC owner ≠ driver: require owner consent (digital signature or owner KYC).

  * Owner can verify via OTP on their registered mobile or via DigiLocker share.
* For rental or leased vehicles: require rental agreement and ensure insurance allows ride-sharing/cost-sharing.
* If driver is commercial (has commercial permit), capture permit details — may require different platform handling (or reject based on model).

---

## 8) Insurance & PUC verification

* Confirm insurance is active (policy number found / uploaded doc valid).
* Minimum requirement: valid third-party insurance (platform may recommend comprehensive).
* Require PUC certificate if local regulations require it.
* If insurance expired / non-existent → block listing until resolved.

---

## 9) Background check / police verification (consent required)

* Options: quick in-house screening (ID against watchlists) OR full third-party background check.
* Collect consent and any extra identifiers required.
* Check for serious criminal records, active warrants, or past safety incidents.
* If a match or red flag → escalate to manual review and block until cleared.

---

## 10) Vehicle condition & safety inspection (optional / for higher trust)

* For Full verification, require an inspection certificate from an approved garage / mechanic: brake lights, tires, seat condition, airbags (if any), working seat belts, odometer reading.
* Or require recent service record / fitness certificate for older vehicles.
* Platforms may require vehicle age limit (e.g., <12–15 years) depending on policy.

---

## 11) Risk scoring & badge issuance

* Compute `risk_score` using weighted factors: document matches, liveness score, background check result, vehicle inspection, driver ratings (if any), number of completed rides.
* Map score to `verification_level` and issue badges: `Basic`, `Verified`, `Trusted`. Display these on driver profile for passengers.
* Store detailed verification history for audit (who reviewed, timestamps, notes).

---

## 12) Manual review queue & workflow

* Cases landing in manual review: OCR fails, face mismatch, government API mismatch, flagged background item, owner consent missing, expired docs.
* Reviewer UI should show all docs side-by-side, system-extracted fields, logs, and allow actions: Approve / Request reupload / Reject / Ask for more docs.
* Keep a clear rejection reason code; allow driver to appeal and re-submit.

---

## 13) Pre-ride checks (safety & passenger confidence)

* Before a passenger confirms booking, show: driver photo, verification badges, DL expiry date (not full number), RC masked (last 4 of reg no), insurance expiry date, driver rating and number of trips.
* Provide option for passenger to request driver to send a live selfie before boarding (one-time) OR verify live location & ETA.
* Show plate number and car model; require driver to confirm departure time and route.

---

## 14) Ongoing monitoring & re-verification

* Monitor for suspicious behavior: multiple accounts tied to same docs, frequent document swaps, inconsistent plate numbers.
* Re-check documents near expiry; prompt driver to reupload when DL/insurance/RC nearing expiry.
* Random audits: require re-liveness or on-site inspection for a random sample of drivers.

---

## 15) Incident handling & insurance claims

* Require drivers to carry originals of DL & RC while driving (platform T\&Cs).
* Provide in-app “Report an incident” flow with trip metadata (route, timestamps, photos).
* Keep an audit trail and help driver/passenger open insurance claims; retain docs for legal/regulatory needs.

---

## 16) Data, privacy & legal considerations

* Obtain explicit user consent for background checks and data storage.
* Minimize storing highly sensitive data (Aadhaar raw copy): prefer DigiLocker tokens or hashed identifiers.
* Encrypt documents at rest and in transit; RBAC for internal access; audit logs for every access.
* Define retention policy (e.g., keep verification records for X years for legal/insurance reasons) and offer data deletion where legally possible.
* Keep a DM/Legal contact for RTO/police/insurance subpoena requests.

---

## 17) Edge cases & policy rules (examples)

* **Owner not driver**: need owner consent; without it, block listing.
* **Rented/leased vehicles**: require rental agreement + insurer confirmation that ride-sharing is allowed.
* **Commercial vehicle**: if RC shows commercial/transport category, treat differently (may require permits/licenses).
* **New driver with no rides**: allow limited listings initially with lower seat caps or require accompaniment (buddy system) until trust is built.

---

## 18) What to show passengers (UI trust signals)

* Verification badges (Basic / Standard / Full).
* DL: verified ✔ (expiry).
* RC: verified ✔ (masked reg no).
* Insurance: valid until dd-mm-yyyy.
* Driver rating and completed rides count.
* Live ETA & real-time location while ride is active.
* Emergency button / share trip link.

---

## 19) Data model snippet (example fields)

```
driver_verification {
  driver_id
  phone_verified: bool
  email_verified: bool
  documents: {
    dl: { number, name_on_dl, expiry, ocr_text, image_url (encrypted), status }
    rc: { reg_no, owner_name, vehicle_model, chassis_no, image_url, status }
    insurance: { policy_no, insurer, expiry, image_url, status }
  }
  selfie_match_score: float
  liveness_status: enum{passed,failed,uncertain}
  background_check: { status, vendor, report_ref }
  vehicle_photos: [url,...]
  risk_score: float
  verification_level: enum{basic,standard,full}
  badges: [...]
  manual_review_notes: text
  status: enum{submitted,auto_verified,manual_verified,rejected}
  timestamps: { submitted_at, verified_at, expires_at }
}
```

---

## 20) Quick operational rules & best practices

* **Automate** as much as possible (OCR + API check + liveness) to keep friction low.
* **Escalate** only ambiguous/fraud/high-risk cases to humans.
* **Be transparent** in the UI: show why verification failed and how to fix it.
* **Limit sensitive storage** and favor government verified shares (DigiLocker) where possible.
* **Document Terms**: driver must confirm rides are cost-sharing only (cap the contribution per passenger) and must carry originals.

---

If you want, I can now:

* produce a **flowchart** of this pipeline, or
* write a **sample API contract** (`/onboard/driver`, `/upload/doc`, `/verification/status`) and a sample `driver_verification` DB schema in SQL/JSON, or
* draft the **manual reviewer UI** layout and rejection reasons list.

Which one should I do next?
