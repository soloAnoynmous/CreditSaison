/**
* The function takes an input string and a number k.
*
* Given a string input and a size k, find the possible 
* number of subsets of size k
*/

function findAllSubsets(input, k) {
  input = input.trim();
  if(!input)return 0;

  n = input.length;

  // if input is of length 0 or k > n
  if(n == 0 || k>n || k<0){
    return 0;
  }

  let dp = new Array(n+1).fill(-1).map(_ => new Array(k+1).fill(-1));
  for(let i = 0; i <=n; i++) {
    for(let j = 0; j <= min(i,k); j++) {
      if(j==0 || j==i){
        dp[i][j]=1;
      }else{
        dp[i][j] = dp[i-1][j-1] + dp[i-1][j];
      }
    }
  }
  return dp[n][k];
}

function min(a,b){
  return (a<b)?a:b;
}

module.exports = findAllSubsets;
