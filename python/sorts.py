from random import randint
from time import time
from math import sqrt

def _swap(A,x,y):
    temp = A[x]
    A[x] = A[y]
    A[y] = temp

def bubbleSort(A):
    for i in range( len(A) ):
        for k in range( len(A) - 1, i, -1 ):
            if ( A[k] < A[k - 1] ):
                _swap( A, k, k -1 )
                
def improvedBubbleSort(A):
    for i in range( len(A) ):
        swapped = 0
        for k in range( len(A) - 1, i, -1 ):
            if ( A[k] < A[k - 1] ):
                _swap( A, k, k -1 )
                swapped = 1
        if ( swapped == 0 ):
            return

def selectionSort( A ):
    for i in range( len(A) ):
        least = i
        for k in range( i + 1, len( A ) ):
            if A[k] < A[least]:
                least = k
        _swap(A, least, i)
        
def insertionSort( A ):
    for i in range( 1, len( A) ):
        temp = A[i]
        k = i
        while k > 0 and temp < A[k - 1]:
            A[k] = A[k - 1]
            k -= 1
        A[k] = temp
            

def shellSort(A):
    sublistcount = len(A) // 2
    while sublistcount > 0:
        for startposition in range(sublistcount):
            _gapInsertionSort(A,startposition,sublistcount)
        #print("After increments of size",sublistcount, "The list is",A)
        sublistcount = sublistcount // 2

def _gapInsertionSort(A,start,gap):
    for i in range(start + gap, len(A), gap):
        currentvalue = A[i]
        position = i
        
        while position >= gap and A[position-gap] > currentvalue:
            A[position] = A[position-gap]
            position = position-gap
        A[position] = currentvalue
            
def mergeSort(A):
    if len(A) > 1:
        mid = len(A) // 2
        lefthalf = A[:mid]
        righthalf = A[mid:]
        mergeSort(lefthalf)
        mergeSort(righthalf)
        i = j = k = 0
        while i < len(lefthalf) and j < len(righthalf):
            if lefthalf[i] < righthalf[j]:
                A[k] = lefthalf[i]
                i = i + 1
            else:
                A[k] = righthalf[i]
                j = j + 1
            k = k + 1
            
        while i < len(lefthalf):
            A[k] = lefthalf[i]
            i = i + 1
            k = k + 1
        
        while j < len(righthalf):
            A[k] = righthalf[j]
            j = j + 1
            k = k + 1
            
def quickSort(A, low, high):
    if low < high:
        pivot = _partition( A, low, high)
        quickSort(A, low, pivot - 1)
        quickSort(A, pivot + 1, high)

def _partition(A, low, high):
    pivot = low
    _swap( A, pivot, high)
    for i in range(low, high):
        if A[i] <= A[high]:
            _swap(A, i, low)
            low += 1
    _swap( A, low, high )
    return low
        
def countingSort(A,k):
    B = [0 for el in A]
    C =[0 for el in range(0,k + 1)]
    for i in range(0,k + 1):
        C[i] = 0
        
    for j in range(0,len(A)):
        C[A[j]] += 1
        
    for i in range(1,k + 1):
        C[i] += C[i - 1]

    for j in range(len(A)-1,-1,-1):
        tmp = A[j]
        tmp2=C[tmp] - 1
        B[tmp2] = tmp
        C[tmp] -= 1
        
    return B    

def bucketSort(A):
    code = _hashing(A)
    buckets = [list() for _ in range(code[1])]
    for i in A:
        x = _reHashing(i, code)
        buck = buckets[x]
        buck.append(i)
    for bucket in buckets:
        insertionSort(bucket)
    ndx = 0
    for b in range(len(buckets)):
        for v in buckets[b]:
            A[ndx] = v
            ndx += 1
    return A
def _hashing(A):
    m = A[0]
    for i in range(1, len(A)):
        if ( m < A[i]):
            m = A[i]
    result = [m, int(sqrt(len(A)))]
    return result

def _reHashing(i,code):
    return int(i / code[0] * (code[1] - 1))

def radixSort(A):
    RADIX = 10
    maxlength = False
    tmp,placement = -1, 1
    while not maxlength:
        maxlength = True
        buckets = [list() for _ in range(RADIX)]
        for i in A:
            tmp = i / placement
            buckets[int(tmp % RADIX)].append(i)
            if maxlength and tmp > 0:
                maxlength = False
        a = 0
        for b in range(RADIX):
            buck = buckets[b]
            for i in buck:
                A[a] = i
                a += 1
        #move to next digit
        placement *= RADIX
    
def testSorts(fl,al,k):
    rl = []
    tmpl = []
    for i in range(len(fl)):
        if fl[i] == quickSort:
            start_time = time()
            tmpl = fl[i](al[i], 0, len(al[i]) - 1)
        elif fl[i] == countingSort:
            start_time = time()
            tmpl = fl[i](al[i],k)
        else:
            start_time = time()
            tmpl = fl[i](al[i])
        end_time = time()
        if tmpl != None:
            al[i] = tmpl
        rl.append((fl[i],(end_time - start_time)))
    return rl

a = []

for i in range (1000):
    a.append(randint(0,4999))

al = [ a for i in range(11) ]
fl = [ bubbleSort, improvedBubbleSort, selectionSort, \
insertionSort, shellSort, mergeSort, quickSort, bucketSort, \
radixSort, countingSort, sorted ]

results = testSorts(fl,al,5000)
sortedResults = sorted(results, key=lambda el: (el[1]))
print("Ranking:\n")
for r in sortedResults:
    print(r)
    
print( '\n', al[0] == al[1] == al[2] == \
al[3] == al[4] == al[5] == al[6] == \
al[7] == al[8] == al[9] == al[10], al[0] )

input("\nPress enter to exit...")
