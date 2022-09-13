### 创建数据库(database)

```mysql
CREATE DARABASE database_name; 
# database_name为数据库名
```

### 删除数据库

```mysql
DROP DARABASE database_name;
```

### 进入数据库

```mysql
use database_name;
```

### 查看表格

```mysql
show tables;
```

### 创建表（table）

```mysql
CREATE TABLE table_name(
   col_name1 datatype,
   col_name2 datatype
)  # col_namen为列名，datatype为数据类型
```
例子：
```mysql
CREATE TABLE table_name(
  `id` INT AUTO_INCREMENT NOT NULL, # 第一列数字自增，不用自己插入
  `id_num` VARCHAR(255) NOT NULL, # VARCHAR类型最大长度255；不能为空
  `name` VARCHAR(250) NOT NULL, # VARCHAR类型最大长度250；不能为空
  `age` INT NOT NULL DEFAULT 0, # INT类型，不能为空，默认值为0
  `action` DATETIME VARCHAR(255) NULL,  # VARCHAR类型最大长度255；可为空
  `create_time` DATETIME NOT NULL DEFAULT 0000-00-00 00:00:00, # DATETIME类型，不能为空，默认值为 0000-00-00 00:00:00
   CONSTRAINT `PRIMARY` PRIMARY KEY (`id`), # 将id设置为主键
   CONSTRAINT `unique_id_num` UNIQUE (`id_num`) # 将id_num设置为约束字段，约束名为unique_id_num
);
```
