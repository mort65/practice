"""
The Crypto-Cube

Imagine a cube, which can contain characters at its vertices. Each vertex can contain a single character. 
For example, we can store the string "SoloLearn" in a cube.
'S' will be stored at the position (0, 0, 0) , 'o' at  (0, 1, 0) , 'l' at (1, 1, 0) , 'o' at (1, 0, 0), 'L' at (0, 0, 1), 'e' at (0, 1, 1), 'a' at (1, 1, 1), 'r' at (1, 0, 1). 
As each cube has only 8 vertices, we will need another cube to store the last character.
A string of 100 characters will require 100/8: 13 cubes to store all the characters.
Reading from and writing to a cube is done in the sequence: (0, 0, 0), (0, 1, 0), (1, 1, 0), (1, 0, 0), (0, 0, 1), (0, 1, 1), (1, 1, 1), (1, 0, 1). 
Each cube can be rotated left, right, up and down. 
After each rotation, the characters move from their vertices to corresponding neighbor vertices. 

TASK:
Write a program that encrypts a given string by randomly rotating the corresponding cubes, as well as decrypts the string, given the encrypted string and the rotation sequence.
For instance, for the text "I love coding and SoloLearn" you will need 4 cubes and here's a random sample of rotations:
0:U:U:L:R,1:U,2:D:R,3:U:R
0, 1, 2 or 3 are the numbers of the cubes, U, L R D are the rotation directions (Up, Left, Right, Down). Cube rotations are comma-separated. Each cube can have multiple rotations, 
separated by colons. So, 0:U:U:L:R means that the first cube is rotated up, then again up, to the left, and finally to the right.
"""
import random

class CryptoCube(object):
	def __init__(self, a = ' ', b = ' ', c = ' ', d = ' ', e = ' ', f = ' ', g = ' ', h = ' '):
		self._vertices = [a, b, c, d, e, f, g, h]
		self._a = a
		self._b = b
		self._c = c
		self._d = d
		self._e = e
		self._f = f
		self._g = g
		self._h = h

	def read(self):
		return [self._a, self._b, self._c, self._d, self._e, self._f, self._g, self._h]
		
	def write(self, a = '', b = '', c = '', d = '', e = '', f = '', g = '', h = '' ):
		if a != '':
			self._a = a
		if b != '':
			self._b = b
		if c != '':
			self._c = c
		if d != '':
			self._d = d
		if e != '':
			self._e = e
		if f != '':
			self._f = f
		if g != '':
			self._g = g
		if h != '':
			self._h = h
	
	def rotate(self, direction):
		self._vertices = [self._a, self._b, self._c, self._d, self._e, self._f, self._g, self._h]
		if str(direction).lower() in ('l', "left"):
			self._a = self._vertices[3]
			self._b = self._vertices[2]
			self._c = self._vertices[6]
			self._d = self._vertices[7]
			self._e = self._vertices[0]
			self._f = self._vertices[1]
			self._g = self._vertices[5]
			self._h = self._vertices[4]
		elif str(direction).lower() in ('u', "up"):
			self._a = self._vertices[4]
			self._b = self._vertices[0]
			self._c = self._vertices[3]
			self._d = self._vertices[7]
			self._e = self._vertices[5]
			self._f = self._vertices[1]
			self._g = self._vertices[2]
			self._h = self._vertices[6]
		elif str(direction).lower() in ('r', "right"):
			self._a = self._vertices[4]
			self._b = self._vertices[5]
			self._c = self._vertices[1]
			self._d = self._vertices[0]
			self._e = self._vertices[7]
			self._f = self._vertices[6]
			self._g = self._vertices[2]
			self._h = self._vertices[3]
		elif str(direction).lower() in ('d', "down"):
			self._a = self._vertices[1]
			self._b = self._vertices[5]
			self._c = self._vertices[6]
			self._d = self._vertices[2]
			self._e = self._vertices[0]
			self._f = self._vertices[4]
			self._g = self._vertices[7]
			self._h = self._vertices[3]

