# Open QR

This project is a QR code generator that generates a single QR code for both Play Store and App Store app links. The QR code will redirect the user to the correct app store based on their device. iOS users will be redirected to the App Store, while Android users will be redirected to the Play Store.

## Technologies Used
This project was built using the following technologies:

- **Next.js**: A React framework for building server-side rendered (SSR) and static websites. Have used latest released stable App directory [Next 13.4](https://nextjs.org/blog/next-13-4).
- **Prisma**: A modern database toolkit for TypeScript and Node.js that provides an ORM (Object-Relational Mapping) layer for database operations.
- **Supabase**: For postgres Database
- **React** QR: QR Code generation


```bash
# Local Setup
npm install
npx prisma db push
npm run dev
```

```bash
# .env
DATABASE_URL=''
```
