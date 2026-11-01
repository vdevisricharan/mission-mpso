# MISSION MPSO — Content Quality & Verification Pipeline

## 1. Content Mandate
The platform serves candidates preparing for a competitive government recruitment exam. Fabricated questions, wrong mathematical formulas, or unverified exam rumors can jeopardize a student's preparation.

Therefore, MISSION MPSO enforces a strict 7-stage Content Quality Lifecycle:

```
[Official Syllabus Annexure-II / Textbook]
                  │
                  ▼
          1. Draft Content
                  │
                  ▼
    2. Deterministic Validation (StatisticsValidator)
                  │
                  ▼
       3. Bilingual Translation Review (Telugu & English)
                  │
                  ▼
        4. Administrative Inspection
                  │
                  ▼
         5. Approved for Bank
                  │
                  ▼
    6. Assessment Scheduling (Practice / Mock)
                  │
                  ▼
     7. Spaced Repetition Reinforcement
```

---

## 2. Numerical Question Quality Rules
For Degree Statistics (Paper II):
- Every question with numerical calculation must pass through `StatisticsValidator`.
- All 4 options must be distinct numbers; no duplicates allowed.
- Single unambiguous correct option matching the mathematical formula.
- Rounding tolerances must be explicitly recorded (default \(\pm 0.01\)).
- Misleading or arbitrary trick questions without standard textbook citations are rejected.

---

## 3. Current Affairs Verification (Paper I)
- Current affairs items must include:
  - Event date vs Publication date
  - Official government department or reputable publisher citation
  - Key exam takeaways in Telugu
  - Administrative verification badge before entering practice tests.
