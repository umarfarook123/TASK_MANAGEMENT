# TASK MANANGEMENT

cmd :

cd backend
npm i
run cmd: pm2 start 

Intial Seed for admin :
    
API :

curl --location 'http://localhost:1233/tasks/admin-seed'

sample response:
{
    "status": true,
    "message": "Admin data Seeded Succesfully!"
}

user signup

curl --location 'http://localhost:1233/tasks/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userName": "Umar",
    "email": "farook@gmail.com",
    "firstName": "Farook",
    "lastName": "S",
    "password": "Osiz@123",
    "dob": "1999-10-19"
}'

//username & email must be unique

response:

{
    "status": true,
    "message": "Signup Succesfully!"
}


user & admin login


curl --location 'http://localhost:1233/tasks/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "findField": "admin@gmail.com",
    "password": "admin@123"
}'


user & admin can login with username or either mail to login to get token

{
    "status": true,
    "message": "Login Successfully!",
    "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMzYzQ5MjE2YzIwY2JiMjM2MjQ4ZGYiLCJpYXQiOjE3MDczMjg4NjcsImV4cCI6MTcwNzMzMjQ2N30.W_N0fabRfzsv-LnkHkaoRZ6EhAblFPCpuERLTah4Bdk"
}


View User Data List: (Only Admin Can ) :

curl --location 'http://localhost:1233/tasks/user-data-list' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWYxOGUxM2M1NGQxYWUxNzNjMTBmYTEiLCJpYXQiOjE3MTA0MDE0ODUsImV4cCI6MTcxMDQwNTA4NX0.tgqC7LGBxvv12FYIZGFTBP0RNV7Ur1iL6gt6xSh6_V4' \
--header 'Content-Type: application/json' \
--data '{
    "page": 0,
    "size": 2
}'

Sample Response:

{
    "status": true,
    "message": "Success",
    "data": [
        {
            "_id": "65f2ab6599c6b128677c8e9f",
            "userName": "umar",
            "email": "farook@gmail.com",
            "dob": "1999-10-19T00:00:00.000Z"
        },
        {
            "_id": "65f18f11254809afb80c8e9c",
            "userName": "umar",
            "email": "farook@gmail.com",
            "dob": "1999-10-19T00:00:00.000Z"
        }
    ],
    "count": 3
}


Assign Tasks:

curl --location 'http://localhost:1233/tasks/add-task' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWYxOGUxM2M1NGQxYWUxNzNjMTBmYTEiLCJpYXQiOjE3MTA0MDE0ODUsImV4cCI6MTcxMDQwNTA4NX0.tgqC7LGBxvv12FYIZGFTBP0RNV7Ur1iL6gt6xSh6_V4' \
--header 'Content-Type: application/json' \
--data '{
    "title": "TASK 1",
    "description": "User Task",
    "dueDate": "2024-03-30",
    "userId": "65f18f11254809afb80c8e9c" 
}'

response for admin login token:

{
    "status": true,
    "message": "Tasks added successfully"
}

sample response for user login token:

{
    "status": false,
    "message": "you are not allowed"
}


All Tasks list -- only admin can view this

curl --location 'http://localhost:1233/tasks/all-tasks-list' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWYxOGUxM2M1NGQxYWUxNzNjMTBmYTEiLCJpYXQiOjE3MTA0MDE0ODUsImV4cCI6MTcxMDQwNTA4NX0.tgqC7LGBxvv12FYIZGFTBP0RNV7Ur1iL6gt6xSh6_V4' \
--header 'Content-Type: application/json' \
--data '{
    "page": 0,
    "size": 2
}'

sample response

{
    "status": true,
    "message": "Success",
    "data": [
        {
            "_id": "65f2ad4199c6b128677c8ec1",
            "userId": "65f18f11254809afb80c8e9c",
            "title": "TASK 1",
            "description": "User Task",
            "dueDate": "2024-03-30T00:00:00.000Z",
            "userName": "umar"
        },
        {
            "_id": "65f2ad2299c6b128677c8ebd",
            "userId": "65f18f11254809afb80c8e9c",
            "title": "Redd",
            "description": "farook@gmail.com",
            "dueDate": "1999-10-19T00:00:00.000Z",
            "userName": "umar"
        }
    ],
    "count": 3
}

Update Task - only admin can view this

curl --location 'http://localhost:1233/tasks/update-task' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWYxOGUxM2M1NGQxYWUxNzNjMTBmYTEiLCJpYXQiOjE3MTA0MDE0ODUsImV4cCI6MTcxMDQwNTA4NX0.tgqC7LGBxvv12FYIZGFTBP0RNV7Ur1iL6gt6xSh6_V4' \
--header 'Content-Type: application/json' \
--data '{
   
    "_id": "65f2ad2299c6b128677c8ebd", 
    "completed": true
}'

{
    "status": true,
    "message": "Task Update Sucessfully"
}

curl --location 'http://localhost:1233/tasks/delete-task' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWYxOGUxM2M1NGQxYWUxNzNjMTBmYTEiLCJpYXQiOjE3MTA0MDE0ODUsImV4cCI6MTcxMDQwNTA4NX0.tgqC7LGBxvv12FYIZGFTBP0RNV7Ur1iL6gt6xSh6_V4' \
--header 'Content-Type: application/json' \
--data '{
   
    "_id": "65f2ad2299c6b128677c8ebd" 
    
}'

{
    "status": true,
    "message": "Task deleted successfully!"
}




#USER view my task

curl --location 'http://localhost:1233/tasks/my-tasks' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWYyYjA0YjhlYWU4YWYzMTAwMTUyZjYiLCJpYXQiOjE3MTA0MDM3MjksImV4cCI6MTcxMDQwNzMyOX0.Tx8yh6pLk3rXWmUrqBumryqu_LeTJhjnTvK_vTqlsyE' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Redd",
    "description": "farook@gmail.com",
    "dueDate": "1999-10-19",
    "userId": "65f18f11254809afb80c8e9c", 
    "lastName": "S",
    "password": "Osiz@123",
    "dob": "1999-10-19"
}'

Sample Response

{
    "status": true,
    "message": "Success",
    "data": [
        {
            "_id": "65f2b0fc8eae8af310015307",
            "userId": "65f2b04b8eae8af3100152f6",
            "title": "TASK 1",
            "description": "User Task",
            "dueDate": "2024-03-30T00:00:00.000Z",
            "completed": false
        }
    ],
    "count": 1
}