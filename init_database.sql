create table roles(
role_id varchar(5) primary key,
name varchar(30) not null
);

create table permissions(
permission_id varchar(5) primary key,
name varchar(30) not null
);

create table roles_permissions(
permission_id varchar(5) references permissions(permission_id) on delete cascade on update cascade,
role_id varchar(5) references roles(role_id) on delete cascade on update cascade,
primary key(permission_id, role_id)
);

create table users(
user_id varchar(5) primary key,
name varchar(30) not null, 
surname varchar(30) not null,
email varchar(30) not null, 
pwd varchar(30) not null,
image_url text,
role_id varchar(5) references roles(role_id)
);

create table categories(
category_id varchar(5) primary key,
name varchar(30) not null,
image_url text
);

create table items(
item_id varchar(5) primary key,
name varchar(30) not null,
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
state varchar(30) not null
);

create table carts(
quantity int not null,
item_id varchar(5) references items(item_id) on delete cascade on update cascade,
user_id varchar(5) references users(user_id)on delete cascade on update cascade
);

create table reports(
report_id varchar(5) primary key,
category varchar(30) not null, 
description text,
customer_id varchar(5) references users(user_id),
artisan_id varchar(5) references users(user_id),
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
INSERT INTO permission(permission_id, name) VALUES
--for the customer
(1, 'update_cart'),
(2, 'place_order'),
(3, 'view_orders'),
(4, 'update_profile_customer'),
(5, 'review_item'),
--for the artisan
(6, 'create_item'),
(7, 'update_item'),
(8, 'delete_item'),
(9, 'view_orders_received'),
(10, 'update_profile_artisan'),
--for the admin
(11, 'manage_users'),
(12, 'manage_permissions'),
(13, 'view_all_orders'),
(14, 'delete_user'),
(15, 'moderate_reviews'),
(16, 'modarate-reports'),
(17, 'manage-categories'),
--for customer and artisan
(18, 'manage-report');

--da aggiungere permission sulla carta bancaria e ricevere pagamenti per artigiani

--roles_permissions
INSERT INTO roles_permissions(role_id, permission_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(2, 6),
(2, 7),
(2, 8),
(2, 9),
(2, 10),
(3, 11),
(3, 12),
(3, 13),
(3, 14),
(3, 15),
(3, 16),
(3, 17),
(1, 18),
(2, 18);

--admin
--DA MODIFICARE EMAIL E PWD
INSERT INTO users(user_id, name, surname, email, pwd, image_url, role_id) VALUES
(ad001, Alessandro, Grassi, alessandro.grassi24062003@gmail.com, admin1, https://res.cloudinary.com/dftu5zdbs/image/upload/v1746795022/https___images.genius.com_00fec6153b63522d6896275b0aedf9e3.1000x1000x1_snyln4.png, 3),
(ad002, Aleksandar, Kastratovic, marketrader69@gmail.com, admin2, https://res.cloudinary.com/dftu5zdbs/image/upload/v1746794932/Screenshot_2025-05-09_144831_ufynui.png, 3),
(ad003, Luca, Rotter, marketrader69@gmail.com, admin3, https://res.cloudinary.com/dftu5zdbs/image/upload/v1746723876/test_upload/dwurd5vegcxqy4xgwfqb.jpg, 3),
(ad004, Davide, Bilora, davidebilora03pc@gmail.com, admin4, https://res.cloudinary.com/dftu5zdbs/image/upload/v1746794973/Screenshot_2025-05-09_144923_efkeg7.png, 3);