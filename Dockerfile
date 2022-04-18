# Build on Alpine
FROM alpine AS build

# Add build dependencies
RUN apk add npm

# Copy in source files
WORKDIR /build/
COPY . /build/

# Install node deps and build
RUN npm i && npm run build

# Start fresh
FROM alpine
WORKDIR /app/

# Add runtime dependencies
RUN apk add nodejs

# Copy in the built app
COPY --from=build /build/dist/ ./
COPY --from=build /build/node_modules/ ./node_modules/

# Set and expose the default port
ENV PORT=28104
EXPOSE 28104

# Start the server
CMD ["node", "server.js"]
