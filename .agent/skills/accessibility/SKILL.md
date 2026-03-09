---
name: accessibility
description: Specialized skill for ensuring web accessibility. Covers WCAG compliance, screen reader compatibility, and inclusive design.
license: MIT
---

# Web Accessibility

Accessibility (a11y) is the practice of making your websites usable by as many people as possible. We often think of this as being about people with disabilities, but making sites accessible also benefits other groups such as those using mobile devices, or those with slow network connections.

## Core Principles (POUR)

### Perceivable
Information and user interface components must be presentable to users in ways they can perceive.
- **Text Alternatives:** Provide `alt` text for images. Use `aria-label` where necessary.
- **Captions & Transcripts:** Provide for all media content.
- **Adaptable:** Create content that can be presented in different ways without losing information or structure.
- **Distinguishable:** Make it easier for users to see and hear content including separating foreground from background.

### Operable
User interface components and navigation must be operable.
- **Keyboard Accessible:** Make all functionality available from a keyboard.
- **Enough Time:** Provide users enough time to read and use content.
- **Seizures and Physical Reactions:** Do not design content in a way that is known to cause seizures.
- **Navigable:** Provide ways to help users navigate, find content, and determine where they are.
- **Input Modalities:** Make it easier for users to operate functionality through various inputs beyond keyboard.

### Understandable
Information and the operation of user interface interface must be understandable.
- **Readable:** Make text content readable and understandable.
- **Predictable:** Make Web pages appear and operate in predictable ways.
- **Input Assistance:** Help users avoid and correct mistakes.

### Robust
Content must be robust enough that it can be interpreted reliably by a wide variety of user agents, including assistive technologies.
- **Compatible:** Maximize compatibility with current and future user agents, including assistive technologies.

## Practical Checks

- [ ] Every `<img>` has an `alt` attribute.
- [ ] Form elements have associated `<label>` tags.
- [ ] Color contrast meets WCAG AA standards (4.5:1 for normal text).
- [ ] Interactive elements (buttons, links) are keyboard focusable and have clear focus styles.
- [ ] Semantic HTML markers (e.g., `<nav>`, `<main>`, `<header>`) are used.
- [ ] ARIA roles and labels are used only when native HTML is insufficient.
