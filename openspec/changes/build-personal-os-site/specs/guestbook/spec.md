## ADDED Requirements

### Requirement: Anonymous message submission
The system SHALL allow visitors to submit guestbook messages without creating an account.

#### Scenario: Visitor submits valid message
- **WHEN** a visitor provides a display name or anonymous identity and a valid message
- **THEN** the system accepts the submission and records it for guestbook display or moderation

#### Scenario: Visitor submits invalid message
- **WHEN** a visitor submits an empty message or a message exceeding configured limits
- **THEN** the system rejects the submission and explains the validation problem

### Requirement: Guestbook display
The system SHALL display approved guestbook messages publicly.

#### Scenario: Visitor opens guestbook
- **WHEN** a visitor opens the guestbook section
- **THEN** the system displays approved messages with display name, message content, and timestamp when available

### Requirement: Moderation-ready model
The system SHALL preserve moderation state for guestbook messages.

#### Scenario: New message is recorded
- **WHEN** a visitor submits a guestbook message
- **THEN** the system stores or models the message with a status that can distinguish pending, approved, and hidden states

### Requirement: No notification requirement
The system SHALL NOT require owner notification when a guestbook message is submitted.

#### Scenario: Message is submitted
- **WHEN** a visitor submits a guestbook message
- **THEN** the system completes the guestbook flow without sending email or push notification
