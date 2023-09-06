# pull the official base image
FROM node:14.18.3-alpine
# set working direction
WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# install application dependencies
COPY package.json npm-shrinkwrap.json ./
RUN npm install yarn
RUN npm install
RUN yarn global add serve
# add app
COPY . ./
# build start app
RUN ["chmod", "+x", "./entry.sh"]
ENTRYPOINT ["./entry.sh"]
