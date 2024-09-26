from Crypto.Hash import SHA256
import sys

if len(sys.argv) > 1:
  datax = str(sys.argv[1])
  data = bytes(datax, 'utf-8')

  hash_object = SHA256.new(data=data)
  print(hash_object.hexdigest())
else:
  print("")
