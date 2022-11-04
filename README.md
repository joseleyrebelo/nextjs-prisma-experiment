# How to run

You need docker installed in your machine.

1. Run `docker compose build` followed by `docker compose up`.
2. This should start the container and expose `localhost:3000`.
3. Alt the run by pressing the hotkey Control+C, or close the bash session.

# Architecture and choice of languages/frameworks

In a nutshell I looked to use typescript, for its type robustness and everything else revolves around it .
In retrospect the task wasn't "type" heavy but it still revealed itself as amazingly helpful.

## Tech ussed

- Next JS (npm, react, node) - Taken the requirements of the task NextJS is a great match. It covers both frontend(react) and backend(node) with a great deal of flexibility. It's ecosystem with npm and node means shared utility code, packages/dependencies and types (typescript) for an easier flow of development.
- Prisma - A NodeJS ORM, that is very easy to use - allows for easier api endpoints implementations.

### Typescript

The productivy to robustness is a slow to exponencial graph. Even tthough this task was of smalll scope typescript still proved very useful - also Prisma generates types based on the tables/models declared which makes it a better development experiene overall.

### PostgreSQL

I have made use of PostgreSQL for being a powerful database when quantity comes to matter, also Prisma supported it.

# Imporovements

1. Optimize NextJs docker image for less volume. Ran into an error using alpine, used node:19 instead.
2. Make code more testatble.
