# IDIMS — Bulk Sourcing Management Module

A production-grade frontend application for enterprise bulk procurement and supplier management, built with React 19, TypeScript, and Vite. This module is part of the larger IDIMS (Integrated Digital Infrastructure Management System) platform and implements the complete Procure-to-Pay (P2P) sourcing workflow.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
  - [Building for Production](#building-for-production)
- [Application Modules](#application-modules)
- [Architecture and Design Decisions](#architecture-and-design-decisions)
- [State Management](#state-management)
- [Theming](#theming)

---

## Overview

The Bulk Sourcing Management module enables procurement teams to create sourcing targets, define line-item specifications (via Product Master catalog or manual entry), map compliant suppliers with price negotiations, and track fulfillment progress in real time. The application is structured for seamless backend API integration in a production environment.

---

## Key Features

- **Sourcing Target Dashboard** — Tabbed view (All Targets / Assigned to Me) with real-time search, status filtering, and dynamic progress bars calculated from line-item completion.
- **Assign Sourcing Target** — Multi-step modal form with header configuration, source type selection (Product Master Catalog or Manual/Ad-Hoc Entry), and a line-item specification builder supporting text specs, external links, and PDF/document uploads.
- **Supplier Mapping Workspace** — Split-panel modal with a left-side line navigator and a right-side mapping workspace. Supports adding/removing supplier mappings, computed landed cost preview (Base Price x GST), L1 vendor identification, and line completion toggling with business rule enforcement.
- **Credentials Vault** — Secure credential management interface for API keys, enterprise certificates, and access tokens with copy-to-clipboard functionality.
- **Enterprise Navigation** — Full 11-module navigation bar with dropdown menus, organization branch switcher, global search (with keyboard shortcut support), profile management, and sign-out confirmation.
- **Theming** — Light/Dark mode toggle and a Brand Theme accent (IGC corporate palette) with ShadCN-inspired CSS custom property design tokens.
- **Auto-generated Sourcing IDs** — Sequential BST-001, BST-002, etc., generated deterministically from current target count.

---

## Technology Stack

| Category | Technology | Version |
|---|---|---|
| Core Framework | React | 19.2.x |
| Language | TypeScript | 6.0.x |
| Build Tool | Vite | 8.2.x |
| Styling | Tailwind CSS (v4) with custom CSS variables | 4.3.x |
| Icons | Lucide React | 1.33.x |
| State Management | React Context API | Built-in |
| Package Manager | npm | -- |

---

## Project Structure

```
idims-bulk-sourcing/
├── public/
│   ├── download.png              # IGC brand logo
│   ├── favicon.svg               # Browser favicon
│   └── icons.svg                 # Icon sprite sheet
├── src/
│   ├── components/
│   │   ├── AssignTargetModal.tsx  # Multi-step sourcing target creation form
│   │   ├── IdimsNavbar.tsx       # Enterprise navigation bar with dropdowns
│   │   ├── ModulePlaceholderView.tsx  # Placeholder for non-P2P modules
│   │   ├── SupplierMappingModal.tsx   # Split-panel supplier mapping workspace
│   │   ├── TargetDashboard.tsx   # Main dashboard with search, filter, progress
│   │   └── VaultView.tsx         # Credentials and security vault
│   ├── context/
│   │   └── SourcingContext.tsx    # Global state provider (targets, suppliers, stats)
│   ├── data/
│   │   └── mockData.ts           # Initial seed data (targets, suppliers)
│   ├── types/
│   │   └── sourcing.ts           # TypeScript interfaces and type definitions
│   ├── App.tsx                   # Root component with routing and modal orchestration
│   ├── App.css                   # Minimal app-level overrides
│   ├── index.css                 # Design system tokens, navbar styles, animations
│   └── main.tsx                  # Application entry point
├── index.html                    # HTML shell
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── eslint.config.js
```

---

## Getting Started

### Prerequisites

Ensure the following are installed on your system:

- **Node.js** — version 18.x or higher
- **npm** — version 9.x or higher (ships with Node.js)

Verify installation:

```bash
node --version
npm --version
```

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd idims-bulk-sourcing
```

2. Install dependencies:

```bash
npm install
```

### Running the Development Server

Start the Vite development server with hot module replacement:

```bash
npm run dev
```

The application will be available at:

```
http://localhost:5173/
```

The dev server supports instant hot reload — any file changes will reflect immediately in the browser without a full page refresh.

### Building for Production

Generate an optimized production build:

```bash
npm run build
```

The compiled output will be placed in the `dist/` directory. To preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check for code quality issues:

```bash
npm run lint
```

---

## Application Modules

The navigation bar provides access to the following modules. The **Procure to Pay (P2P)** module containing Bulk Sourcing Management is fully implemented. Other modules render placeholder views indicating their intended purpose within the IDIMS platform.

| Module | Route Key | Implementation |
|---|---|---|
| Executive Dashboard | `dashboard` | Placeholder |
| Credentials Vault | `vault` | Fully Implemented |
| Project Navigator | `projects` | Placeholder |
| HRMS | `hrms` | Placeholder |
| Sales Matrix | `sales` | Placeholder |
| Contract Lifecycle Management (CLM) | `clm` | Placeholder |
| **Procure to Pay (P2P) — Bulk Sourcing** | `p2p` | **Fully Implemented** |
| GTS (E-Docs) | `gts` | Placeholder |
| Inventory (WMS) | `wms` | Placeholder |
| Shipment 360 | `shipment` | Placeholder |
| Master Data Management | `master` | Placeholder |

---

## Architecture and Design Decisions

### Component Architecture

The application follows a flat, feature-based component structure rather than atomic design. Each component encapsulates its own layout, state logic, and business rules. This approach was chosen for clarity and maintainability within the scope of a single-module implementation.

### Routing

Client-side navigation is managed through a simple `activeNav` state in `App.tsx` with a `switch` statement renderer, avoiding the overhead of a routing library for what is effectively a single-page module with tabbed views. This can be replaced with React Router when multi-page navigation is required.

### Form Validation

Form validation in `AssignTargetModal` and `SupplierMappingModal` is handled inline with business rules:

- Target title is required.
- Every line item must have a valid product name and a target price greater than zero.
- Due date must be later than the start date.
- A supplier must be mapped to a line before it can be marked as completed.
- Duplicate supplier mappings on the same line are prevented.

### API Integration Readiness

The application is structured for straightforward backend integration:

- All data flows through a centralized `SourcingContext` provider.
- CRUD operations (`createTarget`, `addSupplierMapping`, `removeSupplierMapping`, `toggleLineCompletion`) are isolated functions that can be replaced with API calls.
- TypeScript interfaces in `types/sourcing.ts` define the data contracts expected from backend endpoints.
- Mock data in `data/mockData.ts` serves as the development seed and can be removed once API integration is complete.

---

## State Management

Global application state is managed through React Context (`SourcingContext`), which provides:

| Property / Method | Description |
|---|---|
| `targets` | Array of all sourcing targets with their line items and supplier mappings |
| `suppliers` | Master list of compliant suppliers available for mapping |
| `stats` | Computed statistics (total, assigned, completed, in-progress counts) |
| `currentUser` | Currently authenticated user identity |
| `createTarget()` | Creates a new sourcing target with auto-generated sequential ID |
| `addSupplierMapping()` | Maps a supplier to a specific line item with price and tax computation |
| `removeSupplierMapping()` | Removes a supplier mapping and recalculates completion status |
| `toggleLineCompletion()` | Marks/unmarks a line as completed (enforces supplier mapping prerequisite) |

---

## Theming

The design system uses ShadCN-inspired CSS custom properties defined in `index.css`. All color values use the OKLCH color space for perceptual uniformity.

Three theme modes are available:

| Mode | Activation | Description |
|---|---|---|
| Light (Default) | Default state | Clean white background with dark text |
| Dark | Toggle via moon/sun icon in navbar | Dark background with light text |
| Brand (IGC) | Toggle via the brand switch in navbar | Applies IGC corporate accent color to primary elements |

Theme modes can be combined (e.g., Dark + Brand) for four distinct visual configurations.

---

## License

This project is developed as part of a technical assessment for the React Developer position at IGC. All rights reserved.
