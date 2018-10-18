FROM node:alpine
LABEL name=opensource-backend

RUN apk add --no-cache tzdata
RUN cp /usr/share/zoneinfo/US/Eastern /etc/localtime
RUN echo "US/Eastern" > /etc/timezone
RUN apk del tzdata


# Create work directory
WORKDIR /app
COPY dist/ dist/
COPY package.json yarn.lock .env.example ./

# Install runtime dependencies
RUN npm install yarn -g

# Copy app source to work directory
COPY . /app

# Install app dependencies
RUN yarn --production

EXPOSE 3001

# Build and run the app
CMD npm start serve
