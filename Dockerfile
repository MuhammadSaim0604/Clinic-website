FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY . .

RUN npm run build

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

CMD ["npm", "start"]
