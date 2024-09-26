
import sys
from pypdf import PdfReader

file_buffer = sys.argv[1]

reader = PdfReader(file_buffer)

print(len(reader.pages))
page = reader.pages[0]
text = page.extract_text()
print(text)
