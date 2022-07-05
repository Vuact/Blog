git_branch_name=`git branch | grep "*"`
git_branch_name="${git_branch_name/* /}"
git pull origin ${git_branch_name}

git add .
git commit -m "$1"

if [ "$?" == '1' ] 
then
   git reset HEAD .
   echo "提交失败 (⇀‸↼‶)"
   exit 0
fi

git push origin ${git_branch_name}

echo "提交成功 (*^▽^*)"