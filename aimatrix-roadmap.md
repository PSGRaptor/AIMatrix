# AIMatrix Project Roadmap

---

## STAGE 1: Planning & Project Setup

**Milestones:**

* [x] Create initial GitHub repo (private if preferred)
* [x] Add wireframes, design docs, and initial README
* [x] Establish .gitignore, code formatting, and branch naming conventions

**GitHub Workflow:**

* Commit all project setup and planning assets (`docs/`, `wireframes/`, `README.md`)
* Tag as `v0.1-planning`

---

## STAGE 2: Boilerplate & Architecture Scaffolding

**Milestones:**

* [x] Scaffold Electron main process (main.js, preload.ts)
* [x] Initialize React renderer (Vite or CRA)
* [x] Directory structure (`/app/main`, `/app/renderer`, `/assets`, `/config`)
* [x] Basic Gradle integration (if desired for builds)
* [x] Setup ESLint, Prettier, Husky (pre-commit), and lint-staged

**GitHub Workflow:**

* One commit per meaningful section (main process, renderer, lint setup, Gradle)
* Push with message: `feat: project scaffolding and toolchain setup`
* Tag as `v0.2-boilerplate`

---

## STAGE 3: Core Layout & Navigation

**Milestones:**

* [x] Implement Top Menu (About, Help)
* [x] Build Quick Menu (Left bar with icons, responsive)
* [x] Center pane placeholder (Tool Cards grid)
* [x] Right info pane (placeholder)
* [ ] Global dark/light mode toggle (initial state)

**GitHub Workflow:**

* Small, focused commits per layout element
* Push after every core UI piece
* Pull requests (PRs) for new UI/UX features, reviewed before merge
* Tag as `v0.3-layout`

---

## STAGE 4: Modal Windows & Theming

**Milestones:**

* [ ] About modal (modal window, scrollable, dynamic content)
* [ ] Config modal (Add/Edit AI Tool)
* [ ] Theme switching (persist to settings)
* [ ] Style foundation (Tailwind, CSS Modules, or Styled Components)

**GitHub Workflow:**

* Use feature branches for modals and theming
* PR: `feature/about-modal`, `feature/config-modal`, etc.
* Always merge via PR (even if solo, for history/CI)
* Tag as `v0.4-modals-theme`

---

## STAGE 5: Tool Cards, Info Pane, and Interactivity

**Milestones:**

* [ ] Tool Card component (icon, name, description, play/edit/terminal/image icons)
* [ ] Dynamic tool data loaded from JSON/config
* [ ] Clickable cards: extended info to right pane
* [ ] Interactive Quick Menu state switching (Cards/Image/Terminal)

**GitHub Workflow:**

* Split work by component/feature: e.g., `component/tool-card`, `feature/card-interaction`
* Push small, atomic commits (one feature or bug per commit)
* Tag as `v0.5-tool-cards`

---

## STAGE 6: Electron Integration & Tool Launch

**Milestones:**

* [ ] Electron window integration for AI Tools (load via URL in child window)
* [ ] Embedded terminal using Electron APIs
* [ ] File/image viewer window in-app
* [ ] Security review (sandboxing, context isolation)

**GitHub Workflow:**

* Create PR for Electron-integration features
* Write clear commit messages: `feat: launch tool in electron child window`
* Tag as `v0.6-electron-int`

---

## STAGE 7: Configuration Management & Persistence

**Milestones:**

* [ ] Implement settings/config persistence (`config/tools.json`, `app-settings.json`)
* [ ] Secure file handling (copy icon images to app data)
* [ ] Add/Edit/Delete tools via config modal

**GitHub Workflow:**

* PR per config feature: `feature/config-persistence`, `feature/tool-add-edit`
* Always add/expand relevant unit tests
* Tag as `v0.7-config-persistence`

---

## STAGE 8: Polish, Accessibility, and Documentation

**Milestones:**

* [ ] Keyboard navigation, ARIA roles, tooltips, color contrast
* [ ] Refine UI animations/transitions
* [ ] Finalize README, usage docs, and developer onboarding guides

**GitHub Workflow:**

* Small, descriptive commits for polish/accessibility changes
* Tag as `v1.0.0-rc` (release candidate)

---

## STAGE 9: Packaging & Distribution

**Milestones:**

* [ ] Windows 11 installer/package (MSI/EXE via Electron Builder)
* [ ] Auto-update mechanism (if desired)
* [ ] Portability review for Mac/Linux
* [ ] Publish v1.0 release on GitHub

**GitHub Workflow:**

* PR: `release/windows-installer`
* Tag as `v1.0.0`

---

## STAGE 10: Continuous Integration & Maintenance

**Milestones:**

* [ ] Set up GitHub Actions: linting, build, test, release pipeline
* [ ] Regular security dependency checks
* [ ] Scheduled issue triage and feature planning

**GitHub Workflow:**

* Always branch for new features/bugfixes: `feature/...`, `fix/...`
* PR reviews mandatory for main
* Tag each minor/patch as `v1.x.x`

---

## Commit/Push & Production Best Practices

* **Atomic commits:** One logical change per commit, always descriptive messages.
* **Pull requests for every feature or fix.**
* **Write comments and keep all code clear (required for onboarding and security).**
* **Regular tagging:** At each stable milestone, always tag a release.
* **Weekly pushes, daily commits:** Push at the end of every work session, commit every logical change.
* **Branching:** Main for release, develop for latest tested features, feature/ and fix/ for isolated changes.

---

## Summary Table

| Stage          | Major Milestones                    | Tag                 | Branch Type       |
| -------------- | ----------------------------------- | ------------------- | ----------------- |
| 1. Planning    | Repo, Docs, Conventions             | v0.1-planning       | main              |
| 2. Boilerplate | Electron, React, Gradle, Lint       | v0.2-boilerplate    | main              |
| 3. Layout      | UI Shell, Navigation                | v0.3-layout         | feature/layout    |
| 4. Modals      | About, Config, Theming              | v0.4-modals-theme   | feature/modals    |
| 5. Tool Cards  | Dynamic Grid, Interaction           | v0.5-tool-cards     | feature/cards     |
| 6. Electron    | Tool Launch, Terminal, Image Viewer | v0.6-electron-int   | feature/integrate |
| 7. Config      | Persistence, File Handling          | v0.7-config-persist | feature/config    |
| 8. Polish      | Accessibility, Animation, Docs      | v1.0.0-rc           | feature/polish    |
| 9. Packaging   | Installer, Mac/Linux review         | v1.0.0              | release           |
| 10. CI/CD      | GitHub Actions, Maintenance         | v1.0.0+             | main              |

---

## Ready to start Stage 2: Boilerplate & Scaffolding?

Or do you want to expand the roadmap further, e.g. with *user stories* or *issue templates*?
Let me know and I’ll begin presenting **folder structures and fully commented code** for each milestone, as per your requirements.
