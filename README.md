# How to run

You need docker installed in your machine.

1. Create environment variables.

- Database - Create file `.db` in the folder `./.env`, with the following content:
  ```
  POSTGRES_DB=database
  POSTGRES_USER=user
  POSTGRES_PASSWORD=simplepass
  ```
- NextJs - Create file `.env` in the folder `./services/nextjs`, with the following content:
  ```
  DATABASE_URL="postgresql://user:simplepass@db:5432/database?connect_timeout=300"
  ```

2. Open terminal and navigate - using `cd` - to the project folder
3. Run `docker compose build` to build the docker containers.
4. Run `docker compose up` to initiate the docker containers.
5. Access the website at `localhost:3000` in the browser.
6. To stop the container press the hotkey `control + c`, or close the terminal where the containers where initiated.
7. In order access the _web_ server environment - "nextjs" container - run `docker exec -it nextjs /bin/bash`.
8. While on the _web_ server environment you could run the seed command `npx prisma db seed`

## Endpoints

- http://localhost:3000/api/regenerate-users?userCount=500 - Regenerates database with sample data (expects userCount url parameter)
- http://localhost:3000/api/get-users - Gets all users
- !! There's no /get-user since while using NextJs I can use `getServerSideProps` to run the query on the server side.

# Architecture and choice of languages/frameworks

In a nutshell I looked to use typescript, for the type safety and reassure development workflow.
In retrospect the task wasn't "type" heavy but TS was still helpful.

## Tech used

- Next JS (npm, react, node) - Taken the requirements of the task NextJS is a great match. It covers both frontend(react) and backend(node) with a great deal of flexibility. Also having the npm ecosystem improves frontend productivity.
- Prisma - A NodeJS ORM, that is very easy to use - allowed for easier database queries and api endpoints implementations.
- Typescript - Made coding more rounded, with less compilation/runtime errors.
- PostgreSQL - For being a powerful database specially when quantity comes to matter, also Prisma supported it.
- Tailwind - Easy to use CSS utilities, faster styling/prototyping.

# WWhat would I improve?

- Optimize **nextjs** docker image for production and dev distinction; Ensure docker and project folders are syncing up.
- Replace **fetch** with **axios**, and add an interceptor to catch errors and update a context affecting the UI to display to the use that an error has happened.
- Add jest ts support; Create unit tests using **jest**; Make code more testable...
- Optime seed script to make better use of Prisma composed queries such as **upsert**
