--##############
-- 資料表定義
--##############
/* sys_operation 定義有哪些對資源的操作 */
create table if not exists public.sys_operation (
	name varchar(20) not null,
	description varchar(100) not null,
	operation varchar(20) primary key
);
comment on table public.sys_operation is '制定對資源可執行的操作';
comment on column public.sys_operation.name is '操作說明';
comment on column public.sys_operation.description is '操作說明';
comment on column public.sys_operation.operation is '操作標籤。因為是欄位主鍵，須有唯一性';

-- 把 C,R,U,D 拆開來是因為網頁端需要比較細緻的控制，例如只能新增不能刪除。
-- subscribe 從 read 獨立出來是因為搜尋比較方便，特別是要找出哪些屬於訂閱類型的權限，都用 read 還要切資源名稱。
insert into public.sys_operation (name, description, operation) values
('讀取', '權限擁有者可以檢視資源及其數據', 'read'),
('新增', '權限擁有者可以新增數據給資源', 'create'),
('編輯', '權限擁有者可編輯資源及其數據', 'update'),
('刪除', '權限擁有者可刪除資源或其數據', 'delete'),
('訂閱', '權限擁有者可訂閱資源或其數據。當內容更新時，會通知使用者。', 'subscribe'),
('賦予', '權限擁有者可賦予其他人擁有此資源的權限', 'grant')
ON CONFLICT (operation) DO NOTHING;


/* sys_resource 定義有哪些資源，主要設置相簿。
   id 請使用 資源類型-資源名稱-{UTF8-SHA256 -> substr(12)}(資源類型-資源名稱) */
create table if not exists public.sys_resource (
    id varchar(100) primary key not null,
    name varchar(100) not null,
    owner varchar(30) not null,
    type integer default 1,
    status smallint default 1 CHECK(status > -1 and status < 2),
    created_at timestamp default now(),
    updated_at timestamp default now()
);
comment on table public.sys_resource is '定義有哪些資源，主要用在使用者新建相簿。';
comment on column public.sys_resource.id is '資源編號(主鍵)，請使用 資源類型-資源名稱-{UTF8-SHA256 -> substr(12)}(資源類型-資源名稱)。';
comment on column public.sys_resource.name is '資源名稱';
comment on column public.sys_resource.type is '資源類型。1=公開相簿，2=受保護的相簿';
comment on column public.sys_resource.owner is '擁有者。可能是部門、個人或者系統建立的（system）。';
comment on column public.sys_resource.status is '資源狀態。0=禁用,1=啟用';
comment on column public.sys_resource.created_at is '創建時間';
comment on column public.sys_resource.updated_at is '最後更新時間，可以當作刪除的標準。';


/* sys_resource_explorer 是記錄資源擁有哪些實體檔案（照片）或者子資源。
   這個主要目的是讓系統了解使用者建立的「虛擬」相簿和實體照片（CameraGrabHist or uplload_history）的關係。 */
create table if not exists public.sys_resource_explorer (
    resource varchar(100) references public.sys_resource(id),
    target_type smallint default 1 CHECK (target_type > 0),
    target varchar(100) not null,
    status smallint default 1 CHECK(status > -1 and status < 2),
    created_at timestamp default now(),
    updated_at timestamp default now(),
    primary key(resource, target_type, target)
);
comment on table public.sys_resource_explorer is '記錄資源擁有哪些實體檔案（照片）或者子資源。';
comment on column public.sys_resource_explorer.resource is '資源編號';
comment on column public.sys_resource_explorer.target_type is '目標類型。1=實體檔案，2=子資源';
comment on column public.sys_resource_explorer.target is '目標編號。可能是實體檔案名稱（含副檔名）或子資源的編號。';
comment on column public.sys_resource_explorer.status is '關係狀態。0=禁用,1=啟用';
comment on column public.sys_resource_explorer.created_at is '創建時間';
comment on column public.sys_resource_explorer.updated_at is '最後更新時間，可以當作刪除的標準。';


/* sys_permission 定義能對資源進行操作的權限
   每一個權限 = 對某一項資源允許一個指定操作
   或者把權限當作「標籤」使用，例如不要訂閱某些東西
   部門或者個人照片已經記錄在 CameraGrabHist，這種就不用額外記錄了。 */
create table if not exists public.sys_permission (
	name varchar(30) primary key not null,
	description varchar(100) not null,
	resource varchar(100) references public.sys_resource(id),
	operation varchar(20) references public.sys_operation(operation),
	status smallint default 1 CHECK(status > -1 and status < 2),
    created_at timestamp default now(),
    updated_at timestamp default now()
);
comment on table public.sys_permission is '設置允許對指定資源進行操作的權限';
comment on column public.sys_permission.name is '權限名稱(主鍵)。命名方式為 資源類型-資源名稱-操作前幾個字母大寫。';
comment on column public.sys_permission.description is '權限說明';
comment on column public.sys_permission.resource is '資源名稱(具唯一性)，外鍵允許填入NULL';
comment on column public.sys_permission.operation is '操作名稱(具唯一性)，外鍵允許填入NULL';
comment on column public.sys_permission.status is '權限狀態。0=禁用,1=啟用';
comment on column public.sys_permission.created_at is '創建時間';
comment on column public.sys_permission.updated_at is '最後更新時間，可以當作刪除的標準。';


/* sys_role 定義有哪些角色 */
create table if not exists public.sys_role (
	role varchar(30) primary key not null,
	name varchar(30) not null,
	description varchar(100) not null,
	status smallint default 1 CHECK(status > -1 and status < 2),
    created_at timestamp default now(),
    updated_at timestamp default now()
);
comment on table public.sys_role is '設置具有特定權限的角色';
comment on column public.sys_role.role is '角色標籤(主鍵)。角色定位-角色名稱，使用英文撰寫，方便第三方程式判斷。';
comment on column public.sys_role.name is '角色名稱';
comment on column public.sys_role.description is '角色定位';
comment on column public.sys_role.status is '角色狀態。0=禁用,1=啟用';
comment on column public.sys_role.created_at is '創建時間';
comment on column public.sys_role.updated_at is '最後更新時間，可以當作刪除的標準。';


