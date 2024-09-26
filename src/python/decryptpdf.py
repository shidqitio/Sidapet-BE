from pypdf import PdfReader, PdfWriter
import sys
from io import BytesIO
file_source = sys.argv[1]
password = sys.argv[2]
reader = PdfReader(file_source)
reader.decrypt(password=password)
writer = PdfWriter(clone_from=reader)

# Save the new PDF to a file
with open(file_source, "wb") as f:
    writer.write(f)
    print(file_source)