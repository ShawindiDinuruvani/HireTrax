# HireTrax

HireTrax is a recruitment/hiring management system with a **.NET 8 Web API backend** (MySQL + Entity Framework Core) and a **React + Vite frontend**.

## Tech Stack

| Layer    | Technology                                  |
|----------|----------------------------------------------|
| Backend  | ASP.NET Core 8 Web API, Entity Framework Core, Pomelo MySQL, JWT Auth |
| Database | MySQL 8.0                                     |
| Frontend | React 19, Vite 8, React Router                |

---

## Prerequisites

Make sure the following are installed before you start:

- [Git](https://git-scm.com/)
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) — verify with `dotnet --version`
- [Node.js 20+](https://nodejs.org/) — verify with `node --version` and `npm --version`
- [MySQL Server 8.0](https://dev.mysql.com/downloads/mysql/) — must be installed and running locally

---

## 1. Clone the repository

```bash
git clone https://github.com/ShawindiDinuruvani/HireTrax.git
cd HireTrax
```

The project has two main folders:

```
HireTrax/
├── backend/HireTax.API   # .NET 8 Web API
└── frontend/              # React + Vite app
```

---

## 2. Backend Setup

```bash
cd backend/HireTax.API
```

### 2.1 Configure the database connection

Open `appsettings.Development.json` and update the `DefaultConnection` string with **your own MySQL credentials**:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Port=3306;Database=HireTraxDb;User=root;Password=YOUR_MYSQL_PASSWORD;"
}
```

> ⚠️ Do not keep the password that ships in the repo — it belongs to the original author's machine and will not work on yours.

### 2.2 Create the database

Log in to MySQL and create the database (the app applies migrations automatically, but the database itself must exist):

```bash
mysql -u root -p
```

```sql
CREATE DATABASE IF NOT EXISTS HireTraxDb;
```

If you're not sure your MySQL password is correct, test it first with `mysql -u root -p`. If login fails, reset the password:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'YOUR_NEW_PASSWORD';
FLUSH PRIVILEGES;
```

### 2.3 Restore and run

```bash
dotnet restore
dotnet run
```

Migrations run automatically on startup (`db.Database.Migrate()` in `Program.cs`), so you don't need to run `dotnet ef database update` manually.

The API will start at:
- **http://localhost:5027** (Swagger UI opens automatically at `/swagger`)

### 2.4 Optional: external service keys

`Twilio`, `SendGrid`, and `Google` API keys in `appsettings.Development.json` can be left empty — the app runs fine without them. Only fill them in if you need SMS, email, or calendar features to actually work.

---

## 3. Frontend Setup

Open a **new terminal** (keep the backend running in the other one):

```bash
cd frontend
npm install
npm run dev
```

> Note: the command is `npm run dev`, not `npm dev run` — word order matters.
>
> If you see `'vite' is not recognized as an internal or external command`, it means `npm install` wasn't run yet (or failed) — the `node_modules` folder is missing. Run `npm install` first, then `npm run dev`.

The frontend will start at:
- **http://localhost:5173**

Vite is already configured to proxy `/api` requests to the backend at `http://localhost:5027`, and the backend already allows CORS from `http://localhost:5173`, so no extra configuration is needed.

---

## 4. Running the App

Once both servers are running:

1. Backend → `http://localhost:5027/swagger`
2. Frontend → `http://localhost:5173`

Open the frontend URL in your browser to use the app.

---

## 5. Optional: Seed Test Data

With the backend running, you can populate sample companies, recruiters, jobs, and applications:

```bash
cd frontend
node seed.js
```

Default admin login (created by migrations):
- **Email:** `admin@gmail.com`
- **Password:** `admin123`

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `Access denied for user 'root'@'localhost'` | Wrong MySQL password in `appsettings.Development.json` | Update the connection string with your real MySQL password |
| `Unknown command: "dev"` | Typed `npm dev run` instead of `npm run dev` | Use `npm run dev` |
| `'vite' is not recognized...` | `node_modules` missing | Run `npm install` before `npm run dev` |
| Backend fails at `db.Database.Migrate()` | Database `HireTraxDb` doesn't exist yet | Run `CREATE DATABASE HireTraxDb;` in MySQL |

---

## License

Refer to the repository owner for licensing details.
