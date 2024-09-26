
from cryptography.fernet import Fernet
import sys

file_source_image =sys.argv[1]
file_source_image_encrypt = sys.argv[2]

key = Fernet.generate_key()
fernet = Fernet(key)

with open(file_source_image_encrypt, 'rb') as f:
    photo = f.read()

locked_photo = fernet.encrypt(photo)

with open(file_source_image_encrypt, 'wb') as locked_photo_file:
    locked_photo_file.write(locked_photo)

print("Image has been encrypted and saved.")
print(key.decode())
print(file_source_image_encrypt)
