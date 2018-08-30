'''
Howling Primes

A howling prime is a prime number if the sum of its digits is also a prime number.

For Example:

Input:113
Output: true (113 is a prime number, 1+1+3=5 is also a prime number)

Input: 89
Output: true (89 is a prime number, 8+9=17 is also a prime number)

Input: 19 
Output: false (19 is a prime number, but 1+9=10 is not a prime number)

Write a program to check if the user input is a howling prime or not.

BONUS: Print all the howling prime numbers in a given range.
'''
def isprime(x):
  if x > 1:
    for i in range(2,int(x/2)+1):
      if x % i == 0:
        return False
    return True
  return False

def ishowling(x):
  return isprime(x) and isprime(sum([int(i) for i in str(x)]))

try:
  num = int(input())
  if ishowling(num):
    print("{0} is a howling prime.".format(num))
  else:
    print("{0} is not a howling prime.".format(num))
  print("\nHowling primes in the range of [{0},{1}):\n".format(2,num))
  for i in range(2,num):
    if ishowling(i):
      print(i)
except ValueError:
  print("Invalid input: Please write an integer.")
except Exception as e:
  print(e)
	
input("\nPress enter to exit...")
