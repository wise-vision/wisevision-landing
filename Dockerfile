FROM node:lts

EXPOSE 3000 35729
WORKDIR /app

CMD cd doc && yarn && yarn build && cd /app && yarn && yarn dev

# # Stage 1: Build the Docusaurus Documentation
# FROM node:lts AS builder

# WORKDIR /app
# COPY . .

# # Install dependencies and build Docusaurus
# RUN yarn install && cd doc && yarn build

# # Stage 2: Run Next.js page
# FROM node:lts

# WORKDIR /app

# # Copy necessary files from builder stage
# COPY --from=builder /app/package.json /app/yarn.lock /app/
# COPY --from=builder /app/doc/build /app/public/static/doc

# # Install dependencies
# RUN yarn install

# # Copy the rest of the application code
# COPY --from=builder /app .

# EXPOSE 3000

# # Run the Next.js app in development mode
# CMD ["yarn", "dev"]
