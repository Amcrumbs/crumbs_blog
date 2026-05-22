---
title: Tooling Module Roadmap
summary: The tools area starts with a solid framework, then adds real processors gradually.
date: 2026-05-20
tags:
  - tools
  - roadmap
visibility: public
type: note
---

The tools module should begin with catalog and interaction scaffolding instead of trying to implement every conversion at once.

A sensible order:

1. Text utilities: JSON formatting, Markdown preview, timestamp conversion.
2. Light file utilities: image compression, text export.
3. Heavy file utilities: Word to PDF, PDF merge, batch processing.

Heavy file tools need careful handling for uploads, temporary files, privacy, and failure states, so they deserve focused iterations after the framework is stable.
