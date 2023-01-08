import sys
import math

def special_floor(res):
    if res.is_integer():
        return int(res) - 1
    else:
        return math.floor(res)

def special_ceil(res):
    if res.is_integer():
        return int(res) + 1
    else:
        return math.ceil(res)

def first_round(y_start, h):
    y_new = h - 1 - y_start
    return y_new if y_new != y_start else y_new+1

def handle_same(x1, y1, x2, y2, x_min, x_max, y_min, y_max):
    if x1 == x2:
        y_min = y_max = (y1 + y2)//2
    elif y1 == y2:
        x_min = x_max = (x1 + x2)//2
    return x_min, x_max, y_min, y_max

def handle_warm(x1, y1, x2, y2, x_min, x_max, y_min, y_max):
    if y2 > y1:
        y_min = max(y_min, special_ceil((y2 + y1)/2))
    elif y2 < y1:
        y_max = min(y_max, special_floor((y2 + y1)/2))
    if x2 > x1:
        x_min = max(x_min, special_ceil((x2 + x1)/2))
    elif x2 < x1:
        x_max = min(x_max, special_floor((x2 + x1)/2))
    return x_min, x_max, y_min, y_max

def handle_cold(x1, y1, x2, y2, x_min, x_max, y_min, y_max):
    if y2 > y1:
        y_max = min(y_max, special_floor((y2 + y1)/2))
    elif y2 < y1:
        y_min = max(y_min, special_ceil((y2 + y1)/2))
    elif x2 > x1:
        x_max = min(x_max, special_floor((x2 + x1)/2))
    elif x2 < x1:
        x_min = max(x_min, special_ceil((x2 + x1)/2))
    return x_min, x_max, y_min, y_max

def choose_next(x1, y1, x_min, x_max, y_min, y_max, y_found):
    x2, y2 = x1, y1
    if not y_found:
        y2, y_found = strategy(y1, y_min, y_max, h, y_found)
    else:
        x2, _ = strategy(x1, x_min, x_max, w)
    return x2, y2, y_found

def strategy(a1, a_min, a_max, big_max, a_found=False):
    a2 = a1
    if a_min == a_max:
        a2 = a_min
        a_found = True
    else:
        ideal = a_max + a_min - a1
        if ideal >= big_max:
            a2 = special_ceil(a1/3 + 2*a_max/3)
        elif ideal < 0:
            a2 = special_floor(a1/3 + 2*a_min/3)
        else:
            a2 = ideal
        if a2 == a1:
            if a1 > 0:
                a2 -=1
            else:
                a2 +=1
            
    return a2, a_found

w, h = [int(i) for i in input().split()]
n = int(input())  # maximum number of turns before game over.
x, y = [int(i) for i in input().split()]

x_min, x_max, y_min, y_max = 0, w-1, 0, h-1
x2, y2 = x, y
y_found = False
while True:
    bomb_dir = input()
    if bomb_dir == 'UNKNOWN':
        y2 = first_round(y, h)
    else:
        if bomb_dir == 'SAME':
            x_min, x_max, y_min, y_max = handle_same(
                x, y, x2, y2, x_min, x_max, y_min, y_max)
        elif bomb_dir == 'WARMER':
            x_min, x_max, y_min, y_max = handle_warm(
                x, y, x2, y2, x_min, x_max, y_min, y_max)
        elif bomb_dir == 'COLDER':
            x_min, x_max, y_min, y_max = handle_cold(
                x, y, x2, y2, x_min, x_max, y_min, y_max)
        x, y = x2, y2
        x2, y2, y_found = choose_next(x, y, x_min, x_max, y_min, y_max, y_found)
    print(x2, y2)
