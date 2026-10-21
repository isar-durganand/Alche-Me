# Alche-Me — Scientific Adventure & Virtual Chemistry Laboratory

> **Official Product Name:** Alche-Me  
> **Package Slug:** `alche-me`  
> **Status:** Phase 01 — Repository Audit & Foundation Baseline  
> **Curriculum Standard:** Engineering Chemistry (Course Code: `4.5CH101C00H`, MRIIRS BTech Syllabus & Laboratory Manual)  
> **Core Architecture:** React 19 + TypeScript + Vite + Tailwind CSS v4 + Vitest  

---

## 1. Executive Summary & Overview

**Alche-Me** is a scientifically rigorous, adventure-style chemistry learning platform. Built for undergraduate engineering students and science learners, Alche-Me bridges conceptual theory, molecular CAD/visualization, full-spectrum Mendeleev periodic exploration, and practical laboratory titration/analysis without relying on in-game generative AI hallucinations.

### Core Pillars
1. **Thematic Adventure Worlds:** 6 scientific exploration realms covering foundational atomic theory, molecular bonding, stoichiometry, and engineering chemistry practicals.
2. **Interactive Virtual 3D Laboratory:** 10 university-grade engineering chemistry experiments with simulated apparatus manipulation, precise measurement telemetry, calculations, and automated PDF lab reports.
3. **Mendeleev 118-Element Grid:** Complete periodic table with property heatmaps, atomic radii, Pauling electronegativities, and quantum subshell orbital filling diagrams ($\uparrow\downarrow$).
4. **Molecule Studio & Computational Chemistry:** 3D WebGL molecular visualizer (ball-and-stick, CPK, licorice, wireframe), VSEPR hydride presets, and RDKit force-field geometry optimization backend.
5. **Traceable Curriculum:** 100% mapped to the official MRIIRS Engineering Chemistry Laboratory Manual.

---

## 2. Vertical-Slice Prototype Audit & Asset Inventory

During the Phase 01 audit, the pre-existing vertical slice (`HomoLumo`) was audited and verified working. Its modules are cataloged and preserved to be integrated cleanly across subsequent delivery phases:

| Feature / Module | Prototype Status | Target Phase | Source Path / Origin |
|---|---|---|---|
| **Periodic Table (118 Elements)** | Verified / Production | Phase 05 | `HomoLumo/frontend/src/data/periodicTableData.ts` |
| **10 Engineering Lab Practicals** | Verified / Production | Phase 07 & 09 | `HomoLumo/frontend/src/components/LabSimulator.tsx` |
| **Syllabus VSEPR & Hydrocarbon Presets** | Verified / Production | Phase 05 & 08 | `HomoLumo/frontend/src/data/syllabusPresets.ts` |
| **3D Molecular Graphics Engine** | Verified / Production | Phase 08 | 3Dmol.js & Three.js PBR Viewer |
| **Viva Voce Assessment Engine** | Verified / Production | Phase 06 | `HomoLumo/frontend/src/components/VivaQuizModal.tsx` |
| **PDF Lab Report Generator** | Verified / Production | Phase 07 | `HomoLumo/frontend/src/utils/pdfExport.ts` |
| **RDKit MMFF94 / Orbital Backend** | Verified / Production | Phase 08 | `HomoLumo/backend/main.py`, `chem_engine.py` |
| **Design System & Shell** | Complete Baseline | Phase 01 & 02 | `Alche-Me/src/index.css`, `src/App.tsx` |
| **Domain Type Contracts** | Implemented | Phase 01 | `Alche-Me/src/domain/types/index.ts` |
| **Master Documentation & Roadmap** | Complete Baseline | Phase 01 | `Alche-Me/docs/` |

---

## 3. Official Lab Practicals Traceability (MRIIRS 4.5CH101C00H)

