# Ticket Booking System

This repository contains a full-stack Ticket Booking System project with both a **backend** and a **frontend**.
-The backend is built with Node.js, Express, Prisma, and PostgreSQL,
-while the frontend is built with React/Next.js. Follow this guide to install, run, and deploy both parts of the application.

## Features

- **User Authentication:** Secure sign up and sign in using JWT.
- **Seat Booking:** Advanced logic for booking train seats with contiguous seat selection.
- **Real-Time Seat Status:** Frontend dynamically displays booked and available seats.
- **REST API:** Built with Node.js, Express, and Prisma.
- **Database:** Uses PostgreSQL for data storage.
- **Responsive Frontend:** Built with React/Next.js.
- **CI/CD:** Automated deployment via GitHub Actions with SSH to your production server.

## Api's

- https://documenter.getpostman.com/view/25650008/2sB2cPi4g7

## Prerequisites

- **Node.js:** v14 or higher (v16 or v18 recommended)
- **pnpm** or **npm**
- **PostgreSQL:** Ensure PostgreSQL is installed and running
- **Git:** For source control
- **AWS EC2 (optional):** For production deployment
- **NGINX & PM2 (optional):** For reverse proxy, SSL termination, and process management on the backend server

## Installation

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shivam2534/Ticket_booking_system.git
   cd Ticket_booking_system/workwise_backend
   npm install
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   npm run dev
   ```

### Frontend Setup

```bash
cd ../workwise_frontend
npm install
npm run dev
```
