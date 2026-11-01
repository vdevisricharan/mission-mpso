# MISSION MPSO — Grounded AI Tutoring & RAG Architecture

## 1. System Mandate
The AI Tutor in MISSION MPSO must behave like an experienced, patient, respectful Telugu-medium lecturer. It prioritizes academic correctness, avoids hallucination, and grounds every explanation in approved curriculum knowledge.

---

## 2. 7 Pedagogical Tutor Modes

| Mode ID | Telugu Name | English | Teaching Behavior |
|---|---|---|---|
| `teach_me` | **బోధించు** | Teach Me | Explains concept from the beginning: What is it, why important, simple intuition, worked example, formula, short check. |
| `explain_simply` | **సరళంగా వివరించు** | Explain Simply | Rewrites complex academic jargon into daily-life analogies and intuitive Telugu without losing precision. |
| `solve_together` | **కలిసి సాధిద్దాం** | Solve Together | Guides numerical problems step by step. Never reveals the final answer immediately; prompts the student for intermediate steps. |
| `give_another_example` | **మరో ఉదాహరణ** | Give Another Example | Retrieves or produces an additional verified degree-standard worked example with full step-by-step arithmetic. |
| `test_understanding` | **అవగాహన పరీక్షించు** | Test My Understanding | Asks a targeted single-concept question and evaluates student response with immediate feedback. |
| `explain_mistake` | **నా తప్పును వివరించు** | Explain My Mistake | Diagnoses why an answer was wrong, identifies misconceptions (formula vs calculation vs concept), and teaches the correct path. |
| `quick_revision` | **సత్వర పునశ్చరణ** | Quick Revision | Compact summary of key formulas, conditions, and core takeaways from verified course material. |

---

## 3. Mathematical Notation in Telugu Context
- Internationally standardized mathematical notation is preserved using **KaTeX**:
  - Arithmetic Mean: \(\bar{x} = \frac{\sum x_i}{n}\)
  - Standard Deviation: \(\sigma = \sqrt{\frac{\sum (x_i - \bar{x})^2}{n}}\)
  - Mode Empirical: \(\text{Mode} = 3(\text{Median}) - 2(\text{Mean})\)
  - Bayes' Theorem: \(P(E_i|A) = \frac{P(E_i)P(A|E_i)}{\sum P(E_j)P(A|E_j)}\)
  - Correlation: \(r = \pm\sqrt{b_{yx} \cdot b_{xy}}\)
- Every mathematical symbol is defined individually in Telugu (e.g. \(\bar{x}\) = అంకమధ్యమం, \(\sigma\) = ప్రామాణిక విచలనం).

---

## 4. Multi-Provider LLM Orchestration & Offline Engine

1. **Grounded Pedagogical Fallback (100% Offline)**:
   - When no external API keys are configured, the platform utilizes `TeluguAITutorEngine`, drawing directly from approved lesson definitions, formulas, and worked examples.
   - Zero crash risk; zero external dependency blocker.
2. **Cloud LLM Passthrough**:
   - When `GEMINI_API_KEY` or `OPENAI_API_KEY` is supplied, incoming queries are orchestrated with strict grounding prompts injecting verified syllabus texts and formulas into the context window.
   - Guardrails prevent prompt injection and prohibit hallucinated cutoff scores or fabricated exam rules.
