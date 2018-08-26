"a permutable prime is a prime number of two or more digits that remain prime with every possible rearrangement of the digits"

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
