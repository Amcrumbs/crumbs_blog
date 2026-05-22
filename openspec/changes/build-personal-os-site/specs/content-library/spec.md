## ADDED Requirements

### Requirement: Public notes
The system SHALL provide a public notes library for reading owner-authored notes with metadata.

#### Scenario: Visitor views notes list
- **WHEN** a visitor opens the notes section
- **THEN** the system displays public notes with title, summary, date, and tags when available

#### Scenario: Visitor opens a note
- **WHEN** a visitor selects a public note
- **THEN** the system displays the full note content and its metadata

### Requirement: Public logs
The system SHALL provide a public log area for chronological journal-style entries.

#### Scenario: Visitor views public logs
- **WHEN** a visitor opens the logs section
- **THEN** the system displays public log entries in chronological or reverse-chronological order

### Requirement: Private logs
The system SHALL protect private log entries behind a password-based access gate.

#### Scenario: Unauthenticated visitor attempts private log access
- **WHEN** a visitor without private access opens a private log route or private log listing
- **THEN** the system displays a password unlock flow instead of private content

#### Scenario: User unlocks private logs
- **WHEN** a user submits the correct private password
- **THEN** the system grants session-based access to private logs

#### Scenario: User submits incorrect password
- **WHEN** a user submits an incorrect private password
- **THEN** the system keeps private content hidden and displays a failed unlock state

### Requirement: Content metadata and filtering
The system SHALL support metadata-driven listing for notes and logs.

#### Scenario: Content has tags
- **WHEN** notes or logs include tags
- **THEN** the system allows users to scan or filter content by tag or category where the UI provides that control

#### Scenario: Content is private
- **WHEN** content is marked private
- **THEN** the system excludes it from public lists and public search/index surfaces
