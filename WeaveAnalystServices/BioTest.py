# This is a simple addtion script in python
from operator import add
def addition(arr1, arr2):
		new_row = []
		
		b = map(add, arr1, arr2)
		new_row.append(b)
		
		return new_row
	
result = addition(arr1, arr2)