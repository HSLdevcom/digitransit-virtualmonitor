FROM node:10.15.3

# Install app dependencies
#COPY package.json package.json
#COPY package-lock.json package-lock.json
WORKDIR /app
ADD . /app
#Install typescript configs
#COPY tsconfig.json tsconfig.json
#COPY tsconfig.prod.json tsconfig.prod.json
#COPY tsconfig.test.json ts.config.test.json
#COPY tslint.json tslint.json
#COPY tslint.prod.json tslint.prod.json
#COPY images.d.ts images.d.ts
#COPY .esmrc .esmrc

RUN npm install

# Copy Source
#ADD src src
#ADD patches patches
#ADD public public

#Make the port 3000 available to the world outside this container 
EXPOSE 3000

# build the app
RUN npm build

# Start command as per package.json
CMD ["npm","start"]