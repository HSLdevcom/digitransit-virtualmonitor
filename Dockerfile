FROM node:10.15.3-alpine as build

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
RUN cd server
RUN npm install
CMD ["npm","run","start-prod"]

# CMD ['cd', 'server']
# CMD ['npm', 'start']

# Copy your code in the docker image
#FROM nginx:1.12-alpine
#COPY default.conf /etc/nginx/conf.d/default.conf
#COPY --from=build /app/build /usr/share/nginx/html
#CMD ["nginx", "-g", "daemon off;"]