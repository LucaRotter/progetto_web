create table roles(
role_id varchar(5) primary key,
name varchar(100) not null
);

create table permissions(
permission_id varchar(5) primary key,
name varchar(100) not null
);

create table roles_permissions(
permission_id varchar(5) references permissions(permission_id) on delete cascade on update cascade,
role_id varchar(5) references roles(role_id) on delete cascade on update cascade,
primary key(permission_id, role_id)
);

create table users(
user_id varchar(5) primary key,
name varchar(100) not null, 
surname varchar(100) not null,
email varchar(100) not null, 
pwd varchar(120) not null,
image_url text,
role_id varchar(5) references roles(role_id)
);

create table categories(
category_id varchar(5) primary key,
name varchar(100) not null,
image_url text
);

create table items(
item_id varchar(5) primary key,
name varchar(100) not null,
price DECIMAL(10, 2) not null,
description text,
quantity int not null,
image_url text,
category_id varchar(5) references categories(category_id),
user_id varchar(5) references users(user_id) on delete cascade on update cascade
);

create table orders(
order_id varchar(5),
item_id varchar(5) references items(item_id),
primary key(order_id, item_id),
customer_id varchar(5) references users(user_id),
artisan_id varchar(5) references users(user_id),
quantity int not null,
day date not null,
time TIME not null,
state varchar(100) not null,
address varchar(255),
civic_number varchar(100),
city varchar(100),
postal_code VARCHAR(20),
province VARCHAR(100),
country VARCHAR(100),
phone_number varchar(30)
);

create table carts(
quantity int not null,
item_id varchar(5) references items(item_id) on delete cascade on update cascade,
user_id varchar(5) references users(user_id)on delete cascade on update cascade
);

create table reports(
report_id varchar(5) primary key,
category varchar(100) not null, 
description text,
customer_id varchar(5) references users(user_id) on delete cascade on update cascade,
artisan_id varchar(5) references users(user_id) on delete cascade on update cascade,
item_id varchar(5) references items(item_id),
admin_id varchar(5) references users(user_id)
);

create table reviews(
review_id varchar(5) primary key,
item_id varchar(5) references items(item_id) on delete cascade on update cascade,
user_id varchar(5) references users(user_id)on delete cascade on update cascade,
evaluation int not null,
description text
);

create table shuffled(
item_index INTEGER primary key,
item_id varchar(5) references items(item_id) on delete cascade on update cascade,
user_key varchar(16) not null,
category_id varchar(5) references categories(category_id) on delete cascade on update cascade
);

--INSERT DI DEFAULT
--roles
insert into roles(role_id, name)
values(1, 'C'),(2, 'A'),(3, 'Ad');

--permissions
INSERT INTO permissions(permission_id, name) VALUES
--for the customer
(1, 'update_cart'),
(2, 'place_order'),
(3, 'view_orders'),
(4, 'add_review'),
--for the artisan
(5, 'update_item'),
(6, 'manage_orders'),
--for the admin
(7, 'manage_users'),
(8, 'manage_permissions'),
(9, 'view_manage_orders'),
(10, 'delete_user'),
(11, 'moderate_reviews'),
(12, 'moderate_reports'),
(13, 'manage_categories'),
--for artisan and admin
(14, 'delete_item'),
--for customer and artisan
(15, 'manage_report'),
(16, 'update_profile'),
--for customer and admin
(17, 'delete_review');



--roles_permissions
INSERT INTO roles_permissions(role_id, permission_id) VALUES
(1,1),(1,2),(1,3),(1,4),
(2,5),(2,6),
(3,7),(3,8),(3,9),(3,10),(3,11),(3,12),(3,13),
(2,14),(3,14),
(1,15),(2,15),(1,16),(2,16),
(1,17),(3,17);


