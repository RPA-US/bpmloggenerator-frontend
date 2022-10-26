# pull the official base image
FROM node:alpine
# set working direction
WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# install application dependencies
COPY package.json yarn.lock ./
RUN yarn install
RUN yarn global add serve
# add app
COPY . ./
RUN yarn build
# start app
CMD ["serve", "--debug", "-s", "build"]