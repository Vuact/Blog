### 操作符

- 一元操作符：++、 --、 +、 -     				 //隐式调用Nubmer()
- 位操作符：~、&、|、^、<<、>>、>>>				 //隐式调用Nubmer()
- 布尔操作符：!、&&、||      					 //隐式调用Boolean()
- 算术运算符：+、-、*、/、%						 ///隐式调用Nubmer()
- 关系运算符：<、>、<=、>=、==、!=、	 		 //隐式调用Nubmer()
			  ===、!===  //直接比较，不转化
- 其他运算符：?：、void（作用）、typeof、 delete、   ···

****************************************************** 布尔操作符 ****************************************************** Boolean()
//***** （1）! : 返回 true/fasle
	console.log(!"");		//true
	console.log(!"123");	//false
	console.log(!123);		//false
	console.log(!NaN);		//true

//***** （2）&& : 第一个为真，则返回第二个；第一个为假，则返回第一个
	console.log("null" && "true"); 		//'true'
	console.log("null" && true);   		//true
	console.log(true && 'null');   		//"null"
	console.log(null && true);	   		//null
	console.log(true && null);			//null
	console.log(true && "undefined");   //'undefined'
	console.log(true && undefined);		//undefined
	console.log(new Boolean(false) && true); //true

//***** （3）|| : 第一个为真，则返回第一个；第一个为假，则返回第二个
	console.log("null" || 'true');		//'null'
	console.log('null' || true);		//'null'
	console.log(true || 'null');		//true
	console.log(null || true);			//true
	console.log(null || "true");		//"true"
	console.log(false || null);			//null
	console.log(null || false);			//false

****************************************************** 算术运算符、关系运算符 ******************************************************  Nubmer()
2 + 3;//5
2 - 3;//-1
'2' + 3;//23
'2' - 3;//-1
'2' + (3 + 1);//24
'2' + '2' //22
'2' > '10';//true
'2' > 10;//false
"x" < 1    //NaN //"x被转换为NaN"
[] == 0 //true     [].valueOf() --> [].valueOf().toString() --> Nubmer([].valueOf().toString())
[] === 0 //false
+[] === 0 //true
{} === 0 //false
{} == 0  //fasle 

//对象是否相等：看的是 是否为同一个引用
[] === [] //false
var a = [];
var b = a;
a === b;//true

****************************************************** 其他运算符 ******************************************************
//***** （1）?:来简化代码  //隐式调用Nubmer()
	var toggle = 'ok';  
	var val = '';
	if(toggle){
		val = "I'm Ok";
	}else{
		val = "err"
	}
	console.log(val); //"I'm Ok"

	//简化为
		var toggle = 'ok';  
		var val = toggle ? "I'm Ok" : "err";
		console.log(val); //"I'm Ok"

//***** （2）void
	function foo(){
		var undefined = 'hello',
			f = {},
			window = {undefined:'feidian'};
		console.log(undefined);				//'hello'
		console.log(window.undefined);		//'feidian'
		console.log(f.a === undefined);		//false
		console.log(f.a === void 0);		//true
	}
	foo();





2 << 1 //4
2 << 2 //8 
2 >> 1 //1