--admin
--DA MODIFICARE EMAIL E PWD
INSERT INTO users(user_id, name, surname, email, pwd, image_url, role_id) VALUES 
('1', 'Alessandro', 'Grassi', 'alessandro.grassi24062003@gmail.com', '$2b$10$llCxJQwhksb8f88QqYpVhu8KFqe9EivvXYPGBcGLJz.P1mr26VDmm', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1746795022/https___images.genius.com_00fec6153b63522d6896275b0aedf9e3.1000x1000x1_snyln4.png', 3),
('2', 'Aleksandar', 'Kastratovic', 'aleks.kastratovic@gmail.com', '$2b$10$R3G8ErDD0tJ6.h0uYonK8OWxRzJtS3t5L8Q.T7mdxiEJnekmQyzNe', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1746794932/Screenshot_2025-05-09_144831_ufynui.png', 3),
('3', 'Luca', 'Rotter', 'marketrader69@gmail.com', '$2b$10$jEkHE6GFwiPXzFP.lbcDBu.QuwHAnVvitJwxqal9olEIBuinLpsDe', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1746723876/test_upload/dwurd5vegcxqy4xgwfqb.jpg', 3),
('4', 'Davide', 'Bilora', 'davidebilora03pc@gmail.com', '$2b$10$BCIs7NOlt090n2CHkr5q5O/sbrXA32Sb2PXYb0eoSL25a09ErHDj6', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1746794973/Screenshot_2025-05-09_144923_efkeg7.png', 3);

--CATEGORIE
INSERT INTO categories(category_id, name, image_url) VALUES
('1', 'books', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg'),
('2', 'electronics', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg'),
('3', 'clothing', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg'),
('4', 'home', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg'),
('5', 'gardern', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg'),
('6', 'tech', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg'),
('7', 'sports', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg'),
('8', 'beauty', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg'),
('9', 'food', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg');

--INSERIMENTO UTENTI PER TEST
--la password è password123
insert into users(user_id, name, surname, email, pwd, role_id )values
('5','prova','artigiano','marketrader69@gmail.com','$2b$10$N7dSkM15kwW3pwm3KT5Yue0lO8rpviTnB/Dwv5sF5s0ZaKT1ujABi',2);
insert into users(user_id, name, surname, email, pwd, role_id )values
('6','prova','cliente','marketrader69@gmail.com','$2b$10$N7dSkM15kwW3pwm3KT5Yue0lO8rpviTnB/Dwv5sF5s0ZaKT1ujABi',1);

--INSERIMENTO ITEM 
INSERT INTO items(item_id, name, price, description, quantity, category_id, user_id) VALUES
(1, 'Item 1', 10.50, 'Description for item 1', 5, '1', '5'),
(2, 'Item 2', 10.50, 'Description for item 2', 5, '1', '5'),
(3, 'Item 3', 25.00, 'Description for item 3', 10, '2', '5'),
(4, 'Item 4', 15.75, 'Description for item 4', 8, '3', '5'),
(5, 'Item 5', 8.99,  'Description for item 5', 12, '4', '5'),
(6, 'Item 6', 12.30, 'Description for item 6', 6, '5', '5'),
(7, 'Item 7', 55.00, 'Description for item 7', 3, '6', '5'),
(8, 'Item 8', 20.00, 'Description for item 8', 7, '7', '5'),
(9, 'Item 9', 30.50, 'Description for item 9', 4, '8', '5'),
(10, 'Item 10', 5.25, 'Description for item 10', 15, '9', '5'),
(11, 'Item 11', 14.80, 'Description for item 11', 9, '1', '5'),
(12, 'Item 12', 40.00, 'Description for item 12', 2, '2', '5'),
(13, 'Item 13', 18.99, 'Description for item 13', 11, '3', '5'),
(14, 'Item 14', 22.50, 'Description for item 14', 5, '4', '5'),
(15, 'Item 15', 9.99,  'Description for item 15', 8, '5', '5'),
(16, 'Item 16', 60.00, 'Description for item 16', 1, '6', '5'),
(17, 'Item 17', 24.75, 'Description for item 17', 6, '7', '5'),
(18, 'Item 18', 35.00, 'Description for item 18', 4, '8', '5'),
(19, 'Item 19', 7.50,  'Description for item 19', 14, '9', '5'),
(20, 'Item 20', 13.25, 'Description for item 20', 7, '1', '5'),
(21, 'Item 21', 45.00, 'Description for item 21', 3, '2', '5'),
(22, 'Item 22', 17.50, 'Description for item 22', 10, '3', '5'),
(23, 'Item 23', 21.99, 'Description for item 23', 6, '4', '5'),
(24, 'Item 24', 10.00, 'Description for item 24', 9, '5', '5'),
(25, 'Item 25', 70.00, 'Description for item 25', 2, '6', '5'),
(26, 'Item 26', 27.30, 'Description for item 26', 5, '7', '5'),
(27, 'Item 27', 38.50, 'Description for item 27', 3, '8', '5'),
(28, 'Item 28', 6.75,  'Description for item 28', 12, '9', '5'),
(29, 'Item 29', 16.00, 'Description for item 29', 7, '1', '5'),
(30, 'Item 30', 42.00, 'Description for item 30', 4, '2', '5');

