FROM node:25.9.0-alpine as build

RUN apk update
RUN apk add git

WORKDIR /app

EXPOSE 3001

# Copy build config and dependency manifest before install for layer caching
COPY package.json webpack.config.js babel.config.js tsconfig.json ./

# Install all dependencies, including devDeps required for the TypeScript build
RUN npm install

# Copy source and public files
COPY ./src ./src
COPY ./public ./public

# Build the React app
RUN npm run build

# Install server dependencies
COPY ./server ./server
RUN cd server && npm install

CMD ["npm","run","start-prod"]
