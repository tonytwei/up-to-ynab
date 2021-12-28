FROM alpine

RUN apk add nodejs npm git

WORKDIR /app
COPY . /app/

RUN npm i

ENV PORT=28104
EXPOSE 28104

CMD ["npm", "run", "serve"]