The platform virtualizes the 10 university engineering chemistry practicals:
1. **Experiment 01:** Determination of Hardness of Water using EDTA (Pages 5–8)
2. **Experiment 02:** Determination of Alkalinity of Water Sample (Pages 9–11)
3. **Experiment 03:** Determination of Dissolved Oxygen (DO) by Winkler's Method
4. **Experiment 04:** Conductometric Titration of Strong Acid with Strong Base
5. **Experiment 05:** Potentiometric Redox Titration (Estimation of $Fe^{2+}$ using $K_2Cr_2O_7$)
6. **Experiment 06:** Viscosity Index Determination of Lubricating Oil using Redwood Viscometer
7. **Experiment 07:** Proximate Analysis of Coal (Moisture, Volatile Matter, Ash)
8. **Experiment 08:** Determination of Flash Point and Fire Point using Pensky-Martens Apparatus
9. **Experiment 09:** Synthesis of Aspirin (Acetylsalicylic Acid)
10. **Experiment 10:** Preparation of Phenol-Formaldehyde Resin (Bakelite)

---

## 4. Getting Started & Commands for Beginners

### Prerequisites
- **Node.js**: v20+ (Tested on Node v24.20.0, npm 11.19.0)
- **Python**: 3.10+ (for optional computational backend)

### 1. Installation
Install project dependencies:
```bash
npm install
```

### 2. Development Server
Start the local development server:
```bash
npm run dev
```
Open your browser at `http://localhost:5174` (or the URL printed in terminal).

### 3. Run Automated Tests
Run unit and contract tests via Vitest:
```bash
npm test
```

### 4. Build for Production
Run TypeScript type-checking and Vite bundling:
```bash
npm run build
```

---

## 5. Folder & Path Rename Safety Guidance

- The current repository folder is located at: `C:\Users\durganand\Desktop\Alche-Me`
- **Do not rename this Windows folder while development servers or editor processes are open.**
- If a path migration is ever required:
  1. Terminate all active Node/Vite processes and Python servers (`Ctrl+C`).
  2. Close your IDE / editor.
  3. Rename or relocate the folder safely using Windows Explorer or PowerShell.
  4. Re-open terminal in the new folder and run `npm test` and `npm run build` to confirm path resolution.

---

## 6. Project Structure

```text
Alche-Me/
├── docs/
│   ├── Alche-Me_Master_Specification.md    # 25-section master blueprint & source of truth
│   ├── Alche-Me_Implementation_Roadmap.md  # 11 sequential phases with strict gates
│   ├── Alche-Me_Asset_Manifest.md          # Asset guidelines & folder conventions
│   ├── Alche-Me_Progress_Tracker.md        # Real-time evidence log and milestone status
│   ├── README_FIRST.md                     # Agent onboarding & working rules
│   └── phase-prompts/                      # Phase 01 to Phase 11 instruction prompts
├── public/
│   ├── favicon.svg                         # Scalable Alche-Me vector icon
│   └── assets/
│       ├── branding/                       # Alche-Me Logo, SVG marks
│       ├── backgrounds/                    # Futuristic lab backdrop & concept art
│       ├── worlds/                         # Six Scientific Worlds illustration
│       ├── icons/                          # Game styleboard reference
│       └── manifests/
│           └── asset-manifest.csv          # Cataloged runtime asset registry
├── src/
│   ├── domain/
│   │   └── types/                          # Domain schemas (Levels, Experiments, Elements)
│   ├── data/
│   │   └── featureInventory.ts             # Implemented vs prototype vs planned feature registry
│   ├── App.tsx                             # Interactive foundation dashboard & health monitor
│   ├── main.tsx                            # React 19 application entry point
│   └── index.css                           # Master design tokens & Tailwind directives
├── tests/
│   └── foundation.test.ts                  # Vitest contract, token, and asset validation tests
├── package.json                            # Package slug: alche-me
├── tsconfig.json                           # Strict TypeScript configuration
├── vite.config.ts                          # Vite 8 + Tailwind v4 + Vitest configuration
└── README.md                               # Project documentation
```
