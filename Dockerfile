FROM alpine

RUN apk add nodejs npm git

WORKDIR /app
COPY . /app/

RUN npm i

CMD ["npm", "run", "serve"]
