
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE TABLE restaurants(
    rest SERIAL PRIMARY KEY,
    name char(20),
    image char(20),
    rating int,
    latlng char(30),
    email char(50)
  );

  CREATE TABLE rating(
    user_id int not null,
    rest int not null REFERENCES restaurants(rest),
    rating int not null,
    primary key(user_id,rest)
  );

  CREATE TABLE meals(
    meal SERIAL PRIMARY KEY,
    name char(20),
    price decimal(8,2),
    rest int not null REFERENCES restaurants(rest)
  );


  CREATE TABLE orders(
    order_id SERIAL PRIMARY KEY,
    total decimal(8,2),
    addr char(100),
    latlng char(30),
    phone char(25),
    rest int not null REFERENCES restaurants(rest)
  );

  CREATE TABLE order_meal(
    order_id int not null REFERENCES orders(order_id),
    meal int not null REFERENCES meals(meal),
    quantity int
  );

  INSERT INTO restaurants(name, image, rating,latlng,email)
  VALUES
  ('Restaurant 1','rest/rest008.jpg',1,'-34.5641679,-58.459922','persianahuel@gmail.com'),
  ('Restaurant 2','rest/rest002.jpg',1,'-34.5641679,-58.459922','persianahuel@gmail.com'),
  ('Restaurant 3','rest/rest003.jpg',1,'-34.5641679,-58.459922','persianahuel@gmail.com'),
  ('Restaurant 4','rest/rest004.jpg',1,'-34.5641679,-58.459922','persianahuel@gmail.com'),
  ('Restaurant 5','rest/rest005.jpg',1,'-34.5641679,-58.459922','persianahuel@gmail.com');

  INSERT INTO rating(user_id, rest, rating)
  VALUES
  (11,1,2),
  (22,2,3),
  (33,3,5),
  (44,4,1);

  INSERT INTO meals(rest, price, name)
  VALUES  
  (2,'1','Meal 1'),
  (3,'2','Meal 2'),
  (4,'3','Meal 3'),
  (5,'4','Meal 4'),
  (1,'5','Meal 5'),
  (1,'6','Meal 6'),
  (3,'7','Meal 7'),
  (2,'8','Meal 8'),
  (5,'9','Meal 9'),
  (4,'10','Meal 10');




EOSQL