def write_on_cubes(message):
	cubes = []
	msgs = []
	msg = ''
	for i in range(len(message)):
		msg += message[i]
		if (((i + 1) % 8) == 0) or (i == (len(message) - 1)):
			msgs.append(msg)
			msg =''
			chars = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
			for j in range(len(msgs[len(msgs) - 1])):
				chars[j] = msgs[len(msgs) - 1][j]
			cubes.append(CryptoCube(chars[0], chars[1], chars[2], chars[3], chars[4], chars[5], chars[6], chars[7]))
	return cubes

def get_valid_directions(cube, msg):
	directions = ['L', 'R', 'U', 'D']
	chars = cube.read()
	for direction in ['L', 'R', 'U', 'D']:
		cube.rotate(direction)
		current_state = ''
		for c in cube.read():
			current_state += c
		if current_state.replace(' ', '') == msg:
			directions.remove(direction)
		cube.write(chars[0], chars[1], chars[2], chars[3], chars[4], chars[5], chars[6], chars[7])
	return directions
	
def isencryptable(msg):
	for c in range(len(msg) - 1):
		if msg[c] != msg[c + 1]:
			return True
	return False
	
def encrypt(message, key = '', max_rotations = 4):
	directions = ['L', 'R', 'U', 'D']
	cubes = write_on_cubes(message)
	cube_index = 0
	code = ""
	if len(key) > 0:
		isrotated = False
		cube_keys = key.split(',')
		for cube_key in cube_keys:
			rotations = cube_key.split(':')
			cube_index = int(rotations[0])
			if cube_index <= ( len(cubes) - 1):
				del rotations[0]
				for rotation in rotations:
					cubes[cube_index].rotate(rotation)
				isrotated = True
		if isrotated:
			cube_index += 1
	if (len(key) == 0) or ((len(key) > 0) and (len(cube_keys) < len(cubes))):
		if (len(key) > 0):
			key += ','
		for i in range(cube_index, len(cubes)):
			msg = ''
			for c in cubes[i].read():
				msg += c.replace(' ', '')
			key += str(i) + ':'
			if isencryptable(msg):
				rotations_count = random.randint(1, max_rotations)
				j = 0
				while j < rotations_count:
					j += 1
					directions = get_valid_directions(cubes[i],msg)
					if len(directions) > 0:
						rotation = directions[random.randint(0,len(directions) - 1)]
						cubes[i].rotate(rotation)
						key += str(rotation) + ':'
				key = key[:-1]
			key += ','
		key = key[:-1]
	for cube in cubes:
		for c in cube.read():
			code += c
	return [code, key]

def decrypt(code, key):
	message = ""
	cubes = write_on_cubes(code)
	cube_keys = key.split(',')
	for cube_key in cube_keys:
		rotations = cube_key.split(':')
		cube_index = int(rotations[0])
		if cube_index <= ( len(cubes) - 1):
			del rotations[0]
			rotations.reverse()
			for rotation in rotations:
				if rotation.lower() == 'l':
					cubes[cube_index].rotate('r')
				elif rotation.lower() == 'u':
					cubes[cube_index].rotate('d')
				elif rotation.lower() == 'r':
					cubes[cube_index].rotate('l')
				elif rotation.lower() == 'd':
					cubes[cube_index].rotate('u')
	for cube in cubes:
		for c in cube.read():
			message += c
	return(message)

print(encrypt("He who has a why to live can bear almost any how. Friedrich Nietzsche", max_rotations = 3))
print(decrypt("hoeHh  w wsayh a ove til bc aeanmo rtsalynow ah rFdr. eiNiciteh ezh  sc ", "0:R,1:R,2:L,3:R:U:D,4:D:U:R,5:U:D:L,6:U:D:L,7:R,8:U:R:L"))

message = input()
encrypted = encrypt(message)
decrypted = decrypt(encrypted[0], encrypted[1])
print("\nEncrypt: ", encrypted)
print("\nDecrypt: ", decrypted)

input("\nPress enter to exit...")