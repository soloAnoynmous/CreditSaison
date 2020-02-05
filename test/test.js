const assert = require('chai').assert;

var findAllSubsets = require('../routes/calculation.js');

describe('calculation.js', function(){
	it('return 15', function(){
		const result = findAllSubsets("akshay",2);
		console.log(result);
		assert.equal(15, result)
	});
});

describe('calculation.js', function(){
	it('return 0 as n < k', function(){
		const result = findAllSubsets("akshay",8);
		console.log(result);
		assert.equal(0, result)
	});
});

describe('calculation.js', function(){
	it('return 0  when string is empty', function(){
		const result = findAllSubsets("",2);
		console.log(result);
		assert.equal(0, result)
	});
});

describe('calculation.js', function(){
	it('return 21', function(){
		const result = findAllSubsets("shubham",2);
		console.log(result);
		assert.equal(21, result)
	});
});

describe('calculation.js', function(){
	it('return 6', function(){
		const result = findAllSubsets("aaaa",2);
		console.log(result);
		assert.equal(6, result)
	});
});

describe('calculation.js', function(){
	it('when n=k', function(){
		const result = findAllSubsets("aaaa",4);
		console.log(result);
		assert.equal(1, result)
	});
});

describe('calculation.js', function(){
	it('when n=k', function(){
		const result = findAllSubsets("akshayakshayakshayakshayakshayakshay",16;
		console.log(result);
		assert.equal(1, result)
	});
});
