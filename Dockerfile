FROM node:14.17.5-alpine as build

RUN apk update
RUN apk add git

WORKDIR /app
ADD . ./
#Make the port 3000 available to the world outside this container 
EXPOSE 3001
# Start command as per package.json

# Install app dependencies
COPY package.json ./
COPY ./src ./src
COPY ./public ./public
COPY ./server ./server
RUN npm install
# build the app
RUN npm run build
RUN cd server && npm install

CMD ["npm","run","start-prod"]
