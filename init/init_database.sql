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
user_id varchar(5) references users(user_id)on delete cascade on update cascade,
primary key(item_id, user_id)
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
('1', 'books', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749222401/libri_wk1nzn.jpg'),
('2', 'electronics', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749222665/39611775-astratto-elettronico-circuito-tavola-struttura-alto-computer-e-digitale-tecnologia-concetto-su-un-buio-blu-sfondo-vettore-illustrazione-vettoriale_mj7rfw.jpg'),
('3', 'clothing', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749222986/SS25-L6-01-Home-D-03a_1_zwyfix.avif'),
('4', 'home', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223032/images_xd75go.jpg'),
('5', 'gardern', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223101/AdobeStock_265155137_ctlret.jpg'),
('6', 'tech', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749222822/65293ad388e7f519253c23b6_cuu_mexygabriel_design_banner-scaled_vbvfax.jpg'),
('7', 'sports', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223157/1520199081902_b2ki4o.jpg'),
('8', 'beauty', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223269/trucchi-anallergici_sradyt.webp'),
('9', 'food', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223269/trucchi-anallergici_sradyt.webp');

--INSERIMENTO UTENTI PER TEST
--la password è password123
INSERT INTO users(user_id, name, surname, email, pwd, image_url, role_id) VALUES
('5', 'prova', 'artigiano', 'marketrader69@gmail.com', '$2b$10$N7dSkM15kwW3pwm3KT5Yue0lO8rpviTnB/Dwv5sF5s0ZaKT1ujABi', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223517/11062b_78c43fe155c041bca03b0c6e15b82110_mv2_plj72j.avif', 2),
('7', 'prova1', 'artigiano1', 'provaartigiano@gmail.com', '$2b$10$N7dSkM15kwW3pwm3KT5Yue0lO8rpviTnB/Dwv5sF5s0ZaKT1ujABi', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223517/11062b_78c43fe155c041bca03b0c6e15b82110_mv2_plj72j.avif', 2),
('8', 'prova2', 'artigiano2', 'provaartigiano2@gmail.com', '$2b$10$N7dSkM15kwW3pwm3KT5Yue0lO8rpviTnB/Dwv5sF5s0ZaKT1ujABi', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223517/11062b_78c43fe155c041bca03b0c6e15b82110_mv2_plj72j.avif', 2),
('9', 'prova3', 'artigiano3', 'provaartigiano3@gmail.com', '$2b$10$N7dSkM15kwW3pwm3KT5Yue0lO8rpviTnB/Dwv5sF5s0ZaKT1ujABi', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223517/11062b_78c43fe155c041bca03b0c6e15b82110_mv2_plj72j.avif', 2),
('10', 'prova4', 'artigiano4', 'provaartigiano4@gmail.com', '$2b$10$N7dSkM15kwW3pwm3KT5Yue0lO8rpviTnB/Dwv5sF5s0ZaKT1ujABi', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223517/11062b_78c43fe155c041bca03b0c6e15b82110_mv2_plj72j.avif', 2);

insert into users(user_id, name, surname, email, pwd, image_url, role_id )values
('6','prova','cliente','marketrader69@gmail.com','https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223622/shopping_ndfr1w.jpg','$2b$10$N7dSkM15kwW3pwm3KT5Yue0lO8rpviTnB/Dwv5sF5s0ZaKT1ujABi',1);

--INSERIMENTO ITEM 
INSERT INTO items(item_id, name, price, description, quantity, image_url, category_id, user_id) VALUES
(1, 'Item 1', 10.50, 'Description for item 1', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '1', '5'),
(2, 'Item 2', 10.50, 'Description for item 2', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif','1', '5'),
(3, 'Item 3', 25.00, 'Description for item 3', 10, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '2', '5'),
(4, 'Item 4', 15.75, 'Description for item 4', 8, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '3', '5'),
(5, 'Item 5', 8.99,  'Description for item 5', 12, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '4', '5'),
(6, 'Item 6', 12.30, 'Description for item 6', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '5', '5'),
(7, 'Item 7', 55.00, 'Description for item 7', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '6', '5'),
(8, 'Item 8', 20.00, 'Description for item 8', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '7', '5'),
(9, 'Item 9', 30.50, 'Description for item 9', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '8', '5'),
(10, 'Item 10', 5.25, 'Description for item 10', 15, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '9', '5'),
(11, 'Item 11', 14.80, 'Description for item 11', 9, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '1', '5'),
(12, 'Item 12', 40.00, 'Description for item 12', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '2', '5'),
(13, 'Item 13', 18.99, 'Description for item 13', 11, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '3', '5'),
(14, 'Item 14', 22.50, 'Description for item 14', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '4', '5'),
(15, 'Item 15', 9.99,  'Description for item 15', 8,'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '5', '5'),
(16, 'Item 16', 60.00, 'Description for item 16', 1, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '6', '5'),
(17, 'Item 17', 24.75, 'Description for item 17', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '7', '5'),
(18, 'Item 18', 35.00, 'Description for item 18', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '8', '5'),
(19, 'Item 19', 7.50,  'Description for item 19', 14, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '9', '5'),
(20, 'Item 20', 13.25, 'Description for item 20', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '1', '5'),
(21, 'Item 21', 45.00, 'Description for item 21', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '2', '5'),
(22, 'Item 22', 17.50, 'Description for item 22', 10, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '3', '5'),
(23, 'Item 23', 21.99, 'Description for item 23', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '4', '5'),
(24, 'Item 24', 10.00, 'Description for item 24', 9, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '5', '5'),
(25, 'Item 25', 70.00, 'Description for item 25', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '6', '5'),
(26, 'Item 26', 27.30, 'Description for item 26', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '7', '5'),
(27, 'Item 27', 38.50, 'Description for item 27', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '8', '5'),
(28, 'Item 28', 6.75,  'Description for item 28', 12, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '9', '5'),
(29, 'Item 29', 16.00, 'Description for item 29', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '1', '5'),
(30, 'Item 30', 42.00, 'Description for item 30', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '2', '5');

--NUOVI ITEM PER ARTIGIANI 7,8,9,10
INSERT INTO items (item_id, name, price, description, quantity, image_url, category_id, user_id) VALUES
(31, 'Item 31', 10.50, 'Description for item 31', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '1', '7'),
(32, 'Item 32', 10.50, 'Description for item 32', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif','1', '7'),
(33, 'Item 33', 25.00, 'Description for item 33', 10, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '2', '7'),
(34, 'Item 34', 15.75, 'Description for item 34', 8, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '3', '7'),
(35, 'Item 35', 8.99,  'Description for item 35', 12, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '4', '7'),
(36, 'Item 36', 12.30, 'Description for item 36', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '5', '7'),
(37, 'Item 37', 55.00, 'Description for item 37', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '6', '7'),
(38, 'Item 38', 20.00, 'Description for item 38', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '7', '7'),
(39, 'Item 39', 30.50, 'Description for item 39', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '8', '7'),
(40, 'Item 40', 5.25,  'Description for item 40', 15, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '9', '7'),
(41, 'Item 41', 14.80, 'Description for item 41', 9, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '1', '7'),
(42, 'Item 42', 40.00, 'Description for item 42', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '2', '7'),
(43, 'Item 43', 18.99, 'Description for item 43', 11, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '3', '7'),
(44, 'Item 44', 22.50, 'Description for item 44', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', '4', '7'),
(45, 'Item 45', 9.99,  'Description for item 45', 8,'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '5', '7'),
(46, 'Item 46', 60.00, 'Description for item 46', 1, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '6', '7'),
(47, 'Item 47', 24.75, 'Description for item 47', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '7', '7'),
(48, 'Item 48', 35.00, 'Description for item 48', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '8', '7'),
(49, 'Item 49', 7.50,  'Description for item 49', 14, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '9', '7'),
(50, 'Item 50', 13.25, 'Description for item 50', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '1', '7'),
(51, 'Item 51', 45.00, 'Description for item 51', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '2', '7'),
(52, 'Item 52', 17.50, 'Description for item 52', 10, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '3', '7'),
(53, 'Item 53', 21.99, 'Description for item 53', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '4', '7'),
(54, 'Item 54', 10.00, 'Description for item 54', 9, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '5', '7'),
(55, 'Item 55', 70.00, 'Description for item 55', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '6', '7'),
(56, 'Item 56', 27.30, 'Description for item 56', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '7', '7'),
(57, 'Item 57', 38.50, 'Description for item 57', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '8', '7'),
(58, 'Item 58', 6.75,  'Description for item 58', 12, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '9', '7'),
(59, 'Item 59', 16.00, 'Description for item 59', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '1', '7'),
(60, 'Item 60', 42.00, 'Description for item 60', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', '2', '7');

INSERT INTO items (item_id, name, price, description, quantity, image_url, category_id, user_id) VALUES
(61, 'Item 61', 12.99, 'Description for item 61', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 1, 8),
(62, 'Item 62', 8.50, 'Description for item 62', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 2, 8),
(63, 'Item 63', 15.00, 'Description for item 63', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 3, 8),
(64, 'Item 64', 20.00, 'Description for item 64', 10, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 1, 8),
(65, 'Item 65', 9.99, 'Description for item 65', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 2, 8),
(66, 'Item 66', 18.75, 'Description for item 66', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 3, 8),
(67, 'Item 67', 11.25, 'Description for item 67', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 1, 8),
(68, 'Item 68', 14.40, 'Description for item 68', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 2, 8),
(69, 'Item 69', 19.99, 'Description for item 69', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 3, 8),
(70, 'Item 70', 22.00, 'Description for item 70', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 1, 8),
(71, 'Item 71', 10.00, 'Description for item 71', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 2, 8),
(72, 'Item 72', 12.60, 'Description for item 72', 8, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 3, 8),
(73, 'Item 73', 13.90, 'Description for item 73', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 1, 8),
(74, 'Item 74', 16.50, 'Description for item 74', 9, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 2, 8),
(75, 'Item 75', 21.00, 'Description for item 75', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 3, 8),
(76, 'Item 76', 18.80, 'Description for item 76', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 1, 8),
(77, 'Item 77', 11.90, 'Description for item 77', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 2, 8),
(78, 'Item 78', 9.75, 'Description for item 78', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 3, 8),
(79, 'Item 79', 12.20, 'Description for item 79', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 1, 8),
(80, 'Item 80', 17.60, 'Description for item 80', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 2, 8),
(81, 'Item 81', 14.30, 'Description for item 81', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 3, 8),
(82, 'Item 82', 22.50, 'Description for item 82', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 1, 8),
(83, 'Item 83', 10.60, 'Description for item 83', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 2, 8),
(84, 'Item 84', 19.20, 'Description for item 84', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 3, 8),
(85, 'Item 85', 13.30, 'Description for item 85', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 1, 8),
(86, 'Item 86', 15.90, 'Description for item 86', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 2, 8),
(87, 'Item 87', 18.25, 'Description for item 87', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 3, 8),
(88, 'Item 88', 20.70, 'Description for item 88', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 1, 8),
(89, 'Item 89', 17.30, 'Description for item 89', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 2, 8),
(90, 'Item 90', 23.90, 'Description for item 90', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 3, 8);

INSERT INTO items (item_id, name, price, description, quantity, image_url, category_id, user_id) VALUES
(91, 'Item 91', 10.50, 'Description for item 91', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 1, 9),
(92, 'Item 92', 13.20, 'Description for item 92', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 2, 9),
(93, 'Item 93', 17.80, 'Description for item 93', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 3, 9),
(94, 'Item 94', 21.00, 'Description for item 94', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 1, 9),
(95, 'Item 95', 8.90, 'Description for item 95', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 2, 9),
(96, 'Item 96', 19.40, 'Description for item 96', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 3, 9),
(97, 'Item 97', 12.00, 'Description for item 97', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 1, 9),
(98, 'Item 98', 14.60, 'Description for item 98', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 2, 9),
(99, 'Item 99', 22.00, 'Description for item 99', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 3, 9),
(100, 'Item 100', 11.30, 'Description for item 100', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 1, 9),
(101, 'Item 101', 15.80, 'Description for item 101', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 2, 9),
(102, 'Item 102', 9.99, 'Description for item 102', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 3, 9),
(103, 'Item 103', 16.20, 'Description for item 103', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 1, 9),
(104, 'Item 104', 13.75, 'Description for item 104', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 2, 9),
(105, 'Item 105', 18.10, 'Description for item 105', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 3, 9),
(106, 'Item 106', 20.90, 'Description for item 106', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 1, 9),
(107, 'Item 107', 11.45, 'Description for item 107', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 2, 9),
(108, 'Item 108', 14.00, 'Description for item 108', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 3, 9),
(109, 'Item 109', 23.50, 'Description for item 109', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 1, 9),
(110, 'Item 110', 19.90, 'Description for item 110', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 2, 9),
(111, 'Item 111', 13.30, 'Description for item 111', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 3, 9),
(112, 'Item 112', 17.70, 'Description for item 112', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 1, 9),
(113, 'Item 113', 16.60, 'Description for item 113', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 2, 9),
(114, 'Item 114', 12.75, 'Description for item 114', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 3, 9),
(115, 'Item 115', 15.00, 'Description for item 115', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 1, 9),
(116, 'Item 116', 20.30, 'Description for item 116', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 2, 9),
(117, 'Item 117', 18.70, 'Description for item 117', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 3, 9),
(118, 'Item 118', 9.80, 'Description for item 118', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 1, 9),
(119, 'Item 119', 22.80, 'Description for item 119', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 2, 9),
(120, 'Item 120', 11.95, 'Description for item 120', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 3, 9);

INSERT INTO items (item_id, name, price, description, quantity, image_url, category_id, user_id) VALUES
(151, 'Item 151', 10.2, 'Description for item 151', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 2, 10),
(152, 'Item 152', 12.4, 'Description for item 152', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 3, 10),
(153, 'Item 153', 12.5, 'Description for item 153', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 1, 10),
(154, 'Item 154', 14.7, 'Description for item 154', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 2, 10),
(155, 'Item 155', 16.9, 'Description for item 155', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 3, 10),
(156, 'Item 156', 17.0, 'Description for item 156', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 1, 10),
(157, 'Item 157', 19.2, 'Description for item 157', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 2, 10),
(158, 'Item 158', 21.4, 'Description for item 158', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 3, 10),
(159, 'Item 159', 21.5, 'Description for item 159', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 1, 10),
(160, 'Item 160', 8.7, 'Description for item 160', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 2, 10),
(161, 'Item 161', 9.8, 'Description for item 161', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 3, 10),
(162, 'Item 162', 11.0, 'Description for item 162', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 1, 10),
(163, 'Item 163', 11.1, 'Description for item 163', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 2, 10),
(164, 'Item 164', 13.3, 'Description for item 164', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 3, 10),
(165, 'Item 165', 13.4, 'Description for item 165', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 1, 10),
(166, 'Item 166', 15.6, 'Description for item 166', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 2, 10),
(167, 'Item 167', 15.7, 'Description for item 167', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 3, 10),
(168, 'Item 168', 17.9, 'Description for item 168', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 1, 10),
(169, 'Item 169', 18.0, 'Description for item 169', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 2, 10),
(170, 'Item 170', 20.2, 'Description for item 170', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 3, 10),
(171, 'Item 171', 20.3, 'Description for item 171', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 1, 10),
(172, 'Item 172', 22.5, 'Description for item 172', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 2, 10),
(173, 'Item 173', 22.6, 'Description for item 173', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 3, 10),
(174, 'Item 174', 24.8, 'Description for item 174', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 1, 10),
(175, 'Item 175', 24.9, 'Description for item 175', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 2, 10),
(176, 'Item 176', 27.1, 'Description for item 176', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 3, 10),
(177, 'Item 177', 27.2, 'Description for item 177', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 1, 10),
(178, 'Item 178', 29.4, 'Description for item 178', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 2, 10),
(179, 'Item 179', 29.5, 'Description for item 179', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223836/6616718fe4a871d7278a2037_Product-Concept-What-Is-It-And-How-Can-You-Best-Use-It_lac1om.jpg', 3, 10),
(180, 'Item 180', 21.3, 'Description for item 180', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223903/icona-della-linea-di-concetto-di-prodotto-illustrazione-semplice-dell-elemento-design-del-simbolo-del-contorno-del-concetto-di-prodotto-puo-essere-utilizzato-per-ui-ux-mobile-e-web_159242-2076_ixod7i.avif', 3, 10);