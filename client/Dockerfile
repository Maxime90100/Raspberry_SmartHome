FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npx", "serve", "-s", "dist", "-l", "5173"]