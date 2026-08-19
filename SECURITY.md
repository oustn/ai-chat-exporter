# Security Policy

## Reporting a vulnerability

Please do not open public issues for security reports or include access tokens, cookies, account IDs, or private conversation content in reports.

Use GitHub private vulnerability reporting for this repository. Include the affected version, reproduction steps, and the expected impact, with sensitive values removed.

## Credential handling

The extension reads short-lived platform credentials only in the active platform page context. Credentials and raw API responses must not be persisted in extension storage or logs.