/* sys_role_permission 定義角色具有哪些權限 */
create table if not exists public.sys_role_permission (
	role varchar(30) references public.sys_role(role),
	permission varchar(30) references public.sys_permission(name),
    status smallint default 1 CHECK(status > -1 and status < 2),
    created_at timestamp default now(),
    updated_at timestamp default now(),
	primary key(role, permission)
);
comment on table public.sys_role_permission is '角色擁有哪些權限';
comment on column public.sys_role_permission.role is '角色標籤';
comment on column public.sys_role_permission.permission is '權限名稱';
comment on column public.sys_role_permission.status is '角色狀態。0=禁用,1=啟用';
comment on column public.sys_role_permission.created_at is '創建時間';
comment on column public.sys_role_permission.updated_at is '最後更新時間，可以當作刪除的標準。';

/* sys_user 定義有哪些用戶 */
-- 資料表
create table if not exists public.sys_user (
    id varchar(20) primary key not null,
    password varchar(100),
    salt varchar(100),
    name varchar(30) not null,
    dept1 varchar(20) not null,
    dept2 varchar(20) not null,
    dept3 varchar(20) default '',
    phone varchar(20),
    email varchar(50) not null,
    avatar varchar(100),
    status smallint default 1 CHECK(status > -1 and status < 2),
    created_at timestamp default now(),
    updated_at timestamp default now()
);
comment on table public.sys_user is '設置用戶';
comment on column public.sys_user.id is '員工編號。這是用戶的唯一標識。';
comment on column public.sys_user.password is '密碼。使用md5加密。由於UMC有認證API，因此目前沒有使用。';
comment on column public.sys_user.salt is '密碼鹽。使用md5加密。由於UMC有認證API，因此目前沒有使用。';
comment on column public.sys_user.name is '用戶名稱。會去UMC的API獲取該工號對應的名字。';
comment on column public.sys_user.dept1 is '一級部門。會去UMC的API獲取該工號對應的部門。';
comment on column public.sys_user.dept2 is '二級部門。會去UMC的API獲取該工號對應的部門。';
comment on column public.sys_user.dept3 is '三級部門，不一定有。會去UMC的API獲取該工號對應的部門。';
comment on column public.sys_user.phone is '員工分機或手機。會去UMC的API獲取該工號對應的電話。';
comment on column public.sys_user.email is '員工郵箱。會去UMC的API獲取該工號對應的郵箱。';
comment on column public.sys_user.avatar is '頭像。目前沒有使用。';
comment on column public.sys_user.status is '用戶狀態。0=禁用,1=啟用';
comment on column public.sys_user.created_at is '創建時間';
comment on column public.sys_user.updated_at is '更新時間';


/* sys_user_role 定義用戶擁有哪些角色
   解決每次都要先建立 usergroup 再建立 role 的問題 */
create table if not exists public.sys_user_role (
	user_id varchar(20) references public.sys_user(id),
	role varchar(30) references public.sys_role(role),
    status smallint default 1 CHECK(status > -1 and status < 2),
    created_at timestamp default now(),
    updated_at timestamp default now(),
	primary key(user_id, role)
);
comment on table public.sys_user_role is '用戶擁有哪些角色';
comment on column public.sys_user_role.role is '角色標籤';
comment on column public.sys_user_role.user_id is '員工編號';
comment on column public.sys_user_role.status is '關係狀態。0=禁用,1=啟用';
comment on column public.sys_user_role.created_at is '創建時間';
comment on column public.sys_user_role.updated_at is '最後更新時間，可以當作刪除的標準。';


/* sys_user_permission 定義用戶具有哪些權限
   這個具有最高權限，主要是解決用戶的私人資料夾、相簿或檔案。 */
create table if not exists public.sys_user_permission (
	user_id varchar(20) references public.sys_user(id),
	permission varchar(30) references public.sys_permission(name),
    status smallint default 1 CHECK(status > -1 and status < 2),
    created_at timestamp default now(),
    updated_at timestamp default now(),
	primary key(user_id, permission)
);
comment on table public.sys_user_permission is '用戶擁有哪些權限';
comment on column public.sys_user_permission.user_id is '員工編號';
comment on column public.sys_user_permission.permission is '權限名稱';
comment on column public.sys_user_permission.status is '關係狀態。0=禁用,1=啟用';
comment on column public.sys_user_permission.created_at is '創建時間';
comment on column public.sys_user_permission.updated_at is '最後更新時間，可以當作刪除的標準。';


/*
 * sys_usergroup 定義用戶組。這個非常重要，因為員工一定都會有部門，這樣會比較方便。
 * 用戶組可以視為一個特殊的用戶。
 * 因為有建 parent，所以可以用 CTE 遞迴(With Recursive)的方式取得用戶組的所有上級用戶組。
 */
create table if not exists public.sys_usergroup (
	name varchar(30) primary key not null,
	description varchar(100),
	parent varchar(30),
    created_at timestamp default now(),
    updated_at timestamp default now()
);
comment on table public.sys_usergroup is '設置用戶組，方便設置權限';
comment on column public.sys_usergroup.name is '用戶組名稱，方便辨識';
comment on column public.sys_usergroup.description is '用戶組說明';
comment on column public.sys_usergroup.parent is '父級用戶組，不填表示沒有';
comment on column public.sys_usergroup.created_at is '創建時間';
comment on column public.sys_usergroup.updated_at is '最後更新時間，可以當作刪除的標準。';


/*
 * sys_user_usergroup 定義用戶屬於哪些用戶組
 * 這裡採用的是記錄直接關聯用戶，因此搜尋的時候需要用遞迴的方式取得所有上級用戶組，會比較慢。
 */
create table if not exists public.sys_user_usergroup (
    user_id varchar(20) references public.sys_user(id),
    usergroup varchar(30) references public.sys_usergroup(name),
    status smallint default 1 CHECK(status > -1 and status < 2),
    created_at timestamp default now(),
    updated_at timestamp default now(),
    primary key(user_id, usergroup)
);
comment on table public.sys_user_usergroup is '用戶屬於哪些用戶組';
comment on column public.sys_user_usergroup.user_id is '員工編號';
comment on column public.sys_user_usergroup.usergroup is '用戶組名稱';
comment on column public.sys_user_usergroup.status is '關係狀態。0=禁用,1=啟用';
comment on column public.sys_user_usergroup.created_at is '創建時間';
comment on column public.sys_user_usergroup.updated_at is '最後更新時間，可以當作刪除的標準。';


