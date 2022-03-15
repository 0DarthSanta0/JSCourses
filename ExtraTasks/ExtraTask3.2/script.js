const mas1 = [7,1,5,3,6,4];
const mas2 = [1,2,3,4,5];
const mas3 = [7,6,4,3,1];
const mas4 = [1];
const mas5 = [1,2];

function prices(mas) {
    let dp = [];
    dp[0] = 0;
    for (let i = 1; i <= mas.length; ++i) {
        let temp = 0;
        let max = 0;
        for (let j = 1; j <= i; ++j) {
            temp = mas[i-1] - mas[j-1] + dp[j-1];
            max = Math.max(temp, max);
        }
        dp[i] = max;
    }
    return dp[mas.length];
}

console.log(prices(mas1));
console.log(prices(mas2));
console.log(prices(mas3));
console.log(prices(mas4));
console.log(prices(mas5));