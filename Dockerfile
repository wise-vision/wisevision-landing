FROM node:lts


EXPOSE 3000 35729
WORKDIR /app

CMD cd /doc && yarn build && cd /app && yarn && yarn dev

# CMD yarn && yarn dev 