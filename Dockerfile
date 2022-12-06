FROM node:16.17.1-bullseye-slim

WORKDIR /app
# Install pnpm
RUN npm install -g pnpm

# Prepare for running pnpm install.
COPY --chown=node:node . /app
RUN pnpm install --shamefully-hoist
RUN pnpm build
RUN pnpm install @nuxt/ufo

USER node

EXPOSE 3000
ENV NUXT_HOST=0.0.0.0
ENV PORT 3000
ENV NUXT_PORT 3000

CMD ["pnpm", "start"]
