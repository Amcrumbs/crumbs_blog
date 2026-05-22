## ADDED Requirements

### Requirement: Public website navigation
The system SHALL provide a public navigation area for categorized useful websites.

#### Scenario: Visitor opens links page
- **WHEN** a visitor opens the links section
- **THEN** the system displays public website links grouped by category with title, URL, and optional description

### Requirement: Personal bookmarks
The system SHALL provide a private personal bookmark section protected by the private password gate.

#### Scenario: Unauthenticated visitor opens private bookmarks
- **WHEN** a visitor without private access attempts to view personal bookmarks
- **THEN** the system displays the private unlock flow instead of bookmark contents

#### Scenario: Authorized user opens private bookmarks
- **WHEN** a user has unlocked private access
- **THEN** the system displays personal bookmark links below or separate from the public navigation links

### Requirement: Link metadata
The system SHALL support metadata for both public links and private bookmarks.

#### Scenario: Link is rendered
- **WHEN** the system displays a public link or private bookmark
- **THEN** it includes enough metadata for scanning, including title, destination URL, category, and optional description or icon label
