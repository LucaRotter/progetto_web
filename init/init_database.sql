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
category_id varchar(5) references categories(category_id)on delete set null on update cascade,
user_id varchar(5) references users(user_id) on delete cascade on update cascade
);

create table orders(
order_id varchar(5),
item_id varchar(5) references items(item_id)on delete cascade,
primary key(order_id, item_id),
customer_id varchar(5) references users(user_id) on delete set null,
artisan_id varchar(5) references users(user_id) on delete set null,
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
item_id varchar(5) references items(item_id) on delete cascade on update cascade,
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
user_key varchar(45) not null,
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
('1', 'books', 'https://res.cloudinary.com/dftu5zdbs/image/upload/t_catbeaty/v1749757188/catlibri_vdv8sj.jpg'),
('2', 'electronics', 'https://res.cloudinary.com/dftu5zdbs/image/upload/t_catbeaty/v1749757185/elecat_sisk9w.webp'),
('3', 'clothing', 'https://res.cloudinary.com/dftu5zdbs/image/upload/t_catbeaty/v1750083125/clothing_hsza83.jpg'),
('4', 'home', 'https://res.cloudinary.com/dftu5zdbs/image/upload/t_catbeaty/v1749757174/casa_avcjko.jpg'),
('5', 'garden', 'https://res.cloudinary.com/dftu5zdbs/image/upload/t_catbeaty/v1750083005/giarinaggio_vcrkza.webp'),
('6', 'tech', 'https://res.cloudinary.com/dftu5zdbs/image/upload/t_catbeaty/v1749757175/cattech_d3cwnf.avif'),
('7', 'sports', 'https://res.cloudinary.com/dftu5zdbs/image/upload/t_catbeaty/v1750083006/sports_bgnbgq.png'),
('8', 'beauty', 'https://res.cloudinary.com/dftu5zdbs/image/upload/t_catbeaty/v1750083804/catbeaty_f4bvln_smypdx.png'),
('9', 'food', 'https://res.cloudinary.com/dftu5zdbs/image/upload/t_catbeaty/v1750083005/food_mbjbyh.jpg');

--INSERIMENTO UTENTI PER TEST
--la password è password1, anche dopo i test
INSERT INTO users(user_id, name, surname, email, pwd, image_url, role_id) VALUES
('5', 'prova', 'artigiano', 'marketrader69@gmail.com', '$2b$10$Pvl9ML88FMovQzG9eUOSze725LNxng0iSK5MEIP9n5tTpY5/kZ1lS', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223517/11062b_78c43fe155c041bca03b0c6e15b82110_mv2_plj72j.avif', 2),
('7', 'prova1', 'artigiano1', 'provaartigiano@gmail.com', '$2b$10$Pvl9ML88FMovQzG9eUOSze725LNxng0iSK5MEIP9n5tTpY5/kZ1lS', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749218011/prodotti/ptohefudfxvmdtdwmdr8.jpg', 2),
('8', 'prova2', 'artigiano2', 'provaartigiano2@gmail.com', '$2b$10$Pvl9ML88FMovQzG9eUOSze725LNxng0iSK5MEIP9n5tTpY5/kZ1lS', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223622/shopping_ndfr1w.jpg', 2),
('9', 'prova3', 'artigiano3', 'provaartigiano3@gmail.com', '$2b$10$Pvl9ML88FMovQzG9eUOSze725LNxng0iSK5MEIP9n5tTpY5/kZ1lS', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749244673/avatra_jfctaq.webp', 2),
('10', 'prova4', 'artigiano4', 'provaartigiano4@gmail.com', '$2b$10$Pvl9ML88FMovQzG9eUOSze725LNxng0iSK5MEIP9n5tTpY5/kZ1lS', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749244750/luffy_vlow4s.jpg', 2);

insert into users(user_id, name, surname, email, pwd, image_url, role_id )values
('6','prova','cliente','marketrader69@gmail.com','$2b$10$Pvl9ML88FMovQzG9eUOSze725LNxng0iSK5MEIP9n5tTpY5/kZ1lS', 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749223622/shopping_ndfr1w.jpg',1);

--INSERIMENTO ITEM 

INSERT INTO items(item_id, name, price, description, quantity, image_url, category_id, user_id) VALUES
(1, 'Libro web ITA', 10.50, 'Description for item 1', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749746539/s-l1600_v48yxw.webp', '1', '5'),
(2, 'Libro web ENG', 10.50, 'Description for item 2', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749746539/s-l1600_v48yxw.webp','1', '5'),
(3, 'Lampadina 1', 25.00, 'Description for item 3', 10, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747408/eletronics1_zq4iur.jpg', '2', '5'),
(4, 'Cappello 1', 15.75, 'Description for item 4', 8, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749748160/vestito3_j2ofoo.jpg', '3', '5'),
(5, 'Ventilatore estetico', 8.99,  'Description for item 5', 12, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754014/home5_zruisy.jpg', '4', '5'),
(6, 'Paletta da giardino', 12.30, 'Description for item 6', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754341/gerden5_el8roq.jpg', '5', '5'),
(7, 'CPU intel', 55.00, 'Description for item 7', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749756449/tech6_nbnyge.jpg', '6', '5'),
(8, 'Occhiali veloci', 20.00, 'Description for item 8', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754942/sport5_k14un3.jpg', '7', '5'),
(9, 'Crema nivea', 30.50, 'Description for item 9', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749756448/beaty6_gagcvb.jpg', '8', '5'),
(10, 'Marmellata fichi', 5.25, 'Description for item 10', 15, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749755711/food4_xzgzcd.jpg', '9', '5'),
(11, 'Libro web FRA', 14.80, 'Description for item 11', 9, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749746539/s-l1600_v48yxw.webp', '1', '5'),
(12, 'Lamapadina 2', 40.00, 'Description for item 12', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747408/eletronics1_zq4iur.jpg', '2', '5'),
(13, 'Cappello 2', 18.99, 'Description for item 13', 11, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749748160/vestito3_j2ofoo.jpg', '3', '5'),
(14, 'Ventilatore', 22.50, 'Description for item 14', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754014/home5_zruisy.jpg', '4', '5'),
(15, 'Paletta giardino 2', 9.99,  'Description for item 15', 8,'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754341/gerden5_el8roq.jpg', '5', '5'),
(16, 'CPU intel i7', 60.00, 'Description for item 16', 1, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749756449/tech6_nbnyge.jpg', '6', '5'),
(17, 'Occhiali da sole', 24.75, 'Description for item 17', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754942/sport5_k14un3.jpg', '7', '5'),
(18, 'Crema Nivea sole', 35.00, 'Description for item 18', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749756448/beaty6_gagcvb.jpg', '8', '5'),
(19, 'Marmellata', 7.50,  'Description for item 19', 14, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749755711/food4_xzgzcd.jpg', '9', '5'),
(20, 'Libro web ESP', 13.25, 'Description for item 20', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749746539/s-l1600_v48yxw.webp', '1', '5'),
(21, 'Lampadina led', 45.00, 'Description for item 21', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747408/eletronics1_zq4iur.jpg', '2', '5'),
(22, 'Cappello adidas', 17.50, 'Description for item 22', 10, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749748160/vestito3_j2ofoo.jpg', '3', '5'),
(23, 'Ventilatore stretto', 21.99, 'Description for item 23', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754014/home5_zruisy.jpg', '4', '5'),
(24, 'Paletta blu', 10.00, 'Description for item 24', 9, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754341/gerden5_el8roq.jpg', '5', '5'),
(25, 'CPU intel i7 9th', 70.00, 'Description for item 25', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749756449/tech6_nbnyge.jpg', '6', '5'),
(26, 'Fast sunglasses', 27.30, 'Description for item 26', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754942/sport5_k14un3.jpg', '7', '5'),
(27, 'Crema idratante', 38.50, 'Description for item 27', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749756448/beaty6_gagcvb.jpg', '8', '5'),
(28, 'Marmellata ai frutti', 6.75,  'Description for item 28', 12, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749755711/food4_xzgzcd.jpg', '9', '5'),
(29, 'Libro web CHI', 16.00, 'Description for item 29', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749746539/s-l1600_v48yxw.webp', '1', '5'),
(30, 'Lampadina NEON', 42.00, 'Description for item 30', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747408/eletronics1_zq4iur.jpg', '2', '5');

--NUOVI ITEM PER ARTIGIANI 7,8,9,10
INSERT INTO items (item_id, name, price, description, quantity, image_url, category_id, user_id) VALUES
(31, 'Libro developer ITA', 10.50, 'Description for item 31', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749746830/libro2_jd9v8y.jpg', '1', '7'),
(32, 'Libro developer ENG', 10.50, 'Description for item 32', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749746830/libro2_jd9v8y.jpg','1', '7'),
(33, 'Adattore presa', 25.00, 'Description for item 33', 10, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747439/eletronics2_tq9qxx.jpg', '2', '7'),
(34, 'Cappello nero', 15.75, 'Description for item 34', 8, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749748160/vestito3_j2ofoo.jpg', '3', '7'),
(35, 'Cuscino divano', 8.99,  'Description for item 35', 12, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754014/home4_x1s7t7.jpg', '4', '7'),
(36, 'Sacchi verdi', 12.30, 'Description for item 36', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754342/garden3_onenfi.jpg', '5', '7'),
(37, 'Tablet', 55.00, 'Description for item 37', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754711/tech4_peeika.jpg', '6', '7'),
(38, 'Borraccia', 20.00, 'Description for item 38', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754942/sport4_htdbd4.jpg', '7', '7'),
(39, 'Burrocacao', 30.50, 'Description for item 39', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749755306/bea4_dbkwhb.jpg', '8', '7'),
(40, 'Pane integrale', 5.25,  'Description for item 40', 15, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749755712/food3_m7o8lf.jpg', '9', '7'),
(41, 'Libro developer FRA', 14.80, 'Description for item 41', 9, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749746830/libro2_jd9v8y.jpg', '1', '7'),
(42, 'Shucko', 40.00, 'Description for item 42', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747439/eletronics2_tq9qxx.jpg', '2', '7'),
(43, 'Cappello nero bianco', 18.99, 'Description for item 43', 11, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749748160/vestito3_j2ofoo.jpg', '3', '7'),
(44, 'Cuscino divano bianco', 22.50, 'Description for item 44', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754014/home4_x1s7t7.jpg', '4', '7'),
(45, 'Sacchi da giardino', 9.99,  'Description for item 45', 8,'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754342/garden3_onenfi.jpg', '5', '7'),
(46, 'Ipad', 60.00, 'Description for item 46', 1, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754711/tech4_peeika.jpg', '6', '7'),
(47, 'Borraccia pet', 24.75, 'Description for item 47', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754942/sport4_htdbd4.jpg', '7', '7'),
(48, 'Crema labbra', 35.00, 'Description for item 48', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749755306/bea4_dbkwhb.jpg', '8', '7'),
(49, 'Pane', 7.50,  'Description for item 49', 14, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749755712/food3_m7o8lf.jpg', '9', '7'),
(50, 'Libro developer ESP', 13.25, 'Description for item 50', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749746830/libro2_jd9v8y.jpg', '1', '7'),
(51, 'Presa Shucko', 45.00, 'Description for item 51', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747439/eletronics2_tq9qxx.jpg', '2', '7'),
(52, 'Berretto', 17.50, 'Description for item 52', 10, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749748160/vestito3_j2ofoo.jpg', '3', '7'),
(53, 'Cuscini', 21.99, 'Description for item 53', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754014/home4_x1s7t7.jpg', '4', '7'),
(54, 'Sacchi per erba', 10.00, 'Description for item 54', 9, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754342/garden3_onenfi.jpg', '5', '7'),
(55, 'Ipad mini', 70.00, 'Description for item 55', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754711/tech4_peeika.jpg', '6', '7'),
(56, 'Borraccia 2l', 27.30, 'Description for item 56', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754942/sport4_htdbd4.jpg', '7', '7'),
(57, 'Prodotto labbra', 38.50, 'Description for item 57', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749755306/bea4_dbkwhb.jpg', '8', '7'),
(58, 'Pane ai 5 cereali', 6.75,  'Description for item 58', 12, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749755712/food3_m7o8lf.jpg', '9', '7'),
(59, 'Libro developer digitale', 16.00, 'Description for item 59', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749746830/libro2_jd9v8y.jpg', '1', '7'),
(60, 'Presa adattore shucko', 42.00, 'Description for item 60', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747439/eletronics2_tq9qxx.jpg', '2', '7');

INSERT INTO items (item_id, name, price, description, quantity, image_url, category_id, user_id) VALUES
(61, 'Full Stack Testing IT', 12.99, 'Description for item 61', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749746921/libro3_ygindv.jpg', 1, 8),
(62, 'Tenda Webcam White', 8.50, 'Description for item 62', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747467/ele3_bsf4ag.jpg', 2, 8),
(63, 'White Sweater XL', 15.00, 'Description for item 63', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749748160/vestito4_nx9gxl.jpg', 3, 8),
(64, 'Coffee Maker White', 20.00, 'Description for item 64', 10, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754014/home3_z6v6ul.jpg', 4, 8),
(65, 'SunSeeker Vacum Grey', 9.99, 'Description for item 65', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754341/garden4_jr6d1z.jpg', 5, 8),
(66, 'Vengeance Ram White', 18.75, 'Description for item 66', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754712/tech3_q7zw1o.jpg', 6, 8),
(67, 'BluKar Jump Rope Black', 11.25, 'Description for item 67', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754947/sport3_rg9qlt.jpg', 7, 8),
(68, 'Black Pencil', 14.40, 'Description for item 68', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749755309/bea3_yrkjuw.jpg', 8, 8),
(69, 'Rossi Pesto Genovese', 19.99, 'Description for item 69', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1750151240/pesto_bl2tx3.png', 9, 8),
(70, 'Full Stack Testing EN', 22.00, 'Description for item 70', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749746921/libro3_ygindv.jpg', 1, 8),
(71, 'Tenda Webcam Black', 10.00, 'Description for item 71', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747467/ele3_bsf4ag.jpg', 2, 8),
(72, 'White Sweater L', 12.60, 'Description for item 72', 8, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749748160/vestito4_nx9gxl.jpg', 3, 8),
(73, 'Coffee Maker Black', 13.90, 'Description for item 73', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754014/home3_z6v6ul.jpg', 4, 8),
(74, 'SunSeeker Vacum Black', 16.50, 'Description for item 74', 9, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754341/garden4_jr6d1z.jpg', 5, 8),
(75, 'Vengeance Ram Black', 21.00, 'Description for item 75', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754712/tech3_q7zw1o.jpg', 6, 8),
(76, 'BluKar Jump Rop Grey', 18.80, 'Description for item 76', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754947/sport3_rg9qlt.jpg', 7, 8),
(77, 'Blue Pencil', 11.90, 'Description for item 77', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749755309/bea3_yrkjuw.jpg', 8, 8),
(78, 'Rossi Pesto Genovese con Grana', 9.75, 'Description for item 78', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1750151240/pesto_bl2tx3.png', 9, 8),
(79, 'Full Stack Testing FR', 12.20, 'Description for item 79', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749746921/libro3_ygindv.jpg', 1, 8),
(80, 'Tenda Webcam Blue', 17.60, 'Description for item 80', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747467/ele3_bsf4ag.jpg', 2, 8),
(81, 'White Sweater S', 14.30, 'Description for item 81', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749748160/vestito4_nx9gxl.jpg', 3, 8),
(82, 'Coffee Maker Grey', 22.50, 'Description for item 82', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754014/home3_z6v6ul.jpg', 4, 8),
(83, 'SunSeeker Vacum Red', 10.60, 'Description for item 83', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754341/garden4_jr6d1z.jpg', 5, 8),
(84, 'Vengeance Ram Red', 19.20, 'Description for item 84', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754712/tech3_q7zw1o.jpg', 6, 8),
(85, 'BluKar Jump Rope Red', 13.30, 'Description for item 85', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754947/sport3_rg9qlt.jpg', 7, 8),
(86, 'Grey Pencil', 15.90, 'Description for item 86', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749755309/bea3_yrkjuw.jpg', 8, 8),
(87, 'Rossi Pesto Genovese senza aglio', 18.25, 'Description for item 87', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1750151240/pesto_bl2tx3.png', 9, 8),
(88, 'Full Stack Testing DE', 20.70, 'Description for item 88', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749746921/libro3_ygindv.jpg', 1, 8),
(89, 'Tenda Webcam Red', 17.30, 'Description for item 89', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747467/ele3_bsf4ag.jpg', 2, 8),
(90, 'White Sweater XS', 23.90, 'Description for item 90', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749748160/vestito4_nx9gxl.jpg', 3, 8);

INSERT INTO items (item_id, name, price, description, quantity, image_url, category_id, user_id) VALUES
(91, 'Concetti di informatica e fondamenti di Python IT', 10.50, 'Description for item 91', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747054/libro4_x8kuxo.jpg', 1, 9),
(92, 'Duracell PLUS Battery AA', 13.20, 'Description for item 92', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747684/ele4_k9hnjx.jpg', 2, 9),
(93, 'White Belt', 17.80, 'Description for item 93', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749748162/vestito2_sjrhhl.jpg', 3, 9),
(94, 'Cappuccino Maker Black', 21.00, 'Description for item 94', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754020/home2_sf3vag.jpg', 4, 9),
(95, 'Wood Flower Case', 8.90, 'Description for item 95', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754346/garden2_tkety1.jpg', 5, 9),
(96, 'Asus Laptop 1TB', 19.40, 'Description for item 96', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754718/tech2_d5lkps.jpg', 6, 9),
(97, 'Weights 3kg', 12.00, 'Description for item 97', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754948/sport2_y1q297.jpg', 7, 9),
(98, 'Nivea Doposole Rigenerante 400ml', 14.60, 'Description for item 98', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749756448/beaty6_gagcvb.jpg', 8, 9),
(99, 'Lemon Cake', 22.00, 'Description for item 99', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749755717/food2_vlleuu.jpg', 9, 9),
(100, 'Concetti di informatica e fondamenti di Python EN', 11.30, 'Description for item 100', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747054/libro4_x8kuxo.jpg', 1, 9),
(101, 'Duracell PLUS Battery AAA', 15.80, 'Description for item 101', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747684/ele4_k9hnjx.jpg', 2, 9),
(102, 'Red Belt', 9.99, 'Description for item 102', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749748162/vestito2_sjrhhl.jpg', 3, 9),
(103, 'Cappuccino Maker White', 16.20, 'Description for item 103', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754020/home2_sf3vag.jpg', 4, 9),
(104, 'Wood Flower Case', 13.75, 'Description for item 104', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754346/garden2_tkety1.jpg', 5, 9),
(105, 'Asus Laptop 560MB', 18.10, 'Description for item 105', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754718/tech2_d5lkps.jpg', 6, 9),
(106, 'Weights 5kg', 20.90, 'Description for item 106', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754948/sport2_y1q297.jpg', 7, 9),
(107, 'Nivea Doposole Rigenerante 300ml', 11.45, 'Description for item 107', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749756448/beaty6_gagcvb.jpg', 8, 9),
(108, 'Pineapple Cake', 14.00, 'Description for item 108', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749755717/food2_vlleuu.jpg', 9, 9),
(109, 'Concetti di informatica e fondamenti di Python FR', 23.50, 'Description for item 109', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747054/libro4_x8kuxo.jpg', 1, 9),
(110, 'Duracell PLUS Battery AAA4', 19.90, 'Description for item 110', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747684/ele4_k9hnjx.jpg', 2, 9),
(111, 'Black Belt', 13.30, 'Description for item 111', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749748162/vestito2_sjrhhl.jpg', 3, 9),
(112, 'Cappuccino Maker Grey', 17.70, 'Description for item 112', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754020/home2_sf3vag.jpg', 4, 9),
(113, 'Wood Flower Case', 16.60, 'Description for item 113', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754346/garden2_tkety1.jpg', 5, 9),
(114, 'Asus Laptop 2TB', 12.75, 'Description for item 114', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754718/tech2_d5lkps.jpg', 6, 9),
(115, 'Weights 1kg', 15.00, 'Description for item 115', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754948/sport2_y1q297.jpg', 7, 9),
(116, 'Nivea Doposole Rigenerante 350ml', 20.30, 'Description for item 116', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749756448/beaty6_gagcvb.jpg', 8, 9),
(117, 'Fruit Cake', 18.70, 'Description for item 117', 7, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749755717/food2_vlleuu.jpg', 9, 9),
(118, 'Concetti di informatica e fondamenti di Python DE', 9.80, 'Description for item 118', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747054/libro4_x8kuxo.jpg', 1, 9),
(119, 'Duracell PLUS Battery AA24', 22.80, 'Description for item 119', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747684/ele4_k9hnjx.jpg', 2, 9),
(120, 'Blue Belt', 11.95, 'Description for item 120', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749748162/vestito2_sjrhhl.jpg', 3, 9);

INSERT INTO items (item_id, name, price, description, quantity, image_url, category_id, user_id) VALUES
(121, 'Libro big data ITA', 10.2, 'Description for item 121', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747182/libro5_nn6igm.jpg', 1, 10),
(122, 'Cavo usbc', 12.4, 'Description for item 122', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747718/ele5_kfasma.jpg', 2, 10),
(123, 'Ciabatta', 12.5, 'Description for item 123', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749748166/vestito1_cnshgd.jpg', 3, 10),
(124, 'Aspirapolvere', 14.7, 'Description for item 124', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754021/home1_kbdn8q.jpg', 4, 10),
(125, 'Fari da giardino', 16.9, 'Description for item 125', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754347/garden1_lthcfo.jpg', 5, 10),
(126, 'Powerbank', 17.0, 'Description for item 126', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754719/tech1_v0p7uj.jpg', 6, 10),
(127, 'Cintura palestra', 19.2, 'Description for item 127', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754950/sport1_jtz3i8.jpg', 7, 10),
(128, 'Ombretti', 21.4, 'Description for item 128', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749755313/bea1_yxdeuc.jpg', 8, 10),
(129, 'Crostata', 21.5, 'Description for item 129', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749755718/food1_ik6vfh.webp', 9, 10),
(130, 'Cavo per telefono', 8.7, 'Description for item 130', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747718/ele5_kfasma.jpg', 2, 10),
(131, 'Ciabatta da casa', 9.8, 'Description for item 131', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749748166/vestito1_cnshgd.jpg', 3, 10),
(132, 'Libro big data ESP', 11.0, 'Description for item 132', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747182/libro5_nn6igm.jpg', 1, 10),
(133, 'Aspirapolvere new gen', 11.1, 'Description for item 133', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754021/home1_kbdn8q.jpg', 4, 10),
(134, 'Faretti con luce', 13.3, 'Description for item 134', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754347/garden1_lthcfo.jpg', 5, 10),
(135, 'Caricatore portatile', 13.6, 'Description for item 135', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754719/tech1_v0p7uj.jpg', 6, 10),
(136, 'Cintura per squat', 15.6, 'Description for item 136', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754950/sport1_jtz3i8.jpg', 7, 10),
(137, 'Trucchi per viso', 15.7, 'Description for item 137', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749755313/bea1_yxdeuc.jpg', 8, 10),
(138, 'Crostata ai frutti di bosco', 17.9, 'Description for item 138', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749755718/food1_ik6vfh.webp', 9, 10),
(139, 'Caricatore iphone16', 18.0, 'Description for item 139', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747718/ele5_kfasma.jpg', 2, 10),
(140, 'Ciabatta mare', 20.2, 'Description for item 140', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749748166/vestito1_cnshgd.jpg', 3, 10),
(141, 'Libro big data ENG', 20.3, 'Description for item 141', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747182/libro5_nn6igm.jpg', 1, 10),
(142, 'Aspirapolvere portatile', 22.5, 'Description for item 142', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754021/home1_kbdn8q.jpg', 4, 10),
(143, 'Luci da giardino', 22.6, 'Description for item 143', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754347/garden1_lthcfo.jpg', 5, 10),
(144, 'Powerbank nero portatile', 24.8, 'Description for item 144', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754719/tech1_v0p7uj.jpg', 6, 10),
(145, 'Cintura da powerlifting', 24.9, 'Description for item 145', 2, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749754950/sport1_jtz3i8.jpg', 7, 10),
(146, 'Trucchi', 27.1, 'Description for item 146', 3, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749755313/bea1_yxdeuc.jpg', 8, 10),
(147, 'Crostata ai mirtilli', 27.2, 'Description for item 147', 4, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749755718/food1_ik6vfh.webp', 9, 10),
(148, 'Cavo usbc 2m', 29.4, 'Description for item 148', 5, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749747718/ele5_kfasma.jpg', 2, 10),
(149, 'Ciabatta bianca', 29.5, 'Description for item 149', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749748166/vestito1_cnshgd.jpg', 3, 10),
(150, 'Ciabatta monocromatica', 21.3, 'Description for item 150', 6, 'https://res.cloudinary.com/dftu5zdbs/image/upload/v1749748166/vestito1_cnshgd.jpg', 3, 10);