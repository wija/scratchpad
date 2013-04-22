/*
	lazySets.js

	(with Zach Allaun)

	Lazily iterates over sets and the unions and intersections thereof.

	The results are not only delivered but also calculated in a lazy fashion.  As arrays are passed by
	reference in JavaScript, the creation of a set iterator is cheap.

	All of these functions must be passed arrays that are ****sorted in ascending order*****.
	If you pass them unsorted arrays, the results will be meaningless. 

> foo = getSetIterator([1,2])
> foo()  //1
> foo()  //2
> foo()  //[]

> foo = getSetIterator(iterIntersection(iterIntersection([1,2,3],[1,2,3,4],[2,3,5,6,7,8]),iterUnion([1,2,3],[1,2,3,4],[2,3,5,6,7,8])))
> foo()  //2
> foo()  //3
> foo()  //[]

> foo = getSetIterator(iterIntersection([1,2,3],[1,2,3,4],[2,3,5,6,7,8]))
> foo()  //2
> foo()  //3
> foo()  //[]

> foo = getSetIterator(iterUnion([1,2,6],[1,2,5],[3,4],[],[3]))
> foo()  //1
> foo()  //2
> foo()  //3
> foo()  //4
> foo()  //5
> foo()  //6
> foo()  //[]

But note:

> foo = getSetIterator([1,2])
> bar = iterUnion(foo, [3,4])  //Error: function passed to __iterSet....

*/

!function(scope) {

	function getSetIterator(iterSetObj) {
		var obj = __iterSet(iterSetObj);
		return obj.get.bind(obj);
	}

	//IterSet

	function __iterSet(sArrOrIterSet) {
		if(typeof sArrOrIterSet === "function") {
			throw new Error("function passed to __iterSet. Most likely, you passed an earlier result of " +
				  "getSetIterator as part of a subsequent call to getSetIterator, iterIntersection, or " +
				  "iterUnion.");
		}
		if(sArrOrIterSet.isIterSet) {
			return sArrOrIterSet;
		} else {
			var obj = new __IterSet(sArrOrIterSet);
			return obj;
		}
	}

	//the array passed must be sorted in ascending order
	function __IterSet(sArr) {

		this.isIterSet = true;

		this.sArr = sArr;
		this.i = 0;
		this.len = sArr.length;
		return this;
	}

	__IterSet.prototype.get = function() {
		if(this.i === this.len) {
			return [];
		} else {
			this.i++;
			return this.sArr[this.i - 1];
		}
	}

	__IterSet.prototype.emptyp = function() {
		return this.i === this.len;
	}	

	//iterIntersection

	function iterIntersection() {
		var arrOfSetsOrIterSets = [].slice.call(arguments);
		return arrOfSetsOrIterSets.map(__iterSet).reduce(createObjCreator(__IterIntersection2));
		//return iterSetObj.get.bind(iterSetObj);
	}

	//the arrays passed must be sorted in ascending order
	function __IterIntersection2(iter1, iter2) {

		this.isIterSet = true;

		this.iter1 = iter1;
		this.iter2 = iter2;
		this.v1 = this.iter1.get();
		this.v2 = this.iter2.get();

		return this;
	}

	__IterIntersection2.prototype.get = function() {
		
		var result;

		while(!(this.v1.length === 0 || this.v2.length === 0)) {
			if(this.v1 === this.v2) {
				result = this.v1;
				this.v1 = this.iter1.get();
				this.v2 = this.iter2.get();
				return result;
			} else if(this.v1 < this.v2) {
				this.v1 = this.iter1.get();
			} else {
				this.v2 = this.iter2.get();
			}
		}

		return []; 
	}

	//iterUnion

	function iterUnion() {
		var arrOfSetsOrIterSets = [].slice.call(arguments);
		return arrOfSetsOrIterSets.map(__iterSet).reduce(createObjCreator(__IterUnion2));
		//return iterSetObj.get.bind(iterSetObj);
	}

	function __IterUnion2(iter1, iter2) {
		
			this.isIterSet = true;

			this.iter1 = arguments[0];
			this.iter2 = arguments[1];
			this.v1 = this.iter1.get();
			this.v2 = this.iter2.get();
		
			return this;
	}

	__IterUnion2.prototype.get = function() {

		var result = [];

		if(this.v1.length !== 0 && this.v2.length !== 0) {
			if(this.v1 === this.v2) {
				result = this.v1;
				this.v1 = this.iter1.get(); 
				this.v2 = this.iter2.get();
				return result;
			} else if(this.v1 < this.v2) {
				result = this.v1;
				this.v1 = this.iter1.get();
				return result;
			} else { // this.v1 > this.v2
				result = this.v2;
				this.v2 = this.iter2.get();	
				return result;
			}

		}

		if(this.v2.length !== 0) {
			result = this.v2;
			this.v2 = this.iter2.get(); 
			return result; 
		}
			
		if(this.v1.length !== 0) {
			result = this.v1;
			this.v1 = this.iter1.get(); 
			return result; 
		}

		return []; 
	}

	//utils

	function createObjCreator(constructor) { 
		return function() { 
			var obj = Object.create(constructor.prototype); 
			constructor.apply(obj, arguments); 
			return obj; 
		} 
	}

	//function cloneObj(obj) {
    //	var constructor = function(){};
    //	constructor.prototype = obj;
    //	return new constructor();    
 	//}

 	scope.__iterSet = __iterSet;  //I WASN'T INTENDING TO DO THIS BEFORE

 	scope.getSetIterator = getSetIterator;
	scope.iterUnion = iterUnion;
	scope.iterIntersection = iterIntersection;

}(window);


