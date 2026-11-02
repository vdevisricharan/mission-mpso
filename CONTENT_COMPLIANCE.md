# MISSION MPSO — Educational Content Compliance & Ethical Sourcing Policy
**Notification:** TGPSC 07/G/ES/2026 (Mandal Planning & Statistical Officer / ASO)  
**Governing Standard:** Lawfully accessible, strictly attributed, copyright-compliant educational content ingestion.

---

## 1. Ethical Principles & Statutory Boundaries

MISSION MPSO prepares Telugu-speaking candidates for a prestigious state government service. A foundation of legal and educational integrity is mandatory.

The system adheres strictly to the following binding content sourcing mandates:

### 1. No Circumvention of Technical Controls
- **Never bypass paywalls or subscription barriers.**
- **Never bypass CAPTCHAs, biometric verification, or authentication gates.**
- **Never access private or password-protected examination candidate dashboards.**
- **Never harvest personal candidate information (hall ticket numbers, applicant names, phone numbers).**

### 2. Respect for `robots.txt` and Domain Terms
- All crawl requests check domain `robots.txt` files and rate-limit headers.
- If a domain disallows automated scanning, `crawlingAllowed` is marked `false`, and automated requests are completely blocked.
- Per-domain rate limits (5 to 12 requests per minute) and exponential backoff are enforced to prevent server overload.

### 3. Prohibition on Bulk-Copying Commercial Question Banks
- Commercial coaching websites, paid test-series portals, and copyrighted question banks are **never scraped or bulk-copied**.
- Third-party references (Tier 5) are restricted to **metadata and link citations only** (`metadata_and_citation_only`). Full text is not stored.

### 4. Permitted Sources Only
Content is acquired exclusively through:
1. **Official Commission Public Releases:** TGPSC notifications, public syllabus PDFs, preliminary and final revised keys published for candidate information.
2. **Open Government Data:** Directorate of Economics & Statistics reports, Socio-Economic Outlook surveys, MoSPI national statistics releases.
3. **Open Educational Resources (OER):** University textbooks licensed under Creative Commons (`CC-BY`, `CC-BY-SA`).
4. **Authorized Administrative Uploads:** Verified question banks supplied by subject matter experts.
5. **Genuinely Original Syllabus Practice Questions:** Synthesized from official syllabus concepts for underrepresented topics.

---

## 2. Prohibition on Deceptive Rewording

> [!WARNING]
> The engine **never merely rewords** a copyrighted question from a private publisher to evade copyright restrictions.

Where adequate open or official questions are not available for a syllabus unit, the engine generates **genuinely original questions** derived directly from foundational statistical principles and official textbooks (e.g., standard definitions, original datasets for mean/variance, freshly computed binomial distributions).

---

## 3. Strict Provenance & Authenticity Labeling

A question from another state examination (e.g., APPSC, UPSC ISS, or earlier TSPSC JSO) must **never be mislabeled as an MPSO PYQ**.

Every question record maintains:
- `isAuthenticPyq`: `true` ONLY if verified from official TGPSC/TSPSC MPSO/ASO examination notifications.
- `examinationName`: e.g. "TGPSC Mandal Planning & Statistical Officer / ASO (2018)"
- `examAuthority`: "TGPSC" / "TSPSC"
- `originalQuestionNumber`: Number in master booklet.
- `bookletSeries`: Series A, B, C, or D.
- `answerKeyType`: `preliminary` | `final` | `revised_final`
- `sourceUrl` and `attributionText`: Visible to students and administrators.

---

## 4. Unverified Third-Party Paper Quarantine

Third-party PDFs claiming to be "MPSO 2017 Paper" or "ASO 2018 Original Paper" without verifiable official notifications or paper codes are placed in `unverified` status and **excluded from authentic PYQ mock tests**.
