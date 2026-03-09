---
name: best-practices
description: General web development best practices focusing on security, standards, and code quality.
license: MIT
---

# Web Development Best Practices

Following industry-standard best practices ensures your web applications are secure, performant, and maintainable.

## Security

- **HTTPS Everywhere:** Serve all content over HTTPS.
- **Content Security Policy (CSP):** Implement CSP to mitigate XSS and other injection attacks.
- **Dependency Management:** Regularly audit and update dependencies to avoid known vulnerabilities.
- **Sensitive Data:** Never hardcode secrets. Use environment variables.
- **Subresource Integrity (SRI):** Use SRI hashes for third-party scripts and styles.

## Modern Standards

- **DOCTYPE:** Use `<!DOCTYPE html>`.
- **Charset:** Always declare `<meta charset="UTF-8">` as early as possible.
- **Viewport:** Include `<meta name="viewport" content="width=device-width, initial-scale=1">` for responsive design.
- **Semantic HTML:** Use semantic tags (`<article>`, `<section>`, `<aside>`, etc.) instead of generic `<div>`s.

## Code Quality

- **Linting:** Use ESLint and Prettier for consistent code style.
- **Modularization:** Break down code into reusable, focused components.
- **Testing:** Implement unit, integration, and E2E tests.
- **Documentation:** Document architecture, non-obvious logic, and public APIs.

## UX & UI

- **Responsive Design:** Ensure the site works across all screen sizes.
- **Touch Targets:** Make interactive elements at least 48x48px on mobile.
- **Browser Errors:** Keep the console free of errors and warnings.
- **Interstitials:** Avoid intrusive pop-ups that block content.
