# 公式
```mysql
SELECT [ALL|DISTINCT] <目标列表达式> [,<目标列表达式>]...
FROM <表名或视图名> [,<表名或视图名> ...] [AS] <别名>
[WHERE <条件表达式>]
[GROUP BY <列名1> [HAVING <条件表达式>]]
[GROUP BY <列名2> [ASC|DESC]]
```
> `[XXX]`代表可能存在


# 实践

```mysql
# 查询
SELECT * FROM table_name; # 查询所有数据
SELECT column_name1, column_name2 FROM table_name; # 查询多列数据
SELECT DISTINCT column_name1, column_name2, ... FROM table_name; # 查询并去重

# 查询，带算术表达式
SELECT name, 2014-age FROM Student  # `2022-age`为算术表达式：用当前年份减去学生年龄
SELECT name, 2014-age birthday FROM Student  # `2014-age birthday`为算术表达式：且将该列命名为birthday
SELECT name, LOWER(dept) FROM Student  # `LOWER(dept)`为算术表达式：将dept值全部转换为小写

# 带条件的查询
SELECT col1, col2 FROM table_name WHERE id>=10 AND name='sam';  # 查询表中 id>=10 && name=sam 的col1和col2数据
SELECT col1, col2 FROM table_name WHERE id!=10 OR name='sam';   # 查询表中 id!=10 || name=sam 的col1和col2数据
SELECT col1, col2 FROM table_name WHERE id IN (1,2,3,10);       # IN：把id为1或2或3或10的数据查出来 
SELECT col1, col2 FROM table_name WHERE id NOT IN (1,2,3,10);   # NOT IN：把id不为1或2或3或10的数据查出来
SELECT col1, col2 FROM table_name WHERE id BETWEEN 1 AND 4;     # BETWEEN AND：把id在[1,4]闭区间的数据查出来 
SELECT col1, col2 FROM table_name WHERE id NOT BETWEEN 1 AND 4; # NOT BETWEEN AND：把id在[1,4]闭区间意外的数据查出来
SELECT col1, col2 FROM table_name WHERE name LIKE "王%";   # %代表任意长度的字符串：把name中 姓王 的数据查出来
SELECT col1, col2 FROM table_name WHERE name LIKE "欧阳_"; # _代表任意单个字符串：  把name中 姓欧阳 且全名为3个字的数据查出来
SELECT col1, col2 FROM table_name WHERE name LIKE "_阳%";  # 把name中第二个字是 阳 的数据查出来
SELECT col1, col2 FROM table_name WHERE name IS NULL;      # IS NULL：把name是空值的数据查出来
SELECT col1, col2 FROM table_name WHERE name IS NOT NULL;  # IS NOT NULL：把name不是空值的数据查出来

# 查询并排序：ASC升序(默认)、DESC降序
SELECT col1, col2 FROM table_name ORDER BY col_name DESC;             # 按照col_name降序排列
SELECT col1, col2 FROM table_name ORDER BY col_name1, col_name2 DESC; # 先col_name1按升序排列；遇到col_name1相同的数据，再按col_name2降序排列

# 限制条数的查询
SELECT col1, col2 FROM table_name LIMIT 2; # 表示只取前两条
SELECT col1, col2 FROM table_name LIMIT m, n; # 表示取m后的n条

# 条件句中用到子句，子句中又用到条件句
SELECT * FROM table_name1 WHERE id IN (SELECT id FROM table_name2 WHERE id....) 
```
