FROM node:20
SHELL ["/bin/bash", "-c"]
WORKDIR /src
COPY . .
RUN npm install -g pnpm
ENV PNPM_HOME="/usr/local/lib/node_modules/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN pnpm config set global-bin-dir "/usr/local/lib/node_modules/pnpm"
RUN pnpm install

CMD ["tail", "-f", "/dev/null"]