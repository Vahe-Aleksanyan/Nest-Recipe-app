# Base image
FROM node:18

# Create app directory
WORKDIR app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY . .

# Install app dependencies
RUN npm ci

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]