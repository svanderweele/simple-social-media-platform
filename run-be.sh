# Setup API
cd backend

# Running databases and kafka
export HOST_IP=$(ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1)
docker-compose up resources --build 

# Running APIs
sleep 5

docker-compose up account-api -d --build 
docker-compose up friends-api -d --build 
docker-compose up realtime-api -d --build 

# Seeding the Database
sleep 5

curl --location 'http://localhost:3001/auth/register' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF3ZXNvbWUudGhvbWFzKzJAZ21haWwuY29tIiwiaWQiOiI4ZTBhYmJkYi0yNjg3LTQ3NDUtODg4Ni1mOTRmMmRiYTUzODAiLCJpYXQiOjE3MjIwOTc4OTMsImV4cCI6MTcyMjE4NDI5M30.-5xXEdAQOwG26QNSwCbkIS9-a2jO8zUq57127Or26Z4' \
--data-raw '{
    "email":"ricky@gmail.com",
    "password":"SomeAwesomePa$$work123",
    "name":"Ricky Granger"
}'

curl --location 'http://localhost:3001/auth/register' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF3ZXNvbWUudGhvbWFzKzJAZ21haWwuY29tIiwiaWQiOiI4ZTBhYmJkYi0yNjg3LTQ3NDUtODg4Ni1mOTRmMmRiYTUzODAiLCJpYXQiOjE3MjIwOTc4OTMsImV4cCI6MTcyMjE4NDI5M30.-5xXEdAQOwG26QNSwCbkIS9-a2jO8zUq57127Or26Z4' \
--data-raw '{
    "email":"thomas@gmail.com",
    "password":"SomeAwesomePa$$work123",
    "name":"Thomas Pickle"
}'

curl --location 'http://localhost:3001/auth/register' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF3ZXNvbWUudGhvbWFzKzJAZ21haWwuY29tIiwiaWQiOiI4ZTBhYmJkYi0yNjg3LTQ3NDUtODg4Ni1mOTRmMmRiYTUzODAiLCJpYXQiOjE3MjIwOTc4OTMsImV4cCI6MTcyMjE4NDI5M30.-5xXEdAQOwG26QNSwCbkIS9-a2jO8zUq57127Or26Z4' \
--data-raw '{
    "email":"michael@gmail.com",
    "password":"SomeAwesomePa$$work123",
    "name":"Michael Thompson"
}'


