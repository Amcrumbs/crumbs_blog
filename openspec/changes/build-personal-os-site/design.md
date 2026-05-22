## Context

The repository currently contains OpenSpec configuration only, so this change will establish the first application architecture. The target product is a personal site that behaves like a private-first workspace and public-facing portfolio at the same time: the owner uses it for notes, journals, tools, and bookmarks, while visitors can read public content, browse public links, and leave anonymous messages.

The visual direction is a digital garden with Claude Code inspired interface structure: warm workspace surfaces, fine borders, compact panels, command-palette affordances, subtle graph/map cues, restrained status colors, and an interface that feels like a cultivated knowledge environment rather than a marketing landing page. Typography should feel editorial and European for Latin text, while Chinese text should use a more designed, rounded, friendly font direction.

## Goals / Non-Goals

**Goals:**

- Create a full-stack foundation that can support content, private access, guestbook storage, and future utility APIs.
- Provide a dashboard-style home page that makes notes, logs, tools, links, and guestbook entry points visible in the first experience.
- Support public notes/logs and password-protected private logs without requiring a full user-account system in the first version.
- Provide complete tool catalog and detail-page UI scaffolding while allowing real utility execution to be added later.
- Support anonymous guestbook submission with a moderation-ready model.
- Separate public website navigation from private personal bookmarks.

**Non-Goals:**

- Real Word-to-PDF conversion or other heavy utility execution in the first implementation.
- Multi-user accounts, OAuth, role-based permissions, or a full admin console.
- Realtime comments, notifications, email delivery, or social features.
- A marketing-style hero landing page.
- End-to-end content management UI in the first implementation; file-based content is acceptable.

## Decisions

### Use Next.js with TypeScript as the application baseline

Next.js provides a single framework for public pages, private routes, server APIs, and future tool execution endpoints. This fits the site better than a purely static blog stack because the guestbook, private logs, and future utilities all benefit from server-side behavior.

Alternatives considered:

- Astro: excellent for content-heavy sites, but dynamic private access and future APIs would require extra architecture.
- Vite + React: fast for a frontend prototype, but would need a separate backend for guestbook and tools.

### Use file-based Markdown/MDX content for the first notes and logs implementation

Public notes, public logs, and private logs can begin as Markdown/MDX files with frontmatter metadata. This keeps authoring simple and versionable while the product shape is still forming.

Private log files SHOULD NOT be exposed through static public routes. They should be loaded only by server-side code after private access has been established.

Alternatives considered:

- Database-backed editor: more convenient later, but too much surface area for the first version.
- External CMS: adds operational dependency before the content model is proven.

### Use a single site password for private areas in the first version

The private layer will use a single configured password to establish a session that unlocks private logs and personal bookmarks. This matches the user's request for "a password is enough" and avoids account-management overhead.

The password MUST be configured through environment variables or deployment secrets, not hardcoded in source.

Alternatives considered:

- Per-entry passwords: flexible but annoying to manage.
- Full login system: stronger but unnecessary for a personal first version.

### Treat tools as a catalog plus executable-ready detail pages

The first version will include tool categories, cards, detail pages, inputs, upload affordances, disabled/run placeholder states, and clear "not yet implemented" results. The structure should make adding real logic later straightforward without redesigning the UI.

Tool definitions should be data-driven where practical, including slug, title, category, description, input type, privacy hint, and implementation status.

### Make guestbook anonymous but moderation-ready

Visitors may submit a display name and message without logging in. The initial product can show approved messages and store new messages in a pending state if persistence is implemented in the same pass.

Even if moderation UI is deferred, the data model should include a status field so the system does not need a breaking migration to add moderation later.

### Split public links and private bookmarks

Public website navigation is a visitor-facing recommendation/navigation area. Personal bookmarks are a private owner-facing collection unlocked by the same password gate as private logs.

Both link types can share a common data shape: title, URL, category, description, icon label, and visibility.

### Retain three visual schemes

The design space is narrowed to three compatible schemes. These are retained as the only visual directions worth exploring further:

1. **Warm Digital Garden Workspace**
   - Core idea: the site feels like a living knowledge garden with notes, logs, tools, and links growing from one shared map.
   - Best fit because it matches the owner's preference for a digital garden while preserving the practical personal-OS structure.
   - Visual cues: warm charcoal, ink brown, soft amber, muted moss, subtle node/link motifs, quiet panels, and reading-first content surfaces.

2. **Claude Code Inspired Knowledge Console**
   - Core idea: keep the dense, operational clarity of Claude Code, but soften the palette and make it less terminal-heavy.
   - Best fit for tools, private workspace, navigation, and dashboard interaction.
   - Visual cues: command palette, compact side navigation, fine dividers, status chips, keyboard-like controls, warm syntax accents, and restrained motion.

3. **European Editorial Notebook**
   - Core idea: long-form notes should feel more literary and collected than a generic developer blog.
   - Best fit for public notes, journals, and private logs.
   - Visual cues: elegant European-style Latin serif or humanist sans headings, rounded and designed Chinese font choices, comfortable measure, warm paper-like dark surfaces, and a calmer article rhythm.

Directions not retained:

- Pure terminal UI: too cold and too narrow for a digital garden.
- Marketing portfolio hero: conflicts with the private-first workspace goal.
- Neon cyberpunk dashboard: visually loud and less suitable for reading.
- Generic SaaS admin panel: practical but lacks the personal, cultivated feeling.

## Risks / Trade-offs

- File-based content may become awkward for frequent editing -> Start with Markdown for speed and add a web editor only after the content structure stabilizes.
- A single password is weaker than real authentication -> Keep scope limited to personal/private convenience content and store the password as a secret.
- Anonymous guestbook invites spam -> Include moderation-ready status, length limits, basic validation, and the option to keep submissions pending by default.
- Tool pages may look functional before real execution exists -> Clearly represent implementation status in the UI and use placeholder result states.
- Claude Code inspired visuals could become too dark or terminal-heavy for reading -> Use the workspace aesthetic for navigation and panels while keeping article content readable with generous line height and contrast.

## Migration Plan

1. Scaffold the application in the repository.
2. Add content directories and seed example public/private entries.
3. Add route structure for home, notes, logs, tools, links, guestbook, and private unlock.
4. Add guestbook persistence only if the chosen first implementation includes storage; otherwise use mocked seed data and preserve the model.
5. Verify responsive layouts and private route behavior locally.

Rollback is simple while the repository has no existing app: remove the new application files or revert the change branch before deployment.

## Open Questions

- Should the first implementation include SQLite persistence for guestbook messages immediately, or begin with seeded static data and add persistence in a later change?
- Should private content editing remain file-only for the first release, or should a lightweight owner-only editor be added soon after launch?
- Which exact deployment target should be optimized first: local/self-hosted, Vercel, or another platform?
