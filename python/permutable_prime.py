"""
Permutable Prime

A permutable prime is a prime number of two or more digits that remains prime with every possible rearrangement of the digits.

For example:

Input: 79
Output: true (79 and 97 are both primes)

Input: 127
Output: false

Input: 337
Output: true (337, 373 and 733 are primes)

Write a program to check if the user input is a permutable prime or not.

Bonus: Print all the permutable primes in a given range.
"""
from itertools import permutations

def is_prime(x):
	if x > 1:
		for i in range(2,int(x / 2) + 1):
			if x % i == 0:
				return False
		return True
	return False

def is_permutable_Prime(x):
	if x > 9:
		if is_prime(x):
			for p in set(''.join(i) for i in permutations(str(x))):
				if str(x) != p:
					if not is_prime(int(p)):
						return False
			return True
	return False

try:
	for i in range(int(input())):
		if is_permutable_Prime(i):
			print(i)
except Exception as e:
	print(e)
	
input("\nPress any key to exit...")
