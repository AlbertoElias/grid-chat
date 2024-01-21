# Grid Chat Server

## Dependencies

Install PostgreSQL https://www.postgresql.org/download/ and make sure it's running in the background.

## Usage

To get it running:

1. `npm i`
2. `cp .env.example .env`
3. Fill in your .env file with your credentials.
4. `npm run migration:generate`
5. `npm run migration:run`
6. `npm run dev`
