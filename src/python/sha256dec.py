import hashlib
import sys

if len(sys.argv) > 0:
  datax = str(sys.argv[1])
  data = bytes(datax, 'utf-8')

  hashed = hashlib.sha256(data.encode('utf-8')).hexdigest()

  print(hashed.upper())
else:
  print("")
