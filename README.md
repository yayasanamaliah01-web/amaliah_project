# amaliah_project

MAUN Semarang Infak & Zakat Platform (Pesantren Amaliah)

## Architecture

This project consists of 3 main services:
1. **Frontend**: React 19 + Vite + Tailwind CSS v4 ([`frontend`](./frontend))
2. **Backend**: Spring Boot 3 + PostgreSQL + Spring Security JWT ([`backend`](./backend))
3. **Payment Gateway**: Bank Simulator (BI-SNAP QRIS & Virtual Account) ([`payment gateway`](./payment%20gateway))

## Getting Started

### Prerequisites
- Java 21+ / 25
- Node.js 18+ & npm
- PostgreSQL running on port `5432` with databases `maun_db` and `banksim_db`

### Quick Start
Run all services simultaneously:
```cmd
start-all.bat
```
Or with PowerShell:
```powershell
.\start-all.ps1
```
