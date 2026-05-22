## Why

The project needs a personal site that works primarily as the owner's daily knowledge and utility workspace while still presenting a polished public identity to visitors. Building this as a "personal OS" rather than a conventional blog creates room for notes, journals, tools, bookmarks, and guest interaction to grow together under one coherent experience.

## What Changes

- Introduce a Claude Code inspired personal site shell with a dashboard-like home experience, persistent navigation, command/workspace visual language, and responsive layouts.
- Add a notes and journals area that supports public notes, public logs, and password-protected private logs.
- Add a tools area with a complete page framework for common utilities, including file-conversion tools such as Word to PDF, while allowing real processing logic to be implemented later.
- Add an anonymous public guestbook for visitor messages, with a low-friction posting flow and moderation-ready data model.
- Add a public website navigation area with categorized public links and a password-protected personal bookmark section.
- Establish the first implementation path for a full-stack site suitable for later backend APIs, storage, and real utility execution.

## Capabilities

### New Capabilities

- `personal-site-shell`: Covers the overall site structure, home dashboard, navigation, responsive layout, and shared visual system.
- `content-library`: Covers public notes, public logs, private logs, metadata, listing, filtering, and private access behavior.
- `tools-directory`: Covers the utility catalog, tool detail pages, placeholder execution states, and future-ready tool interfaces.
- `guestbook`: Covers anonymous visitor message submission, display, and moderation-ready behavior.
- `link-navigation`: Covers public categorized website navigation and private personal bookmark access.

### Modified Capabilities

- None.

## Impact

- Creates a new application codebase for the personal site; the repository currently has OpenSpec configuration but no app implementation.
- Likely introduces a web framework, styling system, content pipeline, and storage choice. Next.js with TypeScript is the preferred baseline because private access, guestbook storage, and future tool APIs benefit from a full-stack framework.
- Future implementation may add a database such as SQLite, authentication/session handling for private areas, and server-side APIs for guestbook and utility execution.
