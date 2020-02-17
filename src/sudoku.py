#Sudoku Generator Algorithm - www.101computing.net/sudoku-generator-algorithm/
import turtle
from random import randint, shuffle
from time import sleep

#initialise empty 9 by 9 grid
grid = [[0]*9 for i in range(9)]
ppPrint(grid)


#A function to check if the grid is full
def checkGrid(grid):
  for row in range(0,9):
      for col in range(0,9):
        if grid[row][col]==0:
          return False

  #We have a complete grid!
  return True

numberList=[1,2,3,4,5,6,7,8,9]
#shuffle(numberList)

def getGridRow(grid,row):
    return grid[row]
def getGridCol(grid,col):
    return list(map(lambda x:x[col],grid))
def getSector(grid,x,y):
    sX = x//3
    sY = y//3
    return [j for row in grid[sX*3:sX*3+3] for j in row[sY*3:sY*3+3]]
def noDup(l):
    l = [i for i in l if i!=0]
    return len(set(l)) == len(l)

def validatePosition(grid,x,y):
    row = getGridRow(grid,x)
    col = getGridCol(grid,y)
    sec = getSector(grid,x,y)
    return noDup(row) and noDup(col) and noDup(sec)


def solveGrid(grid):
    global counter
    for x in range(9):
        for y in range(9):
            if grid[x][y] == 0:
                for i in range(1,10):
                    grid[x][y] = i
                    if validatePosition(grid,x,y):
                        solveGrid(grid)
                grid[x][y] = 0
                return
    counter += 1
    ppPrint(grid)

def fillGrid(grid):
    needbreak = False
    for x in range(9):
        for y in range(9):
            if grid[x][y] == 0:
                shuffle(numberList)
                for value in numberList:
                    grid[x][y]=value
                    if validatePosition(grid,x,y):
                        if checkGrid(grid):
                            return True
                        else:
                            if fillGrid(grid):
                                return True
                needbreak=True
                grid[x][y]=0
                break
        if needbreak:
            break


fillGrid(grid)

grid


#A backtracking/recursive function to check all possible combinations of numbers until a solution is found
def fillGrid(grid):
  global counter
  #Find next empty cell
  for i in range(0,81):
    row=i//9
    col=i%9
    if grid[row][col]==0:
      shuffle(numberList)
      for value in numberList:
        #Check that this value has not already be used on this row
        if not(value in grid[row]):
          #Check that this value has not already be used on this column
          if not value in (grid[0][col],grid[1][col],grid[2][col],grid[3][col],grid[4][col],grid[5][col],grid[6][col],grid[7][col],grid[8][col]):
            #Identify which of the 9 squares we are working on
            square=[]
            if row<3:
              if col<3:
                square=[grid[i][0:3] for i in range(0,3)]
              elif col<6:
                square=[grid[i][3:6] for i in range(0,3)]
              else:
                square=[grid[i][6:9] for i in range(0,3)]
            elif row<6:
              if col<3:
                square=[grid[i][0:3] for i in range(3,6)]
              elif col<6:
                square=[grid[i][3:6] for i in range(3,6)]
              else:
                square=[grid[i][6:9] for i in range(3,6)]
            else:
              if col<3:
                square=[grid[i][0:3] for i in range(6,9)]
              elif col<6:
                square=[grid[i][3:6] for i in range(6,9)]
              else:
                square=[grid[i][6:9] for i in range(6,9)]
            #Check that this value has not already be used on this 3x3 square
            if not value in (square[0] + square[1] + square[2]):
              grid[row][col]=value
              if checkGrid(grid):
                return True
              else:
                if fillGrid(grid):
                  return True
      break
  grid[row][col]=0

#Generate a Fully Solved Grid
fillGrid(grid)
# drawGrid(grid)
# myPen.getscreen().update()
sleep(1)
# print(grid)
grid
#Start Removing Numbers one by one

#A higher number of attempts will end up removing more numbers from the grid
#Potentially resulting in more difficiult grids to solve!
attempts = 5
counter=1
while attempts>0:
  #Select a random cell that is not already empty
  row = randint(0,8)
  col = randint(0,8)
  while grid[row][col]==0:
    row = randint(0,8)
    col = randint(0,8)
  #Remember its cell value in case we need to put it back
  backup = grid[row][col]
  grid[row][col]=0

  #Take a full copy of the grid
  copyGrid = []
  for r in range(0,9):
     copyGrid.append([])
     for c in range(0,9):
        copyGrid[r].append(grid[r][c])

  #Count the number of solutions that this grid has (using a backtracking approach implemented in the solveGrid() function)
  counter=0
  solveGrid(copyGrid)
  #If the number of solution is different from 1 then we need to cancel the change by putting the value we took away back in the grid
  if counter!=1:
    grid[row][col]=backup
    #We could stop here, but we can also have another attempt with a different cell just to try to remove more numbers
    attempts -= 1

#   myPen.clear()
#   drawGrid(grid)
#   myPen.getscreen().update()

def ppPrint(grid):
    for g in grid:
        print(g,',')

solveGrid(grid)

grid

counter=0
grid
grid = [
[0, 8, 2, 0, 1, 0, 0, 0, 6] ,
[0, 4, 1, 0, 0, 7, 0, 0, 0] ,
[0, 6, 0, 0, 4, 5, 0, 8, 0] ,
[1, 0, 0, 0, 0, 0, 0, 0, 0] ,
[0, 2, 0, 9, 0, 0, 6, 0, 0] ,
[9, 7, 0, 0, 5, 0, 0, 0, 8] ,
[2, 0, 0, 0, 6, 3, 8, 9, 4] ,
[0, 0, 8, 0, 9, 0, 1, 7, 0] ,
[0, 9, 0, 0, 0, 0, 0, 0, 0] ,
]
counter
solveGrid(grid)
grid
import time
t1 = time.time()
solveGrid(grid)
print(time.time()-t1)
ppPrint(grid)






"""
hardest sudoku

[8, 0, 0, 0, 0, 0, 0, 0, 0] ,
[0, 0, 3, 6, 0, 0, 0, 0, 0] ,
[0, 7, 0, 0, 9, 0, 2, 0, 0] ,
[0, 5, 0, 0, 0, 7, 0, 0, 0] ,
[0, 0, 0, 0, 4, 5, 7, 0, 0] ,
[0, 0, 0, 1, 0, 0, 0, 3, 0] ,
[0, 0, 1, 0, 0, 0, 0, 6, 8] ,
[0, 0, 8, 5, 0, 0, 0, 1, 0] ,
[0, 9, 0, 0, 0, 0, 4, 0, 0] ,


"""
