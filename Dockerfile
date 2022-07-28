# Common build stage
FROM node:16.14.2

COPY . ./app

WORKDIR /app

RUN yarn
RUN yarn build
EXPOSE 3000

ENV NODE_ENV production

CMD ["yarn", "start"]