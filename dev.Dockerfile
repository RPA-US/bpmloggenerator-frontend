# pull the official base image
FROM node:alpine
# set working direction
WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# install application dependencies
COPY package.json npm-shrinkwrap.json ./
RUN npm install
# add app
COPY . ./
# build start app
RUN ["chmod", "+x", "/app/entry-dev.sh"]
ENTRYPOINT sh "/app/entry-dev.sh"