# Deployment Contract (Containerized Project)

## Purpose
Deploy this repository to a shared VPS safely, without breaking other projects.

## Infrastructure
- VPS host: 85.215.147.49
- SSH user: deploy
- Auth: SSH key only
- Reverse proxy: Caddy runs in shared infra stack
- Shared Docker network: infra_default
- Shared Postgres: one database per project (do not touch other DBs)

## Non-Negotiable Safety Rules
1. Only deploy this project’s service(s).
2. Never run global shutdown commands (`docker compose down`, `docker stop $(docker ps -q)`, etc.).
3. Never recreate or remove shared infra services (Caddy/Postgres) unless explicitly requested.
4. Never edit routes for other domains.
5. Never remove shared volumes or networks.
6. If a command would affect multiple projects, stop and ask.

## Required Deployment Inputs (must be set in each repo)
- PROJECT_NAME: (example: reward-board)
- DOMAIN: (example: reward-board.olha.dev)
- SERVICE_NAME: docker compose service to update (example: reward-board)
- INTERNAL_PORT: container app port (example: 3003)
- IMAGE_NAME: GHCR image for this repo
- HEALTHCHECK_URL: `https://<DOMAIN>`

## Standard Deploy Procedure
1. Build and tag image for this repo only.
2. Push image to GHCR.
3. SSH to VPS.
4. Pull only this service image.
5. Restart only this service (`up -d --no-deps <SERVICE_NAME>`).
6. Verify health endpoint/domain returns expected success.
7. If verification fails, rollback to previous known-good image tag.

## Allowed Commands (examples)
- `docker compose pull <SERVICE_NAME>`
- `docker compose up -d --no-deps <SERVICE_NAME>`
- `docker compose logs --tail=200 <SERVICE_NAME>`
- `curl -I https://<DOMAIN>`

## Forbidden Commands
- `docker compose down`
- `docker system prune -a`
- Any command targeting all containers/services globally
- Any change to unrelated project compose files or Caddy routes

## Rollback Policy
If deploy fails:
1. Re-deploy previous image tag for this service only.
2. Re-run health check.
3. Report failure cause and last known-good tag.

## Done Criteria
- Service is running
- Domain responds correctly over HTTPS
- No other project was restarted or changed
- Deployment log includes image tag, timestamp, and health-check result