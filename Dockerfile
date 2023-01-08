FROM node:19.4-alpine3.16

# Define working directory
WORKDIR /home/node

# Copy npm files
COPY package.json package.json
COPY package-lock.json package-lock.json

# Copy source files
COPY src src

# Install dependencies
RUN npm install

# Default command
CMD ["npm ", "start"]
