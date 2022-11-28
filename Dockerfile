FROM node:16.17.1-alpine

WORKDIR /app

# Prepare for running pnpm install.
COPY . /app

# Install pnpm
RUN npm install -g pnpm

RUN pnpm install
RUN pnpm build

EXPOSE 3000
ENV NUXT_HOST=0.0.0.0
ENV PORT 3000
ENV NUXT_PORT 3000

CMD ["pnpm", "start"]
