# Engineering Manifest & Protocol (claude.md)

## 1. System Philosophy & Anti-Entropy Guardrails
This project strictly rejects disorganized, fragmented implementation ("spaghetti code"). To maintain long-term architectural stability across a multi-language ecosystem, every generation, refactor, and architectural decision must adhere to a modular, decoupled, and strictly typed paradigm. 

No code is to be written without establishing its structural boundary and data contract first.

---

## 2. Core Technology Stack
You must strictly adhere to this full-stack architecture. Do not suggest alternative frameworks, language patterns, or unvetted dependencies unless explicitly requested.

* **Frontend Framework:** Next.js (App Router, TypeScript)
* **Styling & UI:** Tailwind CSS
    * *Design Aesthetic:* Professional, high-fidelity, high-tech enterprise dashboard design. Utilize dark mode defaults, clean layouts, crisp typography, subtle glowing borders, and smooth CSS micro-interactions for active state changes.
* **Backend Nodes:** Dual-Engine Architecture (Python & Go)
    * *Python (FastAPI / Flask):* Utilized for heavy AI orchestrations, agentic workflows, multi-step LLM routing, and complex data processing.
    * *Go (Golang):* Utilized for high-performance microservices, raw concurrent throughput, custom execution engines, and utility binaries.
* **Environment & Tooling:** Linux/Unix CLI-first paradigms. Clean execution environments optimized for modern AI-native IDEs, automated repository contexts, and containerized workflows.

---

## 3. The 7-Phase Development Workflow Loop
All engineering tasks must explicitly cycle through these 7 phases. Never skip steps, omit validation, or jump straight to implementation.

  [ Think ] ➔ [ Plan ]
      ▲            ▼
 [ Reflect ]   [ Build ]
      ▲            ▼
   [ Ship ] ◄─ [ Test ] ◄─ [ Review ]

1. **Think:** Deeply analyze the core problem, edge cases, underlying data structures, and cross-service architectural implications before editing files.
2. **Plan:** Draft an explicit, step-by-step implementation blueprint. Define strict API contracts, database schemas, state mutations, and system impacts.
3. **Build:** Implement clean, typed, modular, and idiomatic code adhering to the established Next.js, Go, or Python paradigms.
4. **Review:** Conduct rigorous code self-analysis. Audit for memory leaks, performance bottlenecks, concurrency race conditions, type safety, and security liabilities.
5. **Test:** Validate inputs, outputs, error states, boundary conditions, and end-to-end user journeys. Ensure failure domains are gracefully handled with meaningful error messaging.
6. **Ship:** Deploy stable, cleanly committed, and self-documenting code ready for production traffic and active workflow orchestration.
7. **Reflect:** Post-deployment audit. Analyze performance metrics, identify technical debt introduced, evaluate throughput under load, and update context files for the next iteration loop.

---

## 4. Code & Architectural Standards

### Separation of Concerns & State
* Keep the Next.js frontend strictly decoupled from heavy backend workflow orchestration. 
* Use Next.js for client-side state management, real-time UI component streaming, and presentation.
* All backend systems (FastAPI/Flask/Go) must communicate via explicit REST APIs, streaming WebSockets, or high-throughput gRPC channels. Every single endpoint must be documented.

### Strict Typing & Validation
* **Frontend:** Strict TypeScript interfaces. Absolutely zero `any` types allowed.
* **Python:** Mandatory type hinting and Pydantic models for request/response validation.
* **Go:** Strict, idiomatic struct definitions with explicit JSON/database tags.

---

## 5. AI Interaction Protocol & Enforcement
* **Context Realization:** Acknowledge your role handling an advanced, production-grade SaaS/PaaS ecosystem. 
* **Execution Style:** Provide direct, complete, production-ready code blocks. Avoid placeholders, truncated code snippets, code ellipses (`// ...`), or `// TODO: implement later` comments. Write out the full code needed to complete the task.
* **Loop Phase Enforcer:** At the absolute beginning of every response, you must explicitly state which phase of the **Think ➔ Plan ➔ Build ➔ Review ➔ Test ➔ Ship ➔ Reflect** loop you are currently executing. Do not move to the next phase until the current one is verified.