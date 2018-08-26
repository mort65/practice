"""
Goldbach's conjecture is a rule in math that states the following: every even number greater than 2 can be expressed as the sum of two prime numbers. 
Write a program that finds every possible pair of prime numbers, whose sum equals the given number or a set of numbers within a range.

For example:

Input: 16
Output:
3 + 13
5 + 11

Input: 32
Output: 
3 + 29
13 + 19

Input: 4, 8
Output: 
4: 2 + 2  
6: 3 + 3  
8: 3 + 5
"""
primes=[]

def is_prime(n):
	if n > 1:
		for i in range(2,int(n / 2) + 1):
			if n % i == 0:
				return False
		return True
	return False
	
def get_primes(n):
	for i in range(n):
		if is_prime(i):
			primes.append(i)
	return primes
	
def goldbach_conjecture(n):
	pairs = []
	for i in primes:
		for j in primes:
			if not(((i,j) in pairs) or ((j,i) in pairs)) :
				if (i + j) == n:
					pairs.append((i,j))
	return pairs
						
input_number = input("Write an even number or a range like 10,20:\n")
input_range = input_number.split(',')
input_err = "Invalid input: Please enter an even number or two numbers seperated by a comma"

try:
	if len(input_range) == 2:
		try:
			min = int(input_range[0])
			max = int(input_range[1]) + 1
		except ValueError:
			print(input_err)
			input("\nPress any key to exit...")
			exit(1)
		if min >= max:
			min,max = max - 1,min + 1
		if (min % 2) != 0:
			min += 1
		if (max % 2) == 0:
			max -= 1
		get_primes(max-2)
		for i in range(min,max,2):
			for result in goldbach_conjecture(i):
				print(str(i) + " : " + str(result[0]) + " + " + str(result[1]))
	elif len(input_range) == 1:
		try:
			num = int(input_number)
			if ( num % 2 ) != 0:
				raise ValueError(input_err)
				input("\nPress any key to exit...")
				exit(1)
		except ValueError:
			print(input_err)
			input("\nPress any key to exit...")
			exit(1)
		get_primes(num-1)
		for result in goldbach_conjecture(num):
			print(str(result[0]) + " + " + str(result[1]))
	else:
		print(input_err)
		input("\nPress any key to exit...")
		exit(1)
except Exception as err:
	print(err)
					
input("\nPress any key to exit...")


