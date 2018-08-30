"""
Mersenne Prime

A Mersenne prime is a prime number that is one less than a power of two. It is a prime number of the form 2^n − 1 for some integer n.

For example:

Input: 3
Output: true (3 is a prime number and 3=2^2-1)

Input: 31
Output: true (31 is a prime number and 31=2^5-1)

Input: 17
Output: false (17 is a prime number but it is not of the form 2^n-1)

Write a program to check if the user input is a Mersenne prime or not.

Bonus: Print all the Mersenne primes in a given range.
"""
def isprime(x):
  if x > 1:
    for i in range(2,int(x/2)+1):
      if x % i == 0:
        return False
    return True
  return False
  
def ispower(x,y):
	if x >= -1 or y <= 1:
		if y in (0,1):
			return x == y
		elif y == -1:
			return x in (-1,1)
		while x % y == 0:
			x /= y
			if x == y:
				return True
	return False

def ismersenne(x):
	return isprime(x) and ispower(x+1, 2)
	
try:
    num = int(input())
    if ismersenne(num):
        print("{0} is a mersenne prime.".format(num))
    else:
        print("{0} is not a mersenne prime.".format(num))
    print("\nMersenne primes in the range of [{0},{1}):\n".format(1,num))
    for i in range(1,num):
        if ismersenne(i):
            print(i)
except ValueError:
    print("Please write an integer.")
except Exception as e:
    print(e)
	
input("\nPress enter to exit...")
	
	