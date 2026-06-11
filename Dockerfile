FROM node:25.9.0-alpine AS build

RUN apk update
RUN apk add git

WORKDIR /app

EXPOSE 3001

# Copy build config and dependency manifest before install for layer caching
COPY package.json package-lock.json webpack.config.js babel.config.js tsconfig.json .npmrc ./

# Install all dependencies, including devDeps required for the TypeScript build
RUN npm ci

# Copy source and public files
COPY ./src ./src
COPY ./public ./public

# Build the React app
RUN npm run build

# Install server dependencies
COPY ./server ./server
RUN cd server && npm ci

CMD ["npm","run","start-prod"]
