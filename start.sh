#!/bin/sh

npx prisma generate
npx prisma migrate dev
npm run build
npm start
