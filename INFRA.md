### Caddyfile
olha.dev {
    reverse_proxy portfolio:3000
}

www.olha.dev {
    redir https://olha.dev{uri} permanent
}

generateaiart.olha.dev {
    reverse_proxy generateaiart:3001
}

inner-circle.olha.dev {
    reverse_proxy inner-circle:3002
}

reward-board.olha.dev {
    root /srv/static/reward-board
    encode zstd gzip
    try_files {path} /index.html
    file_server
}

justwrite.olha.dev {
    reverse_proxy justwrite:3004
}

theoffice-quiz.olha.dev {
   root /srv/static/theoffice-quiz
   encode zstd gzip
   try_files {path} /index.html
   file_server
}

dog-breeds.olha.dev {
   root /srv/static/dog-breeds
   encode zstd gzip
   try_files {path} /index.html
   file_server
}

### docker-compose

``` yml
services:
  caddy:
    image: caddy:2
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
      - /srv/static:/srv/static:ro

  postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "127.0.0.1:5432:5432"

volumes:
  caddy_data:
  caddy_config:
  pgdata:
```
