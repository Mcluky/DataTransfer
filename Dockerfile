FROM node:12.9-alpine
EXPOSE 5555

# Install front end
RUN mkdir -p /Client/
COPY /Client/package.json /Client/
WORKDIR /Client/
RUN npm i

WORKDIR /

# Install back end
RUN mkdir -p /Server/
RUN mkdir -p /Server/static/
COPY /Server/package.json /Server/
WORKDIR /Server/
RUN npm i

# Build front end
WORKDIR /Client/
COPY /Client/ .
RUN npm run-script build

# Build back end
WORKDIR /Server/
COPY /Server/ .
RUN npm run-script build

# copy frontend into server
RUN cp -a /Client/public/. /Server/static/

CMD ["npm", "start"]