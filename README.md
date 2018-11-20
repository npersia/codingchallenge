# Prerequisites
* Docker, version 18.09.0  
* Docker Compose, version 1.23.1





# Install
To install the solution you need to run the next commands:

* To generate the containers:
	* $ docker-compose build


* To run the solution:
	* $ docker-compose up


* To stop the solution:
	* $ docker-compose stop


* To clean all
	* $ docker-compose down

For a specific service manipulation in this solution to must had to this commands the service. In this solution we have the services:
* back
* db
* front
* msg
* mq
* sms

For example, if you want to stop the front service, you must have:
* $ docker-compose stop front


# A simple example
* Conect in a web browser to http://localhost:5000
* Go to Manage Restaurants
  * Go to Create Restaurant
  * Complete a restaurant
* Make click in Home
* Go to Manage Restaurants
  * Go to Create Meal
  * Select your new restaurant 
  * Complete a new meal
* Make click in Home
* Go to Make an Order
  * Select your Restaurant
  * complete and wait for the order

# NOTE

In this repository you can find:
* the swagger documentation
* the postman json to make tests
* the code
* the docker files and docker compose to run the app
* the architecture document
