FROM node:lts


EXPOSE 3000 35729
WORKDIR /app

CMD yarn && yarn dev 