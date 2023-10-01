FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:18-alpine AS final
WORKDIR /app
COPY --from=builder ./app/dist/src ./src
COPY package.json .
COPY package-lock.json .
COPY .env .
RUN npx prisma generate \
&& npm install --production

EXPOSE 3000
CMD ["npm", "run", "start"]