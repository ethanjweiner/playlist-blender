// powerSet : [List-of Tracks] -> [List-of [List-of Tracks]]
// Produces all the possible subsets of _array_
function powerSet(array) {
	let subsets = [[]];
  for (let i = 0; i < array.length; i++) {
  	const lengthSoFar = subsets.length;
    // Iterate over every result, to add on the current array[i] to every subset
    for (var x = 0; x < lengthSoFar; x++) {
    	subsets.push(subsets[x].concat(array[i]));
    }
  }
  return subsets;
}

// subsets : [List-of Tracks] Number -> [List-of [List-of Tracks]]
// Produces all the subsets of _array_ of size _size_
function subsets(array, size) {
	return powerSet(array).filter(subset => subset.length === size);
}

// product : {X, Y} [List-of X] [List-of Y] -> [List-of [X Y]];
// Take the product of two arrays, _a_ and _b_
let product = (a, b) => [].concat(...a.map(A => b.map(B => [].concat(A, B))));

// Termination : One less argument is added each time (product: 2 arrays -> 1 array)
// cartesian : Generates the Cartesian product
let cartesian = (a, b, ...c) =>
  b ? 
  cartesian(product(a, b), ...c) : // Find the cartesian of the product of the first two arrays & the rest of the array
  a; // Once only one array exists, that is the final cartesian product

export { cartesian, subsets };