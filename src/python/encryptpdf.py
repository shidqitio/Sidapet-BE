from pypdf import PdfReader,PdfWriter
import sys
import random

def generate_random_password(length= 8):
  numbers = '0123456789'
  return ''.join(random.choice(numbers) for _ in range(length))

file_arg = sys.argv[1]
reader = PdfReader(file_arg)
writer = PdfWriter()
for page in reader.pages:
    writer.add_page(page)
random_password = "123456"
writer.encrypt(random_password,use_128bit=False)

with open(file_arg,"wb") as out_file:
  writer.write(out_file)
  print(random_password)

