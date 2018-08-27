"""
A Voodoo prime is a prime number whose reciprocal (in decimal) has the same number in its digits. For example, 7 is a voodoo prime because its reciprocal 1/7=0.14285714285 contains 7.
Examples:Input: 3Output: true (1/3=0.33333333333 contains 3)
Input: 11Output: false (1/11=0.0909090909 doesn't contain 11)
Write a program to check if the user input is a Voodoo prime or not.
Bonus: Print all the Voodoo primes in a given range.
"""

def is_prime(x):
  if x > 1:
    for i in range(2,int(x/2)+1):
      if x % i == 0:
        return False
    return True
  return False

def is_voodoo(x):
  if is_prime(x):
    return (str(x) in str(1/x))
  return False

try:
  for i in range(int(input())):
    if is_voodoo(i):
      print(str(i) + " : " + str(1/i))
except Exception as e:
  print(e)

input("\nPress any key to exit...")
