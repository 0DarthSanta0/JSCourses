const mas1 = [-2,1,-3,4,-1,2,1,-5,4];
const mas2 = [-2, -1, -3, -2, -10, 1, -1, 0];
const mas3 = [-1, -2];


function findMaxSubString (mas) {
    let temp = mas[0];
    let sum = temp;
    for (let i = 0; i < mas.length; ++i) {
        temp += mas[i];
        if(temp < 0) {
            temp = 0;
            continue;
        }
        if (temp > sum) {
            sum = temp;
        }
    }
    if (sum < 0) {
        return Math.max.apply(null, mas)
    }
    return sum;
}

console.log(findMaxSubString(mas1));
console.log(findMaxSubString(mas2));
console.log(findMaxSubString(mas3));