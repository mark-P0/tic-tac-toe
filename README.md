# Tic-Tac-Toe

## Running Locally

> This project uses [`pnpm`](https://pnpm.io/) as a monorepo and package manager

1. Clone the repository

   ```sh
   git clone git@github.com:mark-P0/tic-tac-toe.git tic-tac-toe
   cd tic-tac-toe
   ```

1. Install dependencies

   > Can move on to next steps while waiting

   ```sh
   pnpm i
   ```

1. Create a copy of `.env-template`, e.g. as `.env`

   ```sh
   cp .env-template .env
   ```

1. Fill out all fields in the `.env` template

   > If running the API locally, a common base URL is `http://localhost:3000`;
   > otherwise use the URL of the deployed service

1. Copy accomplished `.env` to both `packages/api` and `packages/ui`

   > A runtime `.env` utility will extract the needed variables for each package

   ```sh
   cp .env packages/api/.env
   cp .env packages/ui/.env
   ```

1. Start API

   ```sh
   pnpm --filter=@tic-tac-toe/api dev

   # or
   cd packages/api
   pnpm dev
   ```

1. Start UI

   > UI can start even without API

   > Ensure API base URL is properly filled out and accessible, e.g. on a browser

   ```sh
   pnpm --filter=@tic-tac-toe/ui dev

   # or
   cd packages/ui
   pnpm dev
   ```

## Credits

- Favicon generated from [Favicon.io](https://favicon.io/favicon-generator/)
