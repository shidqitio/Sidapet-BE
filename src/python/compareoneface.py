import face_recognition
import sys


file_foto  = sys.argv[1]

image_path = file_foto
image = face_recognition.load_image_file(image_path)

face_locations = face_recognition.face_locations(image)
face_encodings = face_recognition.face_encodings(image, face_locations)

if len(face_encodings) == 2:
    distance = face_recognition.face_distance([face_encodings[0]], face_encodings[1])[0]

    threshold = 0.6
    similarity_percentage = (1 - distance) * 100

    if distance < threshold:
        
        print('The faces are similar with distance:', distance,similarity_percentage)
    else:
        print('The faces are not similar with distance:', distance,similarity_percentage)
else:
    print('Two faces are not detected in the image.')
