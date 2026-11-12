# amaliah_project

MAUN Semarang Infak & Zakat Platform (Pesantren Amaliah)

## Architecture

This project consists of 3 application services and an observability & CI/CD stack:
1. **Frontend**: React 19 + Vite + Tailwind CSS v4 ([`frontend`](./frontend)) — Port `3000`
2. **Backend**: Spring Boot 3 + PostgreSQL + Spring Security JWT ([`backend`](./backend)) — Port `8081`
3. **Payment Gateway**: Bank Simulator (BI-SNAP QRIS & Virtual Account) ([`payment gateway`](./payment%20gateway)) — Port `9090`
4. **Monitoring & Logging**:
   - **Prometheus**: Metrics collection & scraping (`/actuator/prometheus`) — Port `9091`
   - **Loki & Promtail**: Centralized log aggregation — Port `3100`
   - **Grafana**: Pre-provisioned dashboards & visualizer — Port `3001`
5. **CI/CD**:
   - **Jenkins**: Declarative pipeline automation (`Jenkinsfile`) — Port `8080`

---

## Getting Started

### Prerequisites
- Java 21+ / 25
- Node.js 18+ & npm
- Docker & Docker Compose (for Monitoring & Jenkins)
- PostgreSQL running on port `5432` with databases `maun_db` and `banksim_db`

### Quick Start Applications
Run all application services simultaneously:
```cmd
start-all.bat
```
Or with PowerShell:
```powershell
.\start-all.ps1
```

---

## Monitoring, Logging & CI/CD Stack

### Menjalankan Stack (Prometheus, Loki, Promtail, Grafana, Jenkins)
```bash
docker-compose up -d
```

### Akses Layanan Monitoring & CI/CD:
| Layanan | URL | Kredensial / Keterangan |
| :--- | :--- | :--- |
| **Grafana** | `http://localhost:3001` | User: `admin` / Password: `admin` (Datasource Prometheus & Loki otomatis terhubung) |
| **Prometheus** | `http://localhost:9091` | Metrics scraper engine |
| **Loki** | `http://localhost:3100` | Log query engine |
| **Jenkins** | `http://localhost:8080` | CI/CD build & test pipeline runner |
| **Swagger UI** | `http://localhost:8081/swagger-ui.html` | Dokumentasi interaktif REST API MAUN |
| **OpenAPI Docs** | `http://localhost:8081/v3/api-docs` | Raw OpenAPI v3 JSON spec |
| **Backend Actuator** | `http://localhost:8081/actuator/prometheus` | Spring Boot metrics endpoint |
