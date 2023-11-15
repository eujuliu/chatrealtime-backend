FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install \
&& npm run build

FROM node:18-alpine AS final
WORKDIR /app
COPY --from=builder ./app/dist/src ./src
COPY package.json .
COPY package-lock.json .
RUN npx prisma generate \
&& npm install --production

ARG PORT
EXPOSE ${PORT}
CMD ["npm", "run", "start"]