## ADDED Requirements

### Requirement: Dashboard home experience
The system SHALL provide a dashboard-style home page that presents the site as a personal workspace rather than a conventional marketing landing page.

#### Scenario: Visitor opens the home page
- **WHEN** a visitor opens the root route
- **THEN** the system displays entry points for notes, logs, tools, links, and the guestbook in the first screen experience

#### Scenario: Owner uses the site as a workspace
- **WHEN** the owner opens the root route
- **THEN** the system provides quick access to recent content, tool shortcuts, and bookmarked destinations

### Requirement: Persistent navigation
The system SHALL provide persistent navigation across the main site sections.

#### Scenario: User moves between sections
- **WHEN** a user navigates to notes, logs, tools, links, or guestbook pages
- **THEN** the system preserves a recognizable navigation structure with the current section indicated

### Requirement: Claude Code inspired visual system
The system SHALL use a dark, compact, developer-workspace visual style with fine borders, restrained colors, command/workspace affordances, and readable content surfaces.

#### Scenario: User views the site interface
- **WHEN** any primary page renders
- **THEN** the system presents a coherent workspace aesthetic without relying on a marketing-style hero page

#### Scenario: User reads long-form content
- **WHEN** a user opens a note or log entry
- **THEN** the system uses typography and spacing that keep the content readable within the dark visual system

### Requirement: Responsive layout
The system SHALL support desktop and mobile layouts for all primary sections.

#### Scenario: User opens the site on a narrow viewport
- **WHEN** the viewport is mobile-sized
- **THEN** the system adapts navigation, panels, and content areas without text overlap or inaccessible controls
