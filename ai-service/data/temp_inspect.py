from collections import Counter
import csv

with open('train.csv', encoding='utf-8', errors='ignore') as f:
    header = next(csv.reader(f))

counts = Counter(header)
dups = [(k, v) for k, v in counts.items() if v > 1]
print(dups)
print('total attributes', len(header))
