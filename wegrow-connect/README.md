This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


wegrow-connect/
│
├── public/
│   ├── images/
│   ├── icons/
│   ├── logo/
│   └── favicon.ico
│
├── src/
│
│   ├── app/
│   │
│   │   ├── (public)/
│   │   │   ├── page.tsx
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── events/
│   │   │   └── workshops/
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── verify-otp/
│   │   │
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── dashboard/
│   │   │   ├── users/
│   │   │   ├── roles/
│   │   │   ├── workshops/
│   │   │   ├── events/
│   │   │   ├── subscriptions/
│   │   │   ├── payments/
│   │   │   ├── certificates/
│   │   │   ├── rewards/
│   │   │   ├── reports/
│   │   │   ├── notifications/
│   │   │   └── settings/
│   │   │
│   │   ├── user/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   ├── my-events/
│   │   │   ├── my-workshops/
│   │   │   ├── my-subscription/
│   │   │   ├── rewards/
│   │   │   ├── certificates/
│   │   │   ├── notifications/
│   │   │   └── settings/
│   │   │
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── ui/
│   │   ├── auth/
│   │   ├── admin/
│   │   ├── user/
│   │   └── layouts/
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── admin.service.ts
│   │   ├── workshop.service.ts
│   │   ├── event.service.ts
│   │   ├── payment.service.ts
│   │   └── notification.service.ts
│   │
│   ├── store/
│   │   ├── index.ts
│   │   ├── authSlice.ts
│   │   ├── userSlice.ts
│   │   ├── adminSlice.ts
│   │   └── eventSlice.ts
│   │
│   ├── hooks/
│   │
│   ├── context/
│   │
│   ├── lib/
│   │   ├── axios.ts
│   │   ├── auth.ts
│   │   ├── constants.ts
│   │   └── utils.ts
│   │
│   ├── middleware.ts
│   │
│   ├── types/
│   │
│   ├── utils/
│   │
│   ├── constants/
│   │
│   └── styles/
│       └── globals.css
│
├── .env.local
├── .gitignore
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md