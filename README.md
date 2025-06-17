# AIMatrix

AIMatrix is a modern, cross-platform AI tool launcher and integration hub for desktop environments, beginning with Windows 11. Inspired by Stability Matrix, AIMatrix enables users to configure, launch, and interact with local AI tools (such as Stable Diffusion, ComfyUI, InvokeAI, FaceFusion, and more) through a unified, beautiful Electron interface.

---

## Project Status

**Current Roadmap Stage:** *Stage 2: Boilerplate & Architecture Scaffolding*

* [x] Planning & Project Setup
* [x] Boilerplate & Architecture Scaffolding
* [x] Core Layout & Navigation
* [x] Modal Windows & Theming
* [x] Tool Cards, Info Pane, and Interactivity
* [x] Electron Integration & Tool Launch
* [x] Configuration Management & Persistence
* [ ] Polish, Accessibility, and Documentation
* [ ] Packaging & Distribution
* [ ] Continuous Integration & Maintenance

For full milestone details, see [`aimatrix-roadmap.md`](./aimatrix-roadmap.md).

---

## Table of Contents

* [Features](#features)
* [Project Structure](#project-structure)
* [Development](#development)
* [Design References](#design-references)
* [Roadmap](#roadmap)
* [Contributing](#contributing)

---

## Features

* **Modern Electron+React+Tailwind Desktop App**
* **Launcher for installed AI tools**: visually manage and launch local tools like Stable Diffusion, ComfyUI, etc.
* **Tool configuration via modal UI**
* **Integrated file/image viewers and terminals for each tool**
* **About modal, settings modal, and responsive design**
* **Theming: Light/Dark modes**
* **Cross-platform ready: Windows 11 first, Mac/Linux support planned**
* **Secure: Electron context isolation, sandboxing, best practices**

---

## Project Structure

```plaintext
AIMatrix/
│  AIMatrix Application Design Brief.txt
│  aimatrix-roadmap.md
│  package.json
│  vite.config.ts
│  tailwind.config.js
│  postcss.config.js
│  tsconfig.json
│  .gitignore
│  README.md
│
├─ app/
|  ├─config
│  │    app-settings.json        # Settings
│  │    tools.json                # Tool Template file
│  │  ├─ tools/
│  │  │    comfyui.json          # Comfy UI Tool config file
│  │  │    facefusion.json       # FaceFusion Tool config file
│  │  │    invoke.json           # InvokeAI Tool config file
│  ├─ main/
│  │    main.ts                  # Electron main process (window mgmt, security)
│  │    loadTools.ts             # Electron Load Tools types
│  │    preload.ts               # Electron preload for context bridge
│  │    electron-env.d.ts        # Type definitions for Electron main
│  │
│  ├─ renderer/
│  │    App.tsx                  # Main cards/info layout
│  │    env.d.ts                 # Renderer TS environment types
│  │    index.html               # 
│  │    main.tsx                 # 
│  │
│  │  ├─ assets/
│  │  │    app-logo.svg          # App logo (SVG)
│  │  │
│  │  ├─ components/
│  │  │    AboutModal.tsx        # About modal component
│  │  │    ConfigModal.tsx       # Tool config modal
│  │  │    QuickMenu.tsx         # Left sidebar menu
│  │  |    ImageViewerPane.tsx   # Window to be used for our Image Viewer
│  │  |    QuickMenu.tsx         # Used for our Quickmenu Left main window Pane
│  │  |    TerminalPane.tsx      # Used for our Terminal center and right pane combined
│  │  |    ThemeToggle.tsx       # Dark/Light theme toggle code
│  │  |    ToolCard.tsx          # ToolCard Code
│  │  |    WebToolPane.tsx       # WebToolPane Code
│  │  │
│  │  ├─ styles/
│  │  │    main.css              # Tailwind + custom styles
│  │  │
│  │  ├─ utils/
│  │  │    ipc.ts                # 
│  │  |    loadTools.ts          # 
│  │  │
│  │  ├─ views/
│  │  │    MainView.tsx          # Main layout
│  │  │
│  │
│
└─ .github/
    └─ workflows/
        ci.yml                   # CI workflow (lint/build/test)
```

### **Key File/Folder Descriptions**

* **AIMatrix Application Design Brief.txt:** Master requirements and vision doc (always referenced in development)
* **aimatrix-roadmap.md:** Roadmap with current and completed stages
* **/app/main/:** Electron main process—creates windows, manages security
* **/app/renderer/:** All React UI, Tailwind styles, assets
* **/app/renderer/assets/:** App logo, static images
* **/app/renderer/components/:** UI widgets and modals
* **/app/renderer/views/:** Main (and future) layout views
* **/app/renderer/styles/:** Tailwind config and overrides
* **/app/config/:** All user tools and settings configs
* **/.github/workflows/:** CI/CD GitHub Actions, can be extended for lint, tests, builds

---

## Development

**Requirements:**

* Node.js (v18+)
* Yarn or npm
* Windows 11 (Mac/Linux builds planned for later stages)

**Quickstart:**

1. `git clone https://github.com/PSGRaptor/AIMatrix.git`
2. `cd AIMatrix`
3. `npm install` (or `yarn`)
4. `npm run dev` (development) / `npm run build` (production)

The app will launch with the initial layout, logo, and modals. See the roadmap for staged functionality.

---

## Design References

* [AIMatrix Application Design Brief.txt](./AIMatrix_Application_Design_Brief.txt)
* [Wireframe (SVG/PNG)](./app/renderer/assets/app-wireframe.png) *(add this if available)*
* App logo: [`app/renderer/assets/app-logo.svg`](./app/renderer/assets/app-logo.svg)
* [aimatrix-roadmap.md](./aimatrix-roadmap.md)

---

## Roadmap (Current Stages)

> *See [aimatrix-roadmap.md](./aimatrix-roadmap.md) for full details*

**1. Planning & Project Setup** (✅ Complete)
**2. Boilerplate & Architecture Scaffolding** (✅ Complete)
**3. Core Layout & Navigation**
**4. Modal Windows & Theming**
**5. Tool Cards, Info Pane, and Interactivity**
**6. Electron Integration & Tool Launch**
**7. Configuration Management & Persistence**
**8. Polish, Accessibility, and Documentation**
**9. Packaging & Distribution**
**10. Continuous Integration & Maintenance**

---

## Contributing

* Please review the Application Design Brief and Roadmap before making changes.
* Use feature branches and PRs for all contributions.
* Code must be fully commented, with descriptive commit messages.
* All new features should be cross-platform ready.

---

## License

*(Specify here: MIT, Apache 2.0, etc. if you want)*

---

**AIMatrix** — Designed for AI tool creators and enthusiasts.
