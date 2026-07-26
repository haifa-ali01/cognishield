# CogniShield Testing Report

Date: 2026-07-22

## Summary
This report documents the manual and code-review testing completed for the CogniShield application, including the issues found and the fixes implemented to improve reliability, security, and accessibility.

## 1. Complete list of features tested
- Initial app load and default state
- Header branding and status indicator
- Language toggle between JavaScript and Python
- Code input textarea behavior and placeholder updates
- Sample-loading actions for JavaScript and Python examples
- Analyze action with valid and invalid input
- Reset action for clearing results and input
- Scan progress animation and stage progression
- Results summary, score gauge, and severity chip rendering
- Findings list rendering and expansion/collapse behavior
- Detailed finding content, remediation guidance, and metadata display
- Error handling for empty, short, invalid, and mismatched-language input
- Security hardening behavior around input sanitization and length limits
- Accessibility improvements for keyboard navigation and screen-reader support

## 2. Bugs found and fixed
- Reset only cleared output, but not the code textarea. Fixed so reset now clears the input field for a fresh scan.
- JavaScript code pasted while Python was selected did not trigger a language mismatch error and could produce a false clean result. Fixed with stronger language-detection and validation.
- Python code pasted while JavaScript was selected behaved the same way. Fixed with matching validation for both directions.
- The app accepted overly long input without a safeguard. Fixed by enforcing a maximum input length and displaying a clear error message.
- The app did not sanitize pasted control characters or unusual line endings. Fixed by normalizing input before analysis.
- The UI did not expose enough semantic accessibility information for assistive technologies. Fixed with labels, live regions, keyboard support, and focus styles.

## 3. Security measures implemented
- Added a Content Security Policy to reduce the risk of injected scripts and unsafe resource loading.
- Added referrer and permissions policies to limit browser data leakage and unnecessary permissions.
- Sanitized pasted code before analysis to remove control characters and reduce malformed input risk.
- Enforced a safe maximum input length to prevent oversized input from degrading the app or causing misuse.
- Strengthened language validation so mismatched-language snippets are rejected instead of being analyzed as valid content.
- Replaced example secret values in sample data with clearly non-sensitive placeholders.

## 4. Accessibility features added
- Added screen-reader-only labels for the code input field.
- Added proper button state semantics with aria-pressed on the language toggle.
- Added live error announcements for validation errors.
- Added keyboard support for expanding/collapsing findings using Enter and Space.
- Added visible focus indicators for buttons, links, text areas, and interactive findings.
- Added a status region that announces scan state changes for assistive technology users.

## 5. Validation performed
- Linting: passed
- Production build: passed
- Dependency audit: no production dependency vulnerabilities found
