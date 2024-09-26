import face_recognition
import sys

file_foto1 = sys.argv[1]
file_foto2 = sys.argv[2]


picture_of_me = face_recognition.load_image_file(file_foto1)
my_face_encoding = face_recognition.face_encodings(picture_of_me)[0]

# my_face_encoding now contains a universal 'encoding' of my facial features that can be compared to any other picture of a face!

unknown_picture = face_recognition.load_image_file(file_foto2)
unknown_face_encoding = face_recognition.face_encodings(unknown_picture)[0]

# Now we can see the two face encodings are of the same person with `compare_faces`!

results = face_recognition.compare_faces([my_face_encoding], unknown_face_encoding)

if results[0] == True:
    print("It's a picture of me!",results)
else:
    print("It's not a picture of me!",results)