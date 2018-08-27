"""
Longest Sequence

Given a series of numbers, find the longest sequence in the series.
A sequence could be one of the following:

An ascending sequence

Example:

Input: 836926
Output: 369

A descending sequence

Example:

Input: 2995316 
Output: 9531

An equal sequence

Example:

Input: 255566 
Output: 555

Write a program that reads a series of numbers from the input and finds the longest ascending, descending or equal sequence in the series.

Bonus: Write a program to find all of the sequences above.
"""
def find_longest_sequences(nums):
	i = 0
	sequences = []
	while i < (len(nums) - 1):
		sequence = []
		if nums[i+1] > nums[i]:
			sequence = [nums[i], nums[i+1]]
			j = i + 2
			while j < (len(nums) - 1) and (nums[j] > nums[j-1]):
				sequence.append(nums[j])
				j += 1
			if j <= (len(nums) - 1) and (nums[j] > nums[j-1]):
				sequence.append(nums[j])
			sequences.append(sequence)
		elif nums[i + 1] < nums[i]:
			sequence = [nums[i], nums[i+1]]
			j = i + 2
			while j < (len(nums) - 1) and (nums[j] < nums[j-1]):
				sequence.append(nums[j])
				j += 1
			if j <= (len(nums) - 1) and (nums[j] < nums[j-1]):
				sequence.append(nums[j])
			sequences.append(sequence)
		elif nums[i + 1] == nums[i]:
			sequence = [nums[i], nums[i+1]]
			j = i + 2
			while j < (len(nums) - 1) and (nums[j] == nums[j-1]):
				sequence.append(nums[j])
				j += 1
			if j <= (len(nums) - 1) and (nums[j] == nums[j-1]):
				sequence.append(nums[j])
			sequences.append(sequence)
		i += 1
	
	sequences = sorted(sequences, key = lambda elem: len(elem), reverse = True)
	
	if len(sequences) == 0:
		return(nums)
	elif len(sequences) == 1 or len(sequences[1]) < len(sequences[0]):
		return(sequences[0])
	else:
		i = 0
		while (i < len(sequences) - 1) and (len(sequences[i + 1]) == len(sequences[i])):
			i += 1
		return(sequences[0:i+1])

#print(find_longest_sequences([]))
#print(find_longest_sequences([1]))
#print(find_longest_sequences([1,2]))
#print(find_longest_sequences([8,3,6,9,2,6]))
#print(find_longest_sequences([2,5,5,5,6,6]))
#print(find_longest_sequences([2,9,9,5,3,1,6]))
#print(find_longest_sequences([12, 3, 5, 4, 8]))
#print(find_longest_sequences([1,2,3,4,3,3,3,3,2,1,0,0,0,0]))

try:
	print("\n",find_longest_sequences([int(n) for n in input("\nPlease put space or comma between numbers:\n").replace(',',' ').split()]))
except Exception as e:
	print(e)

input("\nPress any key to exit...")
