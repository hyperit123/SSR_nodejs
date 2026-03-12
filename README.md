#  Project Setup Guide

##  Installation

Install the required dependencies:

```bash
npm install nodemon express pg
```

---

##  Start the Database

Run PostgreSQL using **Docker**:

```bash
docker run --rm \
  --name my-postgres \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=mysecretpassword \
  postgres
```

>  **Tip:** You can also use **Podman** — it works almost exactly the same as Docker! **Tip2:** If your on linux don't forget sudo

---

##  Running the Server

### Development mode *(auto-restarts on file changes)*
```bash
npm run dev
```

### Production / stable mode *(no auto-restart)*
```bash
npm run serve
```

---

##  Quick Reference

| Command | Description |
|---|---|
| `npm install nodemon express pg` | Install dependencies |
| `npm run dev` | Start dev server with auto-reload |
| `npm run serve` | Start server without auto-reload |

---