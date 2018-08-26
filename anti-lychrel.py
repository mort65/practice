"""
An anti-Lychrel number is a number that forms a palindrome through the iterative process of repeatedly reversing its digits and adding the resulting numbers. For example, 56 becomes palindromic after one iteration: 56+65=121. If the number doesn't become palindromic after 30 iterations, then it is not an anti-Lychrel number.

Examples:
Input: 12
Output: true (12 + 21 = 33, a palindrome)

Input: 57
Output: true (57 + 75 = 132, 132 + 231 = 363, a palindrome)

Input: 10911
Output: false (10911 takes 55 iterations to reach a palindrome)

Write a program to check if the user input is an anti-Lychrel number or not.

Bonus: Print all anti-Lychrell numbers in a given range.
"""
def revint(n):
	n = str(n)
	r=''
	for i in range(len(n)-1,-1,-1):
		r += n[i]
	return int(r)

def is_palindrome(n):
	return (n == revint(n))

def get_antilychrel(n):
	c = 0
	while(c < 30):
		c += 1
		n += revint(n)
		if is_palindrome(n):
			return (True,(c,n,))
	return (False,(c,n,))

input_number = input("Write a number or a range like 10,20:\n")
input_range = input_number.split(',')
input_err = "Invalid input: Please enter one integer or two integer seperated by a comma"

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
		for i in range(min,max):
			result = get_antilychrel(i)
			print(str(i) + " : " + str(result[0]) + " ( after " + str(result[1][0]) + " iteration(s) -> " + str(result[1][1])+ " )")
	elif len(input_range) == 1:
		try:
			num = int(input_number)
		except ValueError:
			print(input_err)
			input("\nPress any key to exit...")
			exit(1)
		result = get_antilychrel(num)
		print(str(input_number) + " : " + str(result[0]) + " ( after " + str(result[1][0]) + " iteration(s) -> " + str(result[1][1])+ " )")
	else:
		print(input_err)
		input("\nPress any key to exit...")
		exit(1)
except Exception as err:
	print(err)
	
input("\nPress any key to exit...")