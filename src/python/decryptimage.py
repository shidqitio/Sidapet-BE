from cryptography.fernet import Fernet
import sys
import base64
file_source_image_encrypt =sys.argv[1]
key =sys.argv[2]
fernet = Fernet(key)
with open(file_source_image_encrypt, 'rb') as f:
    locked_photo = f.read()
unlocked_photo = fernet.decrypt(locked_photo)
unlocked_photo_base64 = base64.b64encode(unlocked_photo).decode()
print(unlocked_photo_base64)
