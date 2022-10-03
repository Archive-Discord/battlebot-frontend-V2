# Common build stage
FROM node:16.14.2

COPY . ./app

WORKDIR /app
COPY .env .env.production
RUN yarn install
RUN yarn build
EXPOSE 3000

ENV NODE_ENV production

CMD ["yarn", "start"]