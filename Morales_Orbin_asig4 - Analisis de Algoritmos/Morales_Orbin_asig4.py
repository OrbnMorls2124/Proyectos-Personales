# Ejercicio 1: Agregar imagen
import cv2
img = cv2.imread("imagen.jpg")
print(type(img))
cv2.imshow('Original Image', img)
height, width = img.shape[0:2]
cv2.waitKey(0)
cv2.destroyAllWindows()

# Ejercicio 2: Recortar Imagen
img = cv2.imread("imagen.jpg")
height, width = img.shape[0:2]
startRow = int(height * .15)
startCol = int(width * .15)
endRow = int(height * .85)
endCol = int(width * .85)
croppedImage = img[startRow:endRow, startCol:endCol]
cv2.imshow("Original", img)
cv2.imshow("Recortar", croppedImage)
cv2.waitKey(0)
cv2.destroyAllWindows()

# Ejercicio 3: Cambiar tamaño imagen
img = cv2.imread("imagen.jpg")
newImg = cv2.resize(img, (0, 0), fx=0.75, fy=0.75)
cv2.imshow("Cambiar", newImg)
cv2.waitKey(0)
cv2.destroyAllWindows()

# Ejercicio 4: Cambiar contraste
import numpy as np
img = cv2.imread("pyimg.jpg")
contrast_img = cv2.addWeighted(img, 2.5, np.zeros(img.shape, img.dtype), 0, 0)
cv2.imshow("Original", img)
cv2.imshow("Contraste", contrast_img)
cv2.waitKey(0)
cv2.destroyAllWindows()

# Ejercicio 5: Imagen Borrosa
img = cv2.imread("imagen.jpg")
blur_image = cv2.GaussianBlur(img, (7, 7), 0)
cv2.imshow("Original", img)
cv2.imshow("Borrosa", blur_image)
cv2.waitKey(0)
cv2.destroyAllWindows()

# Ejercicio 6: Escala de grises
img = cv2.imread("imagen.jpg")
gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
cv2.imshow("Original", img)
cv2.imshow("Escala Image", gray_img)
cv2.waitKey(0)
cv2.destroyAllWindows()

# Ejercicio 7: Valor mediano
img = cv2.imread("imagen.png")
blur_image = cv2.medianBlur(img, 5)
cv2.imshow("Original", img)
cv2.imshow("Blur Image", blur_image)
cv2.waitKey(0)
cv2.destroyAllWindows()

# Ejercicio 8: Bordes de imagen
img = cv2.imread("imagen.jpg")
verimg = cv2.Canny(img, 100, 200)
cv2.imshow("Detectada", verimg)
cv2.waitKey(0)
cv2.destroyAllWindows()

# Ejercicio 9: Concatenar Imágenes en Horizontal
imagen1 = cv2.imread('imagen_01.jpeg')
imagen2 = cv2.imread('imagen_02.jpeg')
alto = min(imagen1.shape[0], imagen2.shape[0])
imagen1 = cv2.resize(imagen1, (int(imagen1.shape[1] * alto / imagen1.shape[0]), alto))
imagen2 = cv2.resize(imagen2, (int(imagen2.shape[1] * alto / imagen2.shape[0]), alto))
concatenar = cv2.hconcat([imagen1, imagen2])
cv2.imshow('concatenar', concatenar)
cv2.waitKey(0)
cv2.destroyAllWindows()

# Ejercicio 10: Concatenar Imágenes en Vertical
imagen1 = cv2.imread('imagen_01.jpeg')
imagen2 = cv2.imread('imagen_02.jpeg')
ancho = min(imagen1.shape[1], imagen2.shape[1])
imagen1 = cv2.resize(imagen1, (ancho, int(imagen1.shape[0] * ancho / imagen1.shape[1])))
imagen2 = cv2.resize(imagen2, (ancho, int(imagen2.shape[0] * ancho / imagen2.shape[1])))
concatenar = cv2.vconcat([imagen1, imagen2])
cv2.imshow('concatenar', concatenar)
cv2.waitKey(0)
cv2.destroyAllWindows()

# Ejercicio 11: Concatenar 4 imágenes
imagen1 = cv2.imread('imagen_01.jpeg')
imagen2 = cv2.imread('imagen_02.jpeg')
base_h = min(imagen1.shape[0], imagen2.shape[0])
base_w = min(imagen1.shape[1], imagen2.shape[1])
imagen1 = cv2.resize(imagen1, (base_w, base_h))
imagen2 = cv2.resize(imagen2, (base_w, base_h))
fila1 = cv2.hconcat([imagen1, imagen2])
fila2 = cv2.hconcat([imagen2, imagen1])
concat_v = cv2.vconcat([fila1, fila2])
cv2.imshow('concat_v', concat_v)
cv2.waitKey(0)
cv2.destroyAllWindows()

# Ejercicio 12: Concatenando una imagen sobre otras
import imutils
imagen1 = cv2.imread('imagen_01.jpeg')
imagen2 = cv2.imread('imagen_02.jpeg')
imagen3 = cv2.imread('ave.jpg')
base_h = 300
imagen1 = cv2.resize(imagen1, (int(imagen1.shape[1] * base_h / imagen1.shape[0]), base_h))
imagen2 = cv2.resize(imagen2, (int(imagen2.shape[1] * base_h / imagen2.shape[0]), base_h))
concat_h = cv2.hconcat([imagen1, imagen2])
imagen3 = cv2.resize(imagen3, (concat_h.shape[1], int(imagen3.shape[0] * concat_h.shape[1] / imagen3.shape[1])))
concat_v = cv2.vconcat([imagen3, concat_h])
cv2.imshow('concat_v_1sobre3', concat_v)
cv2.waitKey(0)
cv2.destroyAllWindows()

# Ejercicio 13: Vídeo
import cv2 as cv
cap = cv.VideoCapture('video1.avi')
cv.namedWindow('frame', cv.WINDOW_NORMAL)
while True:
    ret, frame = cap.read()
    if ret:
        gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
        cv.imshow('frame', gray)
    if cv.getWindowProperty('frame', cv.WND_PROP_VISIBLE) < 1:
        break
    cv.waitKey(30)
cap.release()
cv.destroyAllWindows()

# Alumno: Orbin Morales (cta. 1220207)
# Catedrático: Marco Tulio Alemán Watters (cta. 219003)
# Asignatura: Análisis de Algoritmos