#Video - Ejercicio de la página #14 de la presentación "Videos en OpenCV" 

import numpy as np
import cv2 as cv
cap = cv.VideoCapture('video1.avi')
cv.namedWindow('frame', cv.WINDOW_NORMAL)
cv.resizeWindow('frame', 1280, 720)
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    frame = cv.resize(frame, (1280, 720), interpolation=cv.INTER_AREA)
    gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
    cv.imshow('frame', gray)
    cv.waitKey(5)
cap.release()
cv.destroyAllWindows()

#Estudiante: Orbin Daniel Morales López (cta. 1220207)
#Catedratico: Marco Tullo Alemán Watters (cta. 219003)
#Asignatura: Análisis de Algoritmos 