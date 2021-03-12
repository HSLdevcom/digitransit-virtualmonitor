FROM node:10.15.3

WORKDIR /app
#Make the port 3000 available to the world outside this container 
EXPOSE 3000
# Start command as per package.json
CMD ["npm","start"]
# Install app dependencies
COPY package.json /app
RUN npm install
# build the app
RUN npm build

# Copy your code in the docker image
COPY . /app