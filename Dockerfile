FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install pm2 -g
COPY . .
CMD npm start
# ADD . .
# ENV NODE_ENV=development
