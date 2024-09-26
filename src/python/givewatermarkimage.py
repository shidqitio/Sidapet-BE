import sys
from PIL import Image, ImageDraw, ImageFont


file_source_image =sys.argv[1]
file_source_image_encrypt = sys.argv[2]
text_watermark = sys.argv[3]

image = Image.open(file_source_image).convert('RGBA')
main_width, main_height = image.size
width_text = len(text_watermark) * 15
height_text = len(text_watermark) * 5
num_repetitions_x = (main_width // width_text) + 2
num_repetitions_y = (main_height // height_text) + 2

txt = Image.new('RGBA', image.size, (255,255,255,0))
d = ImageDraw.Draw(txt)
font = ImageFont.load_default(size=20)

for i in range(num_repetitions_x):
        for j in range(num_repetitions_y):
         text_x = i * width_text- (width_text// 2)
         text_y = j * height_text- (height_text // 2)
         d.text((text_x,text_y), text_watermark, fill=(237, 233, 157, 45), font=font)

combine = Image.alpha_composite(image,txt)
combine.save(file_source_image_encrypt)
print(True)