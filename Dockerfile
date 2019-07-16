FROM node:10.15.3

WORKDIR /app
ADD . /app
RUN npm install
RUN npm run prepare

#Make the port 3000 available to the world outside this container 
EXPOSE 3000

# build the app
RUN npm build

# Start command as per package.json
CMD ["npm","start"]