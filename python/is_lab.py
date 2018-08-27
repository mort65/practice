"""
A lab number is a number such that the square of any of its prime divisors is still one of its divisors.
For example:
Input: 8Output: true (2 is a prime divisor of 8, and 2x2=4 is also a divisor of 8)
Input: 50Output: true (5 is a prime divisor of 50, and 5x5=25 is also a divisor of 50)
Write a program to check if the user input is a Lab number or not.
Bonus: Print all the Lab numbers in a given range.
"""

def isprime(x):
  for i in range(2,int(x/2)+1):
    if x % i == 0:
      return False
  return True
      
def islab(x):
  c = 0
  for i in range(2,int(x / 2) + 1):
    if (x % i) == 0:
      if isprime(i):
        if (x % (i ** 2)) != 0:
          return False
        else:
          c += 1
  if c > 0:
    return True
  else:
    return False

for i in range(2,101):
  if islab(i):
    print(str(i) + " : True")
    
input("\nPress any key to exit...")


