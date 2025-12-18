# Internship Portal (Vue)

Frontend project for finding and managing internships with **Student / Company / Admin** roles.

**Live demo:** https://intership-rose.vercel.app/  
**Repo:** https://github.com/damirrakhymberdi/Intership

## What you can do
- Auth with protected pages (token in localStorage)
- **Internships**: list + search/filter + create (modal) + edit (detail page) + delete (company/admin)
- **Applications**: student applies, company reviews and changes status
- **Profile**: edit name (company can also edit company name)

## Tech
Vue 3, Vite, Vue Router, Pinia, Axios, MockAPI.io

## Run locally

```bash
npm install
npm run dev
```

## API
MockAPI base URL (optional):

```bash
VITE_API_URL=https://6940d6fe993d68afba6d2a88.mockapi.io/api/v1
```

## Test accounts
You can create users from the **Sign up** modal on the login page.

Users are stored in MockAPI `/users` with fields:
- `email`, `password`, `role`, `name`, optional `companyName`
