### 修改表名
```mysql
ALTER TABLE old_table_name RENAME new_table_name;
RENAME TABLE old_table_name TO new_table_name;
# 上面两句都可以修改表名字
```

### 修改列名
```mysql
ALTER TABLE table_name CHANGE old_col_name new_col_name datatype; 
# datatype 为数据类型，VARCHAR等；datatype可以保持原来的，也可以改成新的
```

### 修改列的数据类型或长度
```mysql
ALTER TABLE table_name MODIFY COLUMN col_name datatype;
# datatype 为数据类型

# 修改数据长度，例: 将col_name字段，长度改为500
ALTER TABLE table_name MODIFY COLUMN col_name VARCHAR(500); 
```

### 修改列的位置
```mysql
ALTER TABLE table_name MODIFY col_name datatype FIRST; # 把某一列调到第一列
ALTER TABLE table_name MODIFY col_name datatype AFTER another_col_name; # 把一列调到另外一列的后边
# 上面两句的datatype都可以保持原来的，或者改成新的
```

### 修改UNIQUE KEY约束
分两步：① 清除原先的unique约束  ② 添加新的unique约束

```mysql
ALTER TABLE table_name DROP INDEX uk_name;  # un_name是要清除的unique约束的名字
ALTER TABLE table_name ADD UNIQUE KEY new_uk_name (col1, col2, ...);   # new_uk_name是新的约束的名字；
# new_uk_name和un_name可以一样
```
### 修改主键
分两步：先删除旧的主键，再添加新的主键

```mysql
ALTER TABLE table_name DROP PRIMARY KEY;
ALTER TABLE table_name ADD PRIMARY KEY (col_name);
```

### 修改外键
```mysql
ALTER TABLE table_name DROP FOREIGN KEY fk_name; 
# 上一句只会删除外键约束，但是外键的索引没有删除，利用show create table table_name \G;发现外键的名称还在，但是约束没了

ALTER TABLE table_name DROP INDEX fk_name;  # 此句是为了删除外键索引

ALTER TABLE table1 ADD 
CONSTRAINT fk_name foreign key (table1_col) 
REFERENCES table2(table2_col); # 添加外键
```

### 修改null和not null

```mysql
ALTER TABLE table_name MODIFY col_name datatype NOT NULL;  # 把原来NULL的修改为NOT NULL;
ALTER TABLE table_name MODIFY col_name datatype NULL;  # 把原来NOT NULL的修改为NULL;
# datatype 为数据类型
```

### 修改默认值

```mysql
ALTER TABLE table_name ALTER col_name SET DEFAULT new_value; # 把某列的default值修改为new_value
```

### 更新数据

```mysql
UPDATE table_name SET col1=value1, col2=value2, ... WHERE condition;

# 例: 将test表中，id等于123的项中的a字段值改为XX
UPDATE `test` SET a="XX" where id=123;
```

### 备份并删除表
```mysql
# 备份旧表
CREATE TABLE new_table_name SELECT * FROM old_table_name;

# 删除旧表
DROP TABLE old_table_name;
```

### 删除数据
```mysql
# 删除某条数据
DELETE FROM table_name WHERE condition; 

# 删除某列字段
ALTER TABLE table_name DROP col_name; 
```
