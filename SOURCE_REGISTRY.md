# MISSION MPSO — Source Registry & Tier Catalog
**Target Notification:** TGPSC 07/G/ES/2026 (Mandal Planning & Statistical Officer / ASO)  
**Governing Standard:** Lawfully accessible educational resources, transparent provenance, and strict licensing enforcement.

---

## 1. Source Trust Tiers

Every monitored data source is assigned an auditable Trust Tier and explicit reuse permissions.

| Tier | Category | Description | Permitted Reuse | Rate Limit |
|---|---|---|---|---|
| **Tier 1** | Official Commission | TGPSC Portal, Web Notes, Preliminary & Final Answer Keys | Full Question Reproduction (Fair Use Educational) | 5 req / min |
| **Tier 2** | Official Government | Directorate of Economics & Statistics, MoSPI, RBI, Socio Economic Outlook | Original Derivation & Statistical Modeling | 8 req / min |
| **Tier 3** | Academic OER | OpenStax, University Degree Statistics Open Educational Resources | Full Question Reproduction (CC-BY / CC-BY-SA) | 12 req / min |
| **Tier 4** | Related Exam Papers | Junior Statistical Officer, Statistical Officer, UPSC ISS Papers | Full Reproduction with Strict Historical Provenance | 8 req / min |
| **Tier 5** | Educational References | News editorials, legal reference sites, curated portals | Metadata & Citation Only (No Bulk Full Text) | 10 req / min |

---

## 2. Default Seed Registry Catalog

### Tier 1: Official Examination Commission
1. **TGPSC Official Commission Portal**
   - **ID:** `src_tgpsc_official`
   - **URL:** `https://websitenew.tgpsc.gov.in/`
   - **License:** `official_tgpsc_public_notice`
   - **Frequency:** Daily (06:00 AM IST)
   - **Monitored Scope:** Recruitment notifications, examination scheme, official syllabus corrigenda, web notes.

2. **TGPSC / TSPSC Question Paper & Answer Key Archive**
   - **ID:** `src_tgpsc_archives`
   - **URL:** `https://websitenew.tgpsc.gov.in/previous-question-papers`
   - **License:** `official_tgpsc_public_notice`
   - **Frequency:** Daily
   - **Monitored Scope:** Preliminary keys, final revised keys, cancelled questions, master question booklets.

### Tier 2: Official Government & Statistical Bodies
3. **Telangana Directorate of Economics & Statistics (DES)**
   - **ID:** `src_ts_des`
   - **URL:** `https://ecostat.telangana.gov.in/`
   - **License:** `government_open_data`
   - **Frequency:** Daily
   - **Monitored Scope:** State income estimates, GSDP, CPI/WPI indices, agriculture census, statistical handbook.

4. **Telangana Socio-Economic Outlook & Planning Department**
   - **ID:** `src_ts_socio_economic_outlook`
   - **URL:** `https://planning.telangana.gov.in/`
   - **License:** `government_open_data`
   - **Frequency:** Weekly
   - **Monitored Scope:** Annual socio-economic indicators, state welfare policies (Rythu Bharosa, Mission Bhagiratha, irrigation progress).

5. **MoSPI — Ministry of Statistics and Programme Implementation (GoI)**
   - **ID:** `src_mospi_goi`
   - **URL:** `https://www.mospi.gov.in/`
   - **License:** `government_open_data`
   - **Frequency:** Weekly
   - **Monitored Scope:** National Accounts Statistics, Index of Industrial Production (IIP), Consumer Price Index (CPI), National Statistical Commission (NSC) standards.

### Tier 3: Standard Academic Degree Statistics Resources
6. **OpenStax & University Degree Statistics Resources (OER)**
   - **ID:** `src_oer_statistics`
   - **URL:** `https://openstax.org/details/books/introductory-statistics`
   - **License:** `creative_commons_by_sa`
   - **Frequency:** Weekly
   - **Monitored Scope:** Standard university-level statistics problem sets: probability theorems, distribution moments, hypothesis testing, regression.

### Tier 4: Related Government Examination Papers
7. **TGPSC / TSPSC Related Statistics Examinations Archive**
   - **ID:** `src_tgpsc_related_exams`
   - **URL:** `https://websitenew.tgpsc.gov.in/archives-statistical-services`
   - **License:** `official_tgpsc_public_notice`
   - **Frequency:** Weekly
   - **Monitored Scope:** Junior Statistical Officer (JSO), Statistical Officer, Divisional Accounts Officer papers.  
   - **Mandatory Rule:** Provenance must explicitly state actual exam name and year. **Never mislabeled as MPSO PYQ.**

### Tier 5: Monitored Educational References
8. **Telangana Development & Governance Reference Feed**
   - **ID:** `src_telangana_today_ca`
   - **URL:** `https://telanganatoday.com/`
   - **License:** `restricted_metadata_only`
   - **Frequency:** Daily
   - **Monitored Scope:** Regional current affairs citations. Full text is not copied; only factual event metadata and links are maintained.

---

## 3. How to Register a New Source

To register an approved source via code or the Administrator Dashboard:

```typescript
import { SourceRegistryService } from "@/lib/pipeline/source-registry";

SourceRegistryService.registerSource({
  id: "src_custom_university_stats",
  name: "Kakatiya University B.Sc. Statistics OER Problem Sets",
  url: "https://example-university.edu/oer-statistics",
  sourceCategory: "academic_oer",
  trustTier: 3,
  licenseType: "creative_commons_by_sa",
  reusePermissions: "full_question_reproduction",
  crawlingAllowed: true,
  scanFrequency: "weekly",
  isActive: true,
  notes: "Verified syllabus overlap with STAT-01, STAT-02, STAT-05.",
});
```

Or visit the **Administrator CMS -> ప్రశ్నల ఇంటెలిజెన్స్ -> వనరుల రిజిస్ట్రీ (Source Registry)** to toggle or inspect sources.
