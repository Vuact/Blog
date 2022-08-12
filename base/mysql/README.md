```shell
# 更新某表中的某字段：将test表中，id等于123的项中的a字段值改为XX
UPDATE `test` SET a="XX" where id=123;

# 将Address表的test字段，长度改为500
ALTER TABLE `Address` MODIFY COLUMN `test` VARCHAR(500);

# 删除某表中的一项
DELETE FROM `表名` WHERE 字段名=值;

# 删除某个表
DROP table `表名`;
```
