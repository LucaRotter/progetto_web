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
prezzo DECIMAL(10, 2) not null,
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
(12, 'modarate_reports'),
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
('cat01', 'libri', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg'),
('cat02', 'elettronica', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg'),
('cat03', 'abbigliamento', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg'),
('cat04', 'casa', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg'),
('cat05', 'giardino', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg'),
('cat06', 'informatica', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg'),
('cat07', 'sport', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg'),
('cat08', 'bellezza', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg'),
('cat09', 'cibo', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1747398272/OIP_tnnwhm.jpg');