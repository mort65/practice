'''
Fisher Number

A Fisher number is an integer whose multipliers are equal to the number's cube. For example, 12 is a Fisher number, because 12^3 = 2 x 3 x 4 x 6 x 12.

For example:
Input: 12
Output: true (12^3 = 2 x 3 x 4 x 6 x 12)

Input: 8 
Output: false (8^3 != 2 x 4 x 8)

Write a program to check if the user input is a Fisher number or not.
'''

def isfisher(n):
    if n < 1:
        return False
    m = 1
    for j in ({ i for i in range(2,int(n / 2) + 1) if (n % i == 0)}.union({n})):
        m *= j
    return m == (n ** 3)

try:
    num = int(input())
    if isfisher(num):
        print("{0} is a fisher number.".format(num))
    else:
        print("{0} is not a fisher number.".format(num))
    print("\nFisher numbers in the range of [{0},{1}):\n".format(1,num))
    for i in range(1,num):
        if isfisher(i):
            print(i)
except ValueError:
    print("Please write an integer.")
except Exception as e:
    print(e)
	
input("\nPress enter to exit...")