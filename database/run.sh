docker build -t npersia/db . && docker run --rm --name postsql1 -e POSTGRES_PASSWORD=1234 -e POSTGRES_USER=appdb -e POSTGRES_DB=appdb -p 5432:5432 npersia/db
