# 📧 Email Authentication System

A full-stack Email Authentication system built with **TypeScript, React, Prisma, and Node.js**.  
This project allows users to submit their email, validates it on the backend, and stores authentication data in the database.

---

# 🚀 Features

- ✅ Email submission form
- ✅ Backend email validation
- ✅ Database storage using Prisma ORM
- ✅ Clean UI with Tailwind CSS
- ✅ Type-safe development with TypeScript
- ✅ Production-ready structure
- ✅ Vercel deployment support

---

# 🛠 Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- API Routes
- Prisma ORM

### Database
- PostgreSQL / SQLite

---

# 📦 Installation Guide

## 1️⃣ Clone Repository

```bash
git clone https://github.com/nabeelahmad55/Email-authentication.git
cd Email-authentication
```

## 2️⃣ Install Dependencies

```bash
pnpm install
```

or

```bash
npm install
```

---

## 3️⃣ Setup Environment Variables

Create `.env` file in root:

```env
DATABASE_URL="your_database_url_here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```


---

## 4️⃣ Setup Prisma

Generate Prisma client:

```bash
pnpm prisma generate
```

Run migrations:

```bash
pnpm prisma migrate dev --name init
```

Open Prisma Studio:

```bash
pnpm prisma studio
```

---

## 5️⃣ Run Development Server

```bash
pnpm dev
```

App will run on:

```
http://localhost:3000
```

---

# 📂 Project Structure

```
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── components/
│   ├── pages/
│   ├── api/
│   └── lib/
├── public/
├── .env
├── package.json
└── vercel.json
```

---

# 🔐 API Documentation

## Base URL (Local)

```
http://localhost:3000/api
```

---

## 📌 1. Submit Email

### Endpoint

```
POST /api/email
```

### Request Body

```json
{
  "email": "example@gmail.com"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Email submitted successfully"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Invalid email format"
}
```

---

### Success Response

```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

# 🧪 API Testing with cURL

### Submit Email

```bash
curl -X POST http://localhost:3000/api/email \
-H "Content-Type: application/json" \
-d '{"email":"test@example.com"}'
```

---

# 🖼 Screenshots

> Add screenshots inside a `/screenshots` folder in your repo.

## 🏠 Landing Page

```
![Landing Page](./screenshots/landing.png)
```

## 📩 Email Submission Success

```
![Success Message](./screenshots/success.png)
```

## 🗄 Prisma Studio View

```
![Database View](./screenshots/database.png)
```

---

# 🔄 How It Works

1. User enters email on frontend.
2. Frontend sends POST request to backend API.
3. Backend validates email format.
4. Email is stored in database using Prisma.
5. (Optional) Verification email is sent.
6. User verifies email via token link.
7. Database updates verification status.

---

# 🛡 Validation Logic

- Email format validation using regex
- Duplicate email prevention (unique constraint in Prisma)
- Token expiration handling (if verification enabled)

---

# 📈 Production Deployment

## Deploy to Vercel

1. Push code to GitHub
2. Connect repository in Vercel
3. Add environment variables
4. Deploy

---

# 📜 Available Scripts

| Command | Description |
|----------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm prisma studio` | Open database UI |
| `pnpm prisma migrate dev` | Run migrations |

---

# 🧠 Future Improvements

- Add JWT-based authentication
- Add rate limiting
- Add email verification via external provider
- Add resend verification feature
- Add admin dashboard

---

# 👨‍💻 Author

**Nabeel Ahmad**

Full Stack Developer  
4+ Years Experience (PHP, .NET, Python, React, TypeScript, Node)

---

# 📄 License

This project currently does not include a license.  
You may add MIT License if making it open source.

---

⭐ If you like this project, consider giving it a star on GitHub!
