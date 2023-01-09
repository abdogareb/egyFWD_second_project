# Getting Started

- To get started, clone this repository and run 'npm i' in your terminal at the top of the project.

- you should create a .env file in the repo, it should contain the variable as in the .env.example file

- you should create two databases with the values you set in POSTGRES_DB,POSTGRES_TEST_DB

- To start the app run `npm run start`

# overview

## 1. DB creation and Migrations

- to run migrations up on dev environment run 'npm run dev-startup' and to run migrations down run 'npm run dev-resetdb'

- no migrations is needed to run the tests as the test script will do the up and down migrations. but if you want to run migrations up on test use 'npm run dbtest-up' and to run down run 'npm run dbtest-down'

## 2. API endpoints

- Check REQUIREMENTS.md

## 3. Authentication

- on user creation or successful authentication, user is provided with a token, make sure to add it in the authorization header for routes that require authentication to work correctly.

## 4. QA and `README.md`

- to run tests run `npm run test`

## 5. Local host ports

- For the database, port is not specified so it will run on the selected port at postgres installation (default is 5432)

- Server is running on port 3000
