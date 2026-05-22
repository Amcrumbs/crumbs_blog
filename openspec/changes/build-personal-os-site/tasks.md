## 1. Application Setup

- [x] 1.1 Scaffold a Next.js TypeScript application in the repository.
- [x] 1.2 Add linting, formatting, and baseline scripts needed to run and verify the app.
- [x] 1.3 Configure the app for environment-driven private password access.
- [x] 1.4 Create shared route, metadata, and content directory conventions.

## 2. Visual System and Site Shell

- [x] 2.1 Implement the global dark workspace theme, typography, spacing, borders, and status colors.
- [x] 2.2 Build persistent navigation for home, notes, logs, tools, links, and guestbook.
- [x] 2.3 Build the dashboard home page with first-screen entry points for core modules.
- [x] 2.4 Verify desktop and mobile layouts avoid text overlap and inaccessible controls.

## 3. Content Library

- [x] 3.1 Add Markdown/MDX content loading for public notes and public logs.
- [x] 3.2 Define frontmatter metadata for title, summary, date, tags, visibility, and content type.
- [x] 3.3 Build public notes list and note detail pages.
- [x] 3.4 Build public logs timeline/listing and log detail pages.
- [x] 3.5 Implement private password unlock and session-based access state.
- [x] 3.6 Build private logs listing and detail views gated behind the private unlock flow.

## 4. Tools Directory

- [x] 4.1 Define data-driven tool metadata including slug, title, category, description, input type, and implementation status.
- [x] 4.2 Build the tools catalog page with categories or filtering.
- [x] 4.3 Build tool detail interfaces for text and file-oriented utilities.
- [x] 4.4 Add a Word to PDF placeholder tool with upload affordance and unfinished execution state.
- [x] 4.5 Ensure unfinished tools clearly display placeholder or disabled states.

## 5. Guestbook

- [x] 5.1 Define the guestbook message model with display name, message, timestamp, and moderation status.
- [x] 5.2 Build the guestbook page with approved message display.
- [x] 5.3 Build anonymous message submission with validation and length limits.
- [x] 5.4 Store or model new messages with pending, approved, or hidden status.
- [x] 5.5 Ensure guestbook submission does not require email or push notification.

## 6. Link Navigation

- [x] 6.1 Define link metadata for public websites and private bookmarks.
- [x] 6.2 Build categorized public website navigation.
- [x] 6.3 Build password-gated personal bookmarks below or separate from public links.
- [x] 6.4 Ensure public link data never exposes private bookmarks before unlock.

## 7. Verification

- [x] 7.1 Run lint/type checks and resolve reported issues.
- [x] 7.2 Run the app locally and verify the primary routes render.
- [x] 7.3 Verify private logs and private bookmarks are hidden before unlock and visible after unlock.
- [x] 7.4 Verify responsive behavior for home, content, tools, links, and guestbook pages.
- [x] 7.5 Review the implementation against all new OpenSpec requirements.
