FROM node:lts-alpine

ENV NODE_ENV production

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

## Add the wait script to the image
ADD wait /wait
RUN chmod +x /wait

EXPOSE 3000

CMD /wait && node server.mjs