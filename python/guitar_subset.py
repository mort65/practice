"""
Guitar Subset

For a list of integers S and a target number G, a subset of S that adds up to G is called a guitar subset. 

For example:

Input: 
24
[12, 1, 61, 5, 9, 2]
Output: 
[12, 9, 2, 1]
(G=24, S=[12, 1, 61, 5, 9, 2], there is a guitar subset [12, 9, 2, 1] that adds up to 24).

Integers can appear more than once in the list. You may assume all numbers in the list are positive. 

Write a program to check if the user input has a guitar subset for the specified number G or not (both the list of integers and the number G are input parameters).
"""
from itertools import combinations
from re import match

def guitar(g,s):
	l = sorted([ c for c in s if c <= g ],reverse=True)
	f = 0
	if sum(l) < g or g < l[-1]:
		return None
	elif sum(l) == g:
		return l
	for i in range(1, len(l) + 1):
		if i == len(l):
			f = 1
		for n in combinations(l,i):
			if sum(n) == g:
				return list(n)
			if f == 1:
				return None
	return None

def process_input():
	err1 = "Invalid input: Please write a positive integer or a positive integer and a list of positive integers that are separated by space or comma like: '4 [1 2 3]'."
	err2 = "Invalid input: Please write a list of positive integers that are separated by space or comma like: \'1 2 3\'."
	try:
		inp = input("Please write the target number or both the target and the list like '4 [1 2 3]':\n").replace(',',' ')
		m1 = match(r'^\s*?(\d+)\s*?([\{\(\[])([\s*?\d+\s*?]+)([\}\)\]])\s*?$',inp)
		if m1 and ((m1.group(2) == m1.group(4) != None) or ((m1.group(2) + m1.group(4)) in ('{}','()','[]'))):
			try:
				target = int(m1.group(1))
				subset = [int(num) for num in m1.group(3).split()]
			except ValueError:
				print(err1)
				return
		else:
			try:
				m1 = match(r'^\s*?([\{\(\[])?(\s*?\d+\s*?)([\}\)\]])?\s*?$',inp)
				if m1 and ((m1.group(1) == m1.group(3) == None) or \
				( not(m1.group(1)) and not(m1.group(3)) and \
				(m1.group(1) + m1.group(3)) in ('{}','()','[]'))):
					target = int(m1.group(2))
				else: raise ValueError
			except ValueError:
				print(err1)
				return
			try:
				inp = input("Please write a list of positive integers:\n").replace(',',' ')
				m2 = match(r'^\s*?([\{\(\[])?([\s*?\d+\s*]+)([\}\)\]])*\s*?$',inp)
				if m2 and ((m2.group(1) == m2.group(3) == None) or (m2.group(1) + m2.group(3)) in ('{}','()','[]')):
					subset = [int(num) for num in m2.group(2).split()]
				else: raise ValueError
			except ValueError:
				print(err2)
				return
		result = guitar(target,subset)
		if result:
			print("\n{0}\n(G={1}, S={2}, there is a guitar subset {3} that adds up to {4}).".format(result,target,subset,result,target))
		else:
			print("\n(G={0}, S={1}, there is no guitar subset that adds up to {2}.".format(target,subset,target))
	except Exception as e:
		print(e)
		return
		
process_input()

input("\nPress enter to exit...")

		
		
			
			
			
		
	