/*
 * sys_usergroup_role 定義用戶組具有哪些角色，並透過 status 控制用戶組是否能使用該角色。
 * 針對用戶組新增角色可以大幅度降低資料量，因為用戶組的數量遠遠小於用戶的數量。
 */
-- 資料表
create table if not exists public.sys_usergroup_role (
    usergroup varchar(30) references public.sys_usergroup(name),
    role varchar(30) references public.sys_role(role),
    status smallint default 1 CHECK(status > -1 and status < 2),
    created_at timestamp default now(),
    updated_at timestamp default now(),
    primary key(usergroup, role)
);
comment on table public.sys_usergroup_role is '用戶組擁有哪些角色';
comment on column public.sys_usergroup_role.usergroup is '用戶組名稱';
comment on column public.sys_usergroup_role.role is '角色標籤';
comment on column public.sys_usergroup_role.status is '關係狀態。0=禁用,1=啟用';
comment on column public.sys_usergroup_role.created_at is '創建時間';
comment on column public.sys_usergroup_role.updated_at is '最後更新時間，可以當作刪除的標準。';


/* sys_usergroup_permission 定義用戶具有哪些權限
   這個具有第二高權限，主要是解決用戶組內部共享的資料夾、相簿或檔案。 */
create table if not exists public.sys_usergroup_permission (
	usergroup varchar(30) references public.sys_usergroup(name),
	permission varchar(30) references public.sys_permission(name),
    status smallint default 1 CHECK(status > -1 and status < 2),
    created_at timestamp default now(),
    updated_at timestamp default now(),
	primary key(usergroup, permission)
);
comment on table public.sys_usergroup_permission is '用戶組擁有哪些權限';
comment on column public.sys_usergroup_permission.usergroup is '用戶組';
comment on column public.sys_usergroup_permission.permission is '權限名稱';
comment on column public.sys_usergroup_permission.status is '關係狀態。0=禁用,1=啟用';
comment on column public.sys_usergroup_permission.created_at is '創建時間';
comment on column public.sys_usergroup_permission.updated_at is '最後更新時間，可以當作刪除的標準。';



--##########################################
-- 資料新增
--##########################################
--#########
-- 預設資料
-- 使用 transaction 來確保資料一致性
--#########
insert into public.sys_permission(name, description, operation) values
('tag-admin-G', '能否賦予管理員權限給他人的標籤', 'grant')
ON CONFLICT (name) DO NOTHING;

insert into public.sys_role(role, name, description) values
('root', '超級管理員', '擁有所有管理權限，且能夠賦予別人管理員職位'),
('admin', '管理員', '擁有所有管理權限，但無法賦予別人管理員職位'),
('employee', '普通用戶', '只能觀看自己拍攝的照片或者所屬部門的照片以及基礎功能。')
ON CONFLICT (role) DO NOTHING;

insert into public.sys_role_permission(role, permission) values
('root', 'tag-admin-G')
on conflict (role, permission) do nothing;

insert into public.sys_user(id, name, dept1, dept2, dept3, email) values
('00000000', '最高權限擁有人', 'super', 'test', 'abc', 'maxwell5566@yahoo.com.tw'),
('00025016', '鄭如凱', 'IT', 'CIM8D', '', '00025016@umc.com')
ON CONFLICT (id) DO NOTHING;

