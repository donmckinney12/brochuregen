# Stage 1: Build the Go binary
FROM golang:1.23-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy go.mod and go.sum first to leverage Docker cache
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the source code
COPY . .

# Build the application as a statically linked binary
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o backend-go .

# Stage 2: Create a minimal runner image
FROM alpine:latest

WORKDIR /app

# Add ca-certificates for HTTPS requests (Go scraper needs this)
RUN apk --no-cache add ca-certificates

# Copy the binary from the builder stage
COPY --from=builder /app/backend-go .

# Expose the port
EXPOSE 8080

# Run the binary
CMD ["./backend-go"]
