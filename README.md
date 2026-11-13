# amaliah_project

Amaliah Semarang Infak & Zakat Platform (Pesantren Amaliah)

## Architecture

This project consists of 2 application services and an observability & CI/CD stack:
1. **Frontend**: React 19 + Vite + Tailwind CSS v4 ([`frontend`](./frontend)) — Port `3000`
2. **Backend**: Spring Boot 3 + PostgreSQL + Spring Security JWT ([`backend`](./backend)) — Port `8081`
3. **Payment Gateway**: Xendit Payment Gateway (QRIS, VA, Invoice & Sandbox Simulator)
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
- PostgreSQL running on port `5432` with database `amaliah_db`

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
| **Swagger UI** | `http://localhost:8081/swagger-ui.html` | Dokumentasi interaktif REST API Amaliah |
| **OpenAPI Docs** | `http://localhost:8081/v3/api-docs` | Raw OpenAPI v3 JSON spec |
| **Backend Actuator** | `http://localhost:8081/actuator/prometheus` | Spring Boot metrics endpoint |

---

## Payment Gateway: Xendit Integration & Simulation

Platform Amaliah mendukung integrasi resmi dengan **Xendit Payment Gateway** (QRIS Dinamis, Virtual Account, & Checkout Invoice) serta mode dual fallback ke simulator internal.

### 1. Keamanan Kredensial (Secret Security)
Kunci rahasia API Xendit disimpan secara aman menggunakan file environment variable `.env` (diabaikan oleh git melalui `.gitignore`).
File `.env.example` disediakan sebagai acuan konfigurasi:
```env
PAYMENT_GATEWAY_PROVIDER=xendit
XENDIT_SECRET_KEY=xnd_development_...
XENDIT_API_URL=https://api.xendit.co
XENDIT_WEBHOOK_TOKEN=amaliah_xendit_webhook_token_2026
XENDIT_SIMULATION_ENABLED=true
```

### 2. Endpoints Webhook Xendit
- `POST /api/v1/xendit/callback/qr` : Webhook notifikasi pembayaran QRIS Xendit
- `POST /api/v1/xendit/callback/va` : Webhook notifikasi Virtual Account Xendit (BSI, BCA, Mandiri, BRI, BNI)
- `POST /api/v1/xendit/callback/invoice` : Webhook notifikasi Invoice Checkout Xendit

### 3. Simulasi Pembayaran Sandbox (Developer / QA)
Untuk menguji alur pembayaran tanpa harus transfer uang riil:

#### A. Simulasi Pembayaran QRIS
```bash
curl -X POST http://localhost:8081/api/v1/xendit/simulate/qr-payment \
  -H "Content-Type: application/json" \
  -d '{"transactionId": "DON-1794468637540-7CF8", "amount": 50000}'
```

#### B. Simulasi Pembayaran Virtual Account
```bash
curl -X POST http://localhost:8081/api/v1/xendit/simulate/va-payment \
  -H "Content-Type: application/json" \
  -d '{"transactionId": "DON-1794468637523-DFB2", "amount": 100000}'
```
Ketika endpoint simulasi dipanggil, sistem secara otomatis:
1. Memperbarui status donasi menjadi `SUCCESS` dan mencatat waktu bayar.
2. Menambah saldo terkumpul dan jumlah donatur pada kampanye secara atomik.
3. Mencatat mutasi kredit pada buku kas/rekening.
4. Membuat log transparansi publik.
5. Memancarkan event Server-Sent Events (SSE) secara real-time ke web klien.