insert into public.sys_user_role(user_id, role) values
('00000000', 'root'),
('00025016', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;


--#########
-- 測試資料
-- 可以測試 user->perm,usergroup->perm,role->perm
--#########
insert into public.sys_permission(name, description, operation) values
('test-super/test/abc-R', '測試權限1', 'read'),
('test-super/test-R', '測試權限2', 'read'),
('test-super-R', '測試權限3', 'read'),
('test-super1-R', '測試權限4', 'read'),
('test-super2-R', '測試權限5', 'read'),
('test-super3-R', '測試權限6', 'read')
ON CONFLICT (name) DO NOTHING;

insert into public.sys_role(role, name, description) values
('test-employee1', '測試角色1', '測試用角色1'),
('test-employee2', '測試角色2', '測試用角色2'),
('test-employee3', '測試角色3', '測試用角色3')
ON CONFLICT (role) DO NOTHING;

insert into public.sys_role_permission(role, permission) values
('test-employee1', 'test-super1-R'),
('test-employee2', 'test-super2-R'),
('test-employee3', 'test-super3-R')
ON CONFLICT (role, permission) DO NOTHING;

insert into public.sys_usergroup (name, description, parent) values
('super/test/abc', '測試用用戶組0', 'super/test'),
('super/test', '測試用用戶組1', 'super'),
('super', '測試用用戶組2', NULL)
ON CONFLICT (name) DO NOTHING;

insert into public.sys_usergroup_permission(usergroup, permission) values
('super/test/abc', 'test-super/test/abc-R'),
('super/test', 'test-super/test-R'),
('super', 'test-super-R')
ON CONFLICT (usergroup, permission) DO NOTHING;

insert into public.sys_usergroup_role (usergroup, role) values
('super/test/abc', 'test-employee3'),
('super/test', 'test-employee2'),
('super', 'test-employee1')
ON CONFLICT (usergroup, role) DO NOTHING;

insert into public.sys_user(id, name, dept1, dept2, dept3, email) values
('admin0', '測試用管理員', 'super', 'test', '', 'maxwell5566@yahoo.com.tw'),
('test0', '一級部門測試員', 'super', '', '', 'maxwell5566@yahoo.com.tw'),
('test1', '二級部門測試員', 'super', 'test', '', 'maxwell5566@yahoo.com.tw'),
('test2', '三級部門測試員', 'super', 'test', 'abc', 'maxwell5566@yahoo.com.tw')
ON CONFLICT (id) DO NOTHING;

insert into public.sys_user_usergroup (user_id, usergroup) values
('admin0', 'super/test'),
('test0', 'super'),
('test1', 'super/test'),
('test2', 'super/test/abc')
ON CONFLICT (user_id, usergroup) DO NOTHING;

insert into public.sys_user_role(user_id, role) values
('admin0', 'admin'),
('admin0', 'test-employee2'),
('test0', 'test-employee2'),
('test1', 'test-employee2'),
('test2', 'test-employee2'),
('test0', 'test-employee3'),
('test1', 'test-employee3'),
('test2', 'test-employee3')
ON CONFLICT (user_id, role) DO NOTHING;

insert into public.sys_user_permission(user_id, permission) values
('test0', 'test-super1-R'),
('test1', 'test-super2-R'),
('test2', 'test-super3-R')
ON CONFLICT (user_id, permission) DO NOTHING;



--##############
-- 建立測試部門的相關資料
-- 底下才不用每次都輸入
--##############
insert into public.sys_usergroup(name, description, parent) values
('IT/CIM8D/PI', '凱哥想要開放的測試部門', 'IT/CIM8D'),
('IT/CIM8F/PI', '凱哥想要開放的測試部門', 'IT/CIM8F')
ON CONFLICT (name) DO NOTHING;


--##############
-- DPS/8AB 相簿
-- 和 backend/settings/settings.*.toml 的 [aoi.fab] 相關
-- 請把 album-*/* 丟進 README.md 推薦的 SHA256 計算器，然後擷取前 12 個字元。
--##############
insert into public.sys_resource(id, name, owner, type) values
('album-dps/8AB-84ad84c453a2', 'DPS/8AB相簿', 'system', 2)
ON CONFLICT (id) DO NOTHING;

-- 這個是指定權限會去讀取哪些部門的照片
insert into public.sys_resource_explorer(resource, target_type, target) values
('album-dps/8AB-84ad84c453a2', 2, 'dep-FAB8AB/ET/E_EQ2')
ON CONFLICT (resource, target_type, target) DO NOTHING;

insert into public.sys_permission(name, description, resource, operation) values
('album-dps/8AB-R', '可讀取DPS/8AB相簿內容', 'album-dps/8AB-84ad84c453a2', 'read')
ON CONFLICT (name) DO NOTHING;

insert into public.sys_role_permission(role, permission) values
('root', 'album-dps/8AB-R'),
('admin', 'album-dps/8AB-R')
ON CONFLICT (role, permission) DO NOTHING;

-- 設定用戶組擁有哪些角色
-- 照片提供部門以及上級一定可以看照片
insert into public.sys_usergroup(name, description, parent) values
('FAB8AB/ET/E_EQ2', 'DPS/8AB的照片提供者,所以可以看照片', 'FAB8AB/ET'),
('FAB8AB/ET', 'FAB8AB/ET/E_EQ2的上級,所以可以看照片', 'FAB8AB'),
('FAB8AB', 'FAB8AB/ET的上級,所以可以看照片', NULL)
ON CONFLICT (name) DO NOTHING;

insert into public.sys_usergroup_permission(usergroup, permission) values
('FAB8AB/ET/E_EQ2', 'album-dps/8AB-R'),
('FAB8AB/ET', 'album-dps/8AB-R'),
('FAB8AB', 'album-dps/8AB-R'),
('IT/CIM8D/PI', 'album-dps/8AB-R'),
('IT/CIM8F/PI', 'album-dps/8AB-R')
ON CONFLICT (usergroup, permission) DO NOTHING;


--##############
-- DPS/8C 相簿
-- 和 backend/settings/settings.*.toml 的 [aoi.fab] 相關
-- 請把 album-*/* 丟進 README.md 推薦的 SHA256 計算器，然後擷取前 12 個字元。
--##############
insert into public.sys_resource(id, name, owner, type) values
('album-dps/8C-639b92b9e705', 'DPS/8C相簿', 'system', 2)
ON CONFLICT (id) DO NOTHING;

-- 這個是指定權限會去讀取哪些部門的照片
insert into public.sys_resource_explorer(resource, target_type, target) values
('album-dps/8C-639b92b9e705', 2, 'dep-FAB8C/ET/E_EQ2')
ON CONFLICT (resource, target_type, target) DO NOTHING;

insert into public.sys_permission(name, description, resource, operation) values
('album-dps/8C-R', '可讀取DPS/8C相簿內容', 'album-dps/8C-639b92b9e705', 'read')
ON CONFLICT (name) DO NOTHING;

insert into public.sys_role_permission(role, permission) values
('root', 'album-dps/8C-R'),
('admin', 'album-dps/8C-R')
ON CONFLICT (role, permission) DO NOTHING;

-- 設定用戶組擁有哪些角色
-- 照片提供部門以及上級一定可以看照片
insert into public.sys_usergroup(name, description, parent) values
('FAB8C/ET/E_EQ2', 'DPS/8C的照片提供者,所以可以看照片', 'FAB8C/ET'),
('FAB8C/ET', 'FAB8C/ET/E_EQ2的上級,所以可以看照片', 'FAB8C'),
('FAB8C', 'FAB8C/ET的上級,所以可以看照片', NULL)
ON CONFLICT (name) DO NOTHING;

insert into public.sys_usergroup_permission(usergroup, permission) values
('FAB8C/ET/E_EQ2', 'album-dps/8C-R'),
('FAB8C/ET', 'album-dps/8C-R'),
('FAB8C', 'album-dps/8C-R'),
('IT/CIM8D/PI', 'album-dps/8C-R'),
('IT/CIM8F/PI', 'album-dps/8C-R')
ON CONFLICT (usergroup, permission) DO NOTHING;


--##############
-- DPS/8D 相簿
-- 和 backend/settings/settings.*.toml 的 [aoi.fab] 相關
-- 請把 album-*/* 丟進 README.md 推薦的 SHA256 計算器，然後擷取前 12 個字元。
--##############
insert into public.sys_resource(id, name, owner, type) values
('album-dps/8D-618654ec05b5', 'DPS/8D相簿', 'system', 2)
ON CONFLICT (id) DO NOTHING;

-- 這個是指定權限會去讀取哪些部門的照片
insert into public.sys_resource_explorer(resource, target_type, target) values
('album-dps/8D-618654ec05b5', 2, 'dep-FAB8D/ET/E_EQ2')
ON CONFLICT (resource, target_type, target) DO NOTHING;

insert into public.sys_permission(name, description, resource, operation) values
('album-dps/8D-R', '可讀取DPS/8D相簿內容', 'album-dps/8D-618654ec05b5', 'read')
ON CONFLICT (name) DO NOTHING;

insert into public.sys_role_permission(role, permission) values
('root', 'album-dps/8D-R'),
('admin', 'album-dps/8D-R')
ON CONFLICT (role, permission) DO NOTHING;

-- 設定用戶組擁有哪些角色
-- 照片提供部門以及上級一定可以看照片
insert into public.sys_usergroup(name, description, parent) values
('FAB8D/ET/E_EQ2', 'DPS/8D的照片提供者,所以可以看照片', 'FAB8D/ET'),
('FAB8D/ET', 'FAB8D/ET/E_EQ2的上級,所以可以看照片', 'FAB8D'),
('FAB8D', 'FAB8D/ET的上級,所以可以看照片', NULL)
ON CONFLICT (name) DO NOTHING;

insert into public.sys_usergroup_permission(usergroup, permission) values
('FAB8D/ET/E_EQ2', 'album-dps/8D-R'),
('FAB8D/ET', 'album-dps/8D-R'),
('FAB8D', 'album-dps/8D-R'),
('IT/CIM8D/PI', 'album-dps/8D-R'),
('IT/CIM8F/PI', 'album-dps/8D-R')
ON CONFLICT (usergroup, permission) DO NOTHING;


--##############
-- DPS/8E 相簿
-- 和 backend/settings/settings.*.toml 的 [aoi.fab] 相關
-- 請把 album-*/* 丟進 README.md 推薦的 SHA256 計算器，然後擷取前 12 個字元。
--##############
insert into public.sys_resource(id, name, owner, type) values
('album-dps/8E-35712a7ebefa', 'DPS/8E相簿', 'system', 2)
ON CONFLICT (id) DO NOTHING;

-- 這個是指定權限會去讀取哪些部門的照片
insert into public.sys_resource_explorer(resource, target_type, target) values
('album-dps/8E-35712a7ebefa', 2, 'dep-FAB8E/ET/E_EQ1')
ON CONFLICT (resource, target_type, target) DO NOTHING;

insert into public.sys_permission(name, description, resource, operation) values
('album-dps/8E-R', '可讀取DPS/8E相簿內容', 'album-dps/8E-35712a7ebefa', 'read')
ON CONFLICT (name) DO NOTHING;

insert into public.sys_role_permission(role, permission) values
('root', 'album-dps/8E-R'),
('admin', 'album-dps/8E-R')
ON CONFLICT (role, permission) DO NOTHING;

-- 設定用戶組擁有哪些角色
-- 照片提供部門以及上級一定可以看照片
insert into public.sys_usergroup(name, description, parent) values
('FAB8E/ET/E_EQ1', 'DPS/8E的照片提供者,所以可以看照片', 'FAB8E/ET'),
('FAB8E/ET', 'FAB8E/ET/E_EQ1的上級,所以可以看照片', 'FAB8E'),
('FAB8E', 'FAB8E/ET的上級,所以可以看照片', NULL)
ON CONFLICT (name) DO NOTHING;

insert into public.sys_usergroup_permission(usergroup, permission) values
('FAB8E/ET/E_EQ1', 'album-dps/8E-R'),
('FAB8E/ET', 'album-dps/8E-R'),
('FAB8E', 'album-dps/8E-R'),
('IT/CIM8D/PI', 'album-dps/8E-R'),
('IT/CIM8F/PI', 'album-dps/8E-R')
ON CONFLICT (usergroup, permission) DO NOTHING;


--##############
-- DPS/8F 相簿
-- 和 backend/settings/settings.*.toml 的 [aoi.fab] 相關
-- 請把 album-*/* 丟進 README.md 推薦的 SHA256 計算器，然後擷取前 12 個字元。
--##############
insert into public.sys_resource(id, name, owner, type) values
('album-dps/8F-d411b4cffc87', 'DPS/8F相簿', 'system', 2)
ON CONFLICT (id) DO NOTHING;

-- 這個是指定權限會去讀取哪些部門的照片
insert into public.sys_resource_explorer(resource, target_type, target) values
('album-dps/8F-d411b4cffc87', 2, 'dep-FAB8F/ET/E_EQ1'),
('album-dps/8F-d411b4cffc87', 2, 'dep-FAB8F/TF/T_EQ2')
ON CONFLICT (resource, target_type, target) DO NOTHING;

insert into public.sys_permission(name, description, resource, operation) values
('album-dps/8F-R', '可讀取DPS/8F相簿內容', 'album-dps/8F-d411b4cffc87', 'read')
ON CONFLICT (name) DO NOTHING;

insert into public.sys_role_permission(role, permission) values
('root', 'album-dps/8F-R'),
('admin', 'album-dps/8F-R')
ON CONFLICT (role, permission) DO NOTHING;

-- 設定用戶組擁有哪些角色
-- 照片提供部門以及上級一定可以看照片
insert into public.sys_usergroup(name, description, parent) values
('FAB8F/ET/E_EQ1', 'DPS/8F的照片提供者,所以可以看照片', 'FAB8F/ET'),
('FAB8F/ET', 'FAB8F/ET/E_EQ1的上級,所以可以看照片', 'FAB8F'),
('FAB8F/TF/T_EQ2', 'DPS/8F的照片提供者,所以可以看照片', 'FAB8F/TF'),
('FAB8F/TF', 'FAB8F/TF/T_EQ2的上級,所以可以看照片', 'FAB8F'),
('FAB8F', 'FAB8F/ET&FAB8F/TF的上級,所以可以看照片', NULL)
ON CONFLICT (name) DO NOTHING;

insert into public.sys_usergroup_permission(usergroup, permission) values
('FAB8F/ET/E_EQ1', 'album-dps/8F-R'),
('FAB8F/ET', 'album-dps/8F-R'),
('FAB8F/TF/T_EQ2', 'album-dps/8F-R'),
('FAB8F/TF', 'album-dps/8F-R'),
('FAB8F', 'album-dps/8F-R'),
('IT/CIM8D/PI', 'album-dps/8F-R'),
('IT/CIM8F/PI', 'album-dps/8F-R')
ON CONFLICT (usergroup, permission) DO NOTHING;


--##############
-- DPS/8S 相簿
-- 和 backend/settings/settings.*.toml 的 [aoi.fab] 相關
-- 請把 album-*/* 丟進 README.md 推薦的 SHA256 計算器，然後擷取前 12 個字元。
--##############
insert into public.sys_resource(id, name, owner, type) values
('album-dps/8S-fe29d637b9cc', 'DPS/8S相簿', 'system', 2)
ON CONFLICT (id) DO NOTHING;

-- 這個是指定權限會去讀取哪些部門的照片
insert into public.sys_resource_explorer(resource, target_type, target) values
('album-dps/8S-fe29d637b9cc', 2, 'dep-FAB8S/ET/E_EQ1')
ON CONFLICT (resource, target_type, target) DO NOTHING;

insert into public.sys_permission(name, description, resource, operation) values
('album-dps/8S-R', '可讀取DPS/8S相簿內容', 'album-dps/8S-fe29d637b9cc', 'read')
ON CONFLICT (name) DO NOTHING;

insert into public.sys_role_permission(role, permission) values
('root', 'album-dps/8S-R'),
('admin', 'album-dps/8S-R')
ON CONFLICT (role, permission) DO NOTHING;

-- 設定用戶組擁有哪些角色
-- 照片提供部門以及上級一定可以看照片
insert into public.sys_usergroup(name, description, parent) values
('FAB8S/ET/E_EQ1', 'DPS/8S的照片提供者,所以可以看照片', 'FAB8S/ET'),
('FAB8S/ET', 'FAB8S/ET/E_EQ1的上級,所以可以看照片', 'FAB8S'),
('FAB8S', 'FAB8S/ET的上級,所以可以看照片', NULL)
ON CONFLICT (name) DO NOTHING;

insert into public.sys_usergroup_permission(usergroup, permission) values
('FAB8S/ET/E_EQ1', 'album-dps/8S-R'),
('FAB8S/ET', 'album-dps/8S-R'),
('FAB8S', 'album-dps/8S-R'),
('IT/CIM8D/PI', 'album-dps/8S-R'),
('IT/CIM8F/PI', 'album-dps/8S-R')
ON CONFLICT (usergroup, permission) DO NOTHING;


--##############
-- HDP/8F 相簿
-- mail-hdp 會從這裡抓取資料夾名稱。
--##############
insert into public.sys_resource(id, name, owner, type) values
('album-hdp/8F-0a8b964660f5', 'HDP/8F相簿', 'system', 2)
ON CONFLICT (id) DO NOTHING;

-- 這個是指定 HDP/8F 會去讀取哪些部門的照片
insert into public.sys_resource_explorer(resource, target_type, target) values
('album-hdp/8F-0a8b964660f5', 2, 'dep-FAB8F/TF/T_EQ2')
ON CONFLICT (resource, target_type, target) DO NOTHING;

insert into public.sys_permission(name, description, resource, operation) values
('album-hdp/8F-R', '可讀取HDP/8F相簿內容', 'album-hdp/8F-0a8b964660f5', 'read')
ON CONFLICT (name) DO NOTHING;

insert into public.sys_role_permission(role, permission) values
('root', 'album-hdp/8F-R'),
('admin', 'album-hdp/8F-R')
ON CONFLICT (role, permission) DO NOTHING;

-- 設定用戶組擁有哪些角色
-- 照片提供部門是 FAB8F/TF/T_EQ2，所以他們以及上級一定可以看照片
insert into public.sys_usergroup(name, description, parent) values
('FAB8F/TF/T_EQ2', 'HDP/8F的照片提供者,所以可以看照片', 'FAB8F/TF'),
('FAB8F/TF', 'FAB8F/TF/T_EQ2的上級,所以可以看照片', 'FAB8F'),
('FAB8F', 'FAB8F/TF的上級,所以可以看照片', NULL),
('FAB8F/FAB8F', '凱哥想要開放的測試部門', 'FAB8F')
ON CONFLICT (name) DO NOTHING;

insert into public.sys_usergroup_permission(usergroup, permission) values
('FAB8F/TF/T_EQ2', 'album-hdp/8F-R'),
('FAB8F/TF', 'album-hdp/8F-R'),
('FAB8F', 'album-hdp/8F-R'),
('IT/CIM8D/PI', 'album-hdp/8F-R'),
('IT/CIM8F/PI', 'album-hdp/8F-R'),
('FAB8F/FAB8F', 'album-hdp/8F-R')
ON CONFLICT (usergroup, permission) DO NOTHING;


--####################
-- Mail HDP
-- 設定管理員是誰、哪些人不想收到信件、哪些人訂閱了HDP/8F
-- 因為管理員所有廠區都會收到信件，所以不用設定資源。
--####################
insert into public.sys_permission(name, description, resource, operation) values
('mail-hdp/admin-R', '接收mail-hdp發送的信件以及一張列出收件人的統計報表', NULL, 'read'),
('mail-hdp/unsubscribe-X', '不想收到 mail-hdp 寄給我的信件', NULL, NULL),
('mail-hdp/8F-S', '標記用，讓網頁知道哪些人有訂閱這個項目。', 'album-hdp/8F-0a8b964660f5', 'read')
ON CONFLICT (name) DO NOTHING;

insert into public.sys_user_permission(user_id, permission) values
('00025016', 'mail-hdp/admin-R'),
('00025016', 'mail-hdp/8F-S')
ON CONFLICT (user_id, permission) DO NOTHING;


--####################
-- Heater/8F 相簿
--####################
insert into public.sys_resource(id, name, owner, type) values
('album-heater/8F-f01091bdeada', 'Heater/8F相簿', 'system', 2)
ON CONFLICT (id) DO NOTHING;

-- 這個是指定 Heater/8F 會去讀取哪些部門的照片
insert into public.sys_resource_explorer(resource, target_type, target) values
('album-heater/8F-f01091bdeada', 2, 'dep-FAB8F/DF/D_EQ1'),
('album-heater/8F-f01091bdeada', 2, 'dep-FAB8F/DF/D_EQ2'),
('album-heater/8F-f01091bdeada', 2, 'dep-FAB8F/DF/D_EQ3')
ON CONFLICT (resource, target_type, target) DO NOTHING;

insert into public.sys_permission(name, description, resource, operation) values
('album-heater/8F-R', '可讀取相簿Heater/8F的內容', 'album-heater/8F-f01091bdeada', 'read')
ON CONFLICT (name) DO NOTHING;

insert into public.sys_role_permission(role, permission) values
('root', 'album-heater/8F-R'),
('admin', 'album-heater/8F-R')
ON CONFLICT (role, permission) DO NOTHING;

-- 設定用戶組擁有哪些角色
-- 照片提供部門是 FAB8F/TF/T_EQ2，所以他們以及上級一定可以看照片
insert into public.sys_usergroup(name, description, parent) values
('FAB8F/DF/D_EQ3', 'Heater/8F的照片提供者,所以可以看照片', 'FAB8F/DF'),
('FAB8F/DF/D_EQ2', 'Heater/8F的照片提供者,所以可以看照片', 'FAB8F/DF'),
('FAB8F/DF/D_EQ1', 'Heater/8F的照片提供者,所以可以看照片', 'FAB8F/DF'),
('FAB8F/DF', 'FAB8F/DF/D_EQ2的上級,所以可以看照片', 'FAB8F')
ON CONFLICT (name) DO NOTHING;

insert into public.sys_usergroup_permission(usergroup, permission) values
('FAB8F/DF/D_EQ3', 'album-heater/8F-R'),
('FAB8F/DF/D_EQ2', 'album-heater/8F-R'),
('FAB8F/DF/D_EQ1', 'album-heater/8F-R'),
('FAB8F/DF', 'album-heater/8F-R'),
('FAB8F', 'album-heater/8F-R'),
('IT/CIM8D/PI', 'album-heater/8F-R'),
('IT/CIM8F/PI', 'album-heater/8F-R'),
('FAB8F/FAB8F', 'album-heater/8F-R')
ON CONFLICT (usergroup, permission) DO NOTHING;


--####################
-- Wat Forecast 網頁
-- 只有指定的人或部門才能看
--####################
insert into public.sys_resource(id, name, owner, type) values
('route-icloud/wat_forecast-c366c99429d9', 'iCloud 的 Wat Forecast 頁面', 'system', 2)
ON CONFLICT (id) DO NOTHING;

-- 更新欄位
insert into public.sys_permission(name, description, resource, operation) values
('route-icloud/wat_forecast-R', '可檢視 iCloud 的 Wat Forecast 頁面', 'route-icloud/wat_forecast-c366c99429d9', 'read')
ON CONFLICT (name) DO UPDATE SET resource = excluded.resource;

insert into public.sys_role_permission(role, permission) values
('root', 'route-icloud/wat_forecast-R'),
('admin', 'route-icloud/wat_forecast-R')
ON CONFLICT (role, permission) DO NOTHING;

--? 此處添加哪些部門可以看 iCloud 的 Wat Forecast 頁面
-- 要先申請部門，然後再在這裡添加
--? 所有資料列最後都要加逗號，除了最後一個
insert into public.sys_usergroup(name, description, parent) values
('IT/CIM8F/PI', 'IT測試部門', 'IT/CIM8F'),
('IT/CIM8F/PA', 'IT測試部門', 'IT/CIM8F'),
('FAB8F/TF/PE3', 'IT測試部門', 'FAB8F/TF'),
('IT/CIM8F', 'IT測試部門', 'IT')
ON CONFLICT (name) DO NOTHING;

insert into public.sys_usergroup_permission(usergroup, permission) values
('IT/CIM8F/PI', 'route-icloud/wat_forecast-R'),
('IT/CIM8F/PA', 'route-icloud/wat_forecast-R'),
('FAB8F/TF/PE3', 'route-icloud/wat_forecast-R'),
('IT/CIM8F', 'route-icloud/wat_forecast-R')
ON CONFLICT (usergroup, permission) DO NOTHING;

--? 此處添加哪些人可以看 iCloud 的 Wat Forecast 頁面
--? 要先設定用戶，才能指定權限
--? 所有資料列最後都要加逗號，除了最後一個
insert into public.sys_user(id, name, dept1, dept2, dept3, email) values
('00025016', '鄭如凱', 'IT', 'CIM8D', '', '00025016@umc.com')
ON CONFLICT (id) DO NOTHING;

insert into public.sys_user_permission(user_id, permission) values
('00025016', 'route-icloud/wat_forecast-R')
ON CONFLICT (user_id, permission) DO NOTHING;


--####################
-- Powder/8F 相簿
--####################
insert into public.sys_resource(id, name, owner, type) values
('album-powder/8F-0b0199dfc760', 'Powder/8F相簿', 'system', 2)
ON CONFLICT (id) DO NOTHING;

-- 這個是指定 Powder/8F 會去讀取哪些部門的照片
insert into public.sys_resource_explorer(resource, target_type, target) values
('album-powder/8F-0b0199dfc760', 2, 'dep-FAB8F/TF/T_EQ1'),
('album-powder/8F-0b0199dfc760', 2, 'dep-FAB8F/TF/T_EQ2'),
('album-powder/8F-0b0199dfc760', 2, 'dep-FAB8F/TF/T_EQ3')
ON CONFLICT (resource, target_type, target) DO NOTHING;

insert into public.sys_permission(name, description, resource, operation) values
('album-powder/8F-R', '可讀取相簿Powder/8F的內容', 'album-powder/8F-0b0199dfc760', 'read')
ON CONFLICT (name) DO NOTHING;

insert into public.sys_role_permission(role, permission) values
('root', 'album-powder/8F-R'),
('admin', 'album-powder/8F-R')
ON CONFLICT (role, permission) DO NOTHING;

-- 設定用戶組擁有哪些角色
-- 照片提供部門是 FAB8F/TF/T_EQ2，所以他們以及上級一定可以看照片
insert into public.sys_usergroup(name, description, parent) values
('FAB8F/TF/T_EQ3', 'Powder/8F的照片提供者,所以可以看照片', 'FAB8F/TF'),
('FAB8F/TF/T_EQ2', 'Powder/8F的照片提供者,所以可以看照片', 'FAB8F/TF'),
('FAB8F/TF/T_EQ1', 'Powder/8F的照片提供者,所以可以看照片', 'FAB8F/TF'),
('FAB8F/TF', 'FAB8F/TF/T_EQ2的上級,所以可以看照片', 'FAB8F')
ON CONFLICT (name) DO NOTHING;

insert into public.sys_usergroup_permission(usergroup, permission) values
('FAB8F/TF/T_EQ3', 'album-powder/8F-R'),
('FAB8F/TF/T_EQ2', 'album-powder/8F-R'),
('FAB8F/TF/T_EQ1', 'album-powder/8F-R'),
('FAB8F/TF', 'album-powder/8F-R'),
('FAB8F', 'album-powder/8F-R'),
('IT/CIM8D/PI', 'album-powder/8F-R'),
('IT/CIM8F/PI', 'album-powder/8F-R'),
('FAB8F/FAB8F', 'album-powder/8F-R')
ON CONFLICT (usergroup, permission) DO NOTHING;


--####################
-- Mail Powder
-- 設定管理員是誰、哪些人不想收到信件、哪些人訂閱了Powder/8F
-- 因為管理員所有廠區都會收到信件，所以不用設定資源。
--####################
insert into public.sys_permission(name, description, resource, operation) values
('mail-powder/admin-R', '接收mail-powder發送的信件以及一張列出收件人的統計報表', NULL, 'read'),
('mail-powder/unsubscribe-X', '不想收到 mail-powder 寄給我的信件', NULL, NULL),
('mail-powder/8F-S', '標記用，讓網頁知道哪些人有訂閱這個項目。', 'album-powder/8F-0b0199dfc760', 'read')
ON CONFLICT (name) DO NOTHING;

insert into public.sys_user_permission(user_id, permission) values
('00025016', 'mail-powder/admin-R'),
('00025016', 'mail-powder/8F-S')
ON CONFLICT (user_id, permission) DO NOTHING;


--####################
-- Chat Ollama 網頁
-- 只有指定的人或部門才能看
--####################
insert into public.sys_resource(id, name, owner, type) values
('route-icloud/chat_ollama-ef1219a02c08', 'iCloud 的 Chat Ollama 頁面', 'system', 2)
ON CONFLICT (id) DO NOTHING;

insert into public.sys_permission(name, description, resource, operation) values
('route-icloud/chat_ollama-R', '可檢視 iCloud 的 Chat Ollama 頁面', 'route-icloud/chat_ollama-ef1219a02c08', 'read')
ON CONFLICT (name) DO NOTHING;

insert into public.sys_role_permission(role, permission) values
('root', 'route-icloud/chat_ollama-R'),
('admin', 'route-icloud/chat_ollama-R')
ON CONFLICT (role, permission) DO NOTHING;

--? 此處添加哪些部門可以看 iCloud 的 Chat Ollama 頁面
-- 要先申請部門，然後再在這裡添加
--? 所有資料列最後都要加逗號，除了最後一個
insert into public.sys_usergroup(name, description, parent) values
('FAB8F/LT', 'IT測試部門', 'FAB8F'),
('FAB8F/LT/L_EQ2', 'IT測試部門', 'FAB8F/LT'),
('IT/CIM8F', 'IT測試部門', 'IT')
ON CONFLICT (name) DO NOTHING;

insert into public.sys_usergroup_permission(usergroup, permission) values
('FAB8F/LT', 'route-icloud/chat_ollama-R'),
('FAB8F/LT/L_EQ2', 'route-icloud/chat_ollama-R'),
('IT/CIM8F', 'route-icloud/chat_ollama-R')
ON CONFLICT (usergroup, permission) DO NOTHING;

--? 此處添加哪些人可以看 iCloud 的 Chat Ollama 頁面
--? 要先設定用戶，才能指定權限
--? 所有資料列最後都要加逗號，除了最後一個
insert into public.sys_user(id, name, dept1, dept2, dept3, email) values
('00025016', '鄭如凱', 'IT', 'CIM8D', '', '00025016@umc.com')
ON CONFLICT (id) DO NOTHING;

insert into public.sys_user_permission(user_id, permission) values
('00025016', 'route-icloud/chat_ollama-R')
ON CONFLICT (user_id, permission) DO NOTHING;


--####################
-- Mail Weather Forecast
-- 設定管理員是誰、哪些人不想收到信件、哪些人訂閱了氣壓預報
-- 因為管理員所有廠區都會收到信件，所以不用設定資源。
--####################
insert into public.sys_permission(name, description, resource, operation) values
('mail-wf/admin-R', '接收mail-wf發送的信件以及一張列出收件人的統計報表', NULL, 'read'),
('mail-wf/unsubscribe-X', '不想收到 mail-wf 寄給我的信件', NULL, NULL),
('mail-wf/Hsinchu-S', '標記用，讓系統知道哪些人有訂閱這個項目。', NULL, 'read'),
('mail-wf/Tainan-S', '標記用，讓系統知道哪些人有訂閱這個項目。', NULL, 'read')
ON CONFLICT (name) DO NOTHING;

insert into public.sys_usergroup_permission(usergroup, permission) values
('IT/CIM8D/PI', 'mail-wf/Hsinchu-S'),
('IT/CIM8D/PI', 'mail-wf/Tainan-S')
ON CONFLICT (usergroup, permission) DO NOTHING;

insert into public.sys_user(id, name, dept1, dept2, dept3, email) values
('00034125', '', '', '', '', '00034125@umc.com'),
('00036334', '', '', '', '', '00036334@umc.com'),
('00022911', '', '', '', '', '00022911@umc.com'),
('00054055', '', '', '', '', '00054055@umc.com'),
('00024994', '', '', '', '', '00024994@umc.com')
ON CONFLICT (id) DO NOTHING;

insert into public.sys_user_permission(user_id, permission) values
('00025016', 'mail-wf/admin-R'),
('00025016', 'mail-wf/Hsinchu-S'),
('00025016', 'mail-wf/Tainan-S'),
('00034125', 'mail-wf/Hsinchu-S'),
('00034125', 'mail-wf/Tainan-S'),
('00036334', 'mail-wf/Hsinchu-S'),
('00036334', 'mail-wf/Tainan-S'),
('00022911', 'mail-wf/Hsinchu-S'),
('00022911', 'mail-wf/Tainan-S'),
('00054055', 'mail-wf/Hsinchu-S'),
('00054055', 'mail-wf/Tainan-S'),
('00024994', 'mail-wf/Hsinchu-S'),
('00024994', 'mail-wf/Tainan-S')
ON CONFLICT (user_id, permission) DO NOTHING;