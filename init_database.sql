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
admin_id varchar(5) references users(user_id)
);

create table reviews(
item_id varchar(5) references items(item_id) on delete cascade on update cascade,
user_id varchar(5) references users(user_id)on delete cascade on update cascade,
evaulation int not null,
description text
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
('ad001', 'Alessandro', 'Grassi', 'alessandro.grassi24062003@gmail.com', '$2b$10$llCxJQwhksb8f88QqYpVhu8KFqe9EivvXYPGBcGLJz.P1mr26VDmm', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1746795022/https___images.genius.com_00fec6153b63522d6896275b0aedf9e3.1000x1000x1_snyln4.png', 3),
('ad002', 'Aleksandar', 'Kastratovic', 'aleks.kastratovic@gmail.com', '$2b$10$R3G8ErDD0tJ6.h0uYonK8OWxRzJtS3t5L8Q.T7mdxiEJnekmQyzNe', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1746794932/Screenshot_2025-05-09_144831_ufynui.png', 3),
('ad003', 'Luca', 'Rotter', 'marketrader69@gmail.com', '$2b$10$jEkHE6GFwiPXzFP.lbcDBu.QuwHAnVvitJwxqal9olEIBuinLpsDe', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1746723876/test_upload/dwurd5vegcxqy4xgwfqb.jpg', 3),
('ad004', 'Davide', 'Bilora', 'davidebilora03pc@gmail.com', '$2b$10$BCIs7NOlt090n2CHkr5q5O/sbrXA32Sb2PXYb0eoSL25a09ErHDj6', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1746794973/Screenshot_2025-05-09_144923_efkeg7.png', 3);

--CATEGORIE
INSERT INTO categories(category_id, name, image_url) VALUES
('cat01', 'books', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg'),
('cat02', 'eletronics', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg'),
('cat03', 'clothing', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg'),
('cat04', 'home', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg'),
('cat05', 'gardern', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg'),
('cat06', 'tech', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg'),
('cat07', 'sports', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg'),
('cat08', 'beauty', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg'),
('cat09', 'food', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg');

--INSERIMENTO UTENTI PER TEST
--la password è password123
insert into users(user_id, name, surname, email, pwd, role_id )values
('A0001','prova','artigiano','marketrader69@gmail.com','$2b$10$N7dSkM15kwW3pwm3KT5Yue0lO8rpviTnB/Dwv5sF5s0ZaKT1ujABi',2);
insert into users(user_id, name, surname, email, pwd, role_id )values
('C1000','prova','cliente','marketrader69@gmail.com','$2b$10$N7dSkM15kwW3pwm3KT5Yue0lO8rpviTnB/Dwv5sF5s0ZaKT1ujABi',1);

--INSERIMENTO ITEM 
INSERT INTO items(item_id, name, price, description, quantity, category_id, user_id) VALUES
(2, 'Item 2', 10.50, 'Description for item 2', 5, 'cat01', 'A0001'),
(3, 'Item 3', 25.00, 'Description for item 3', 10, 'cat02', 'A0001'),
(4, 'Item 4', 15.75, 'Description for item 4', 8, 'cat03', 'A0001'),
(5, 'Item 5', 8.99,  'Description for item 5', 12, 'cat04', 'A0001'),
(6, 'Item 6', 12.30, 'Description for item 6', 6, 'cat05', 'A0001'),
(7, 'Item 7', 55.00, 'Description for item 7', 3, 'cat06', 'A0001'),
(8, 'Item 8', 20.00, 'Description for item 8', 7, 'cat07', 'A0001'),
(9, 'Item 9', 30.50, 'Description for item 9', 4, 'cat08', 'A0001'),
(10, 'Item 10', 5.25, 'Description for item 10', 15, 'cat09', 'A0001'),
(11, 'Item 11', 14.80, 'Description for item 11', 9, 'cat01', 'A0001'),
(12, 'Item 12', 40.00, 'Description for item 12', 2, 'cat02', 'A0001'),
(13, 'Item 13', 18.99, 'Description for item 13', 11, 'cat03', 'A0001'),
(14, 'Item 14', 22.50, 'Description for item 14', 5, 'cat04', 'A0001'),
(15, 'Item 15', 9.99,  'Description for item 15', 8, 'cat05', 'A0001'),
(16, 'Item 16', 60.00, 'Description for item 16', 1, 'cat06', 'A0001'),
(17, 'Item 17', 24.75, 'Description for item 17', 6, 'cat07', 'A0001'),
(18, 'Item 18', 35.00, 'Description for item 18', 4, 'cat08', 'A0001'),
(19, 'Item 19', 7.50,  'Description for item 19', 14, 'cat09', 'A0001'),
(20, 'Item 20', 13.25, 'Description for item 20', 7, 'cat01', 'A0001'),
(21, 'Item 21', 45.00, 'Description for item 21', 3, 'cat02', 'A0001'),
(22, 'Item 22', 17.50, 'Description for item 22', 10, 'cat03', 'A0001'),
(23, 'Item 23', 21.99, 'Description for item 23', 6, 'cat04', 'A0001'),
(24, 'Item 24', 10.00, 'Description for item 24', 9, 'cat05', 'A0001'),
(25, 'Item 25', 70.00, 'Description for item 25', 2, 'cat06', 'A0001'),
(26, 'Item 26', 27.30, 'Description for item 26', 5, 'cat07', 'A0001'),
(27, 'Item 27', 38.50, 'Description for item 27', 3, 'cat08', 'A0001'),
(28, 'Item 28', 6.75,  'Description for item 28', 12, 'cat09', 'A0001'),
(29, 'Item 29', 16.00, 'Description for item 29', 7, 'cat01', 'A0001'),
(30, 'Item 30', 42.00, 'Description for item 30', 4, 'cat02', 'A0001'),
(31, 'Item 31', 19.99, 'Description for item 31', 8, 'cat03', 'A0001');
