from tkinter import *
from tkinter import messagebox, scrolledtext
from tkinter.ttk import Combobox, Checkbutton, Radiobutton, Progressbar
from tkinter import ttk

# Ejercicio 1 
window = Tk()
window.title("Prueba")
window.geometry('500x600')
lbl = Label(window, text="Ejemplo")
lbl.grid(column=0, row=0, padx=10, pady=5)

# Ejercicio 2: Tamaño de texto
lbl2 = Label(window, text="Prueba", font=("Arial Bold", 50))
lbl2.grid(column=0, row=1, padx=10, pady=5)
btn_color = Button(window, text="Click Me", bg="orange", fg="red")
btn_color.grid(column=1, row=0, padx=10, pady=5)

# Ejercicio 3: Evento de botones
def clicked():
    lbl.configure(text="Botón click")
btn_evento = Button(window, text="Click", command=clicked)
btn_evento.grid(column=1, row=1, padx=10, pady=5)

# Ejercicio 4: Agregar un Combobox
combo = Combobox(window)
combo['values'] = (1, 2, 3, 4, 5, "Text")
combo.current(1)
combo.grid(column=0, row=2, padx=10, pady=5)

# Ejercicio 5: Crear un Checkbox
chk_state = BooleanVar()
chk_state.set(True)
chk = Checkbutton(window, text='Checkbox', variable=chk_state)
chk.grid(column=1, row=2, padx=10, pady=5)

# Ejercicio #6: Radiobotones
rad1 = Radiobutton(window, text='Uno', value=1)
rad2 = Radiobutton(window, text='Dos', value=2)
rad3 = Radiobutton(window, text='Tres', value=3)
rad1.grid(column=0, row=3, padx=10, pady=5)
rad2.grid(column=1, row=3, padx=10, pady=5)
rad3.grid(column=2, row=3, padx=10, pady=5)

# Ejercicio 7: Mensajes
def mostrar_mensaje():
    messagebox.showinfo('Titulo', 'Contenido del objeto')
btn_msg = Button(window, text='Click here', command=mostrar_mensaje)
btn_msg.grid(column=0, row=4, padx=10, pady=5)

# Ejercicio 8: Widget ScrolledText
txt = scrolledtext.ScrolledText(window, width=40, height=6)
txt.grid(column=0, row=5, columnspan=3, padx=10, pady=5)

# Ejercicio 9: Progressbar
style = ttk.Style()
style.theme_use('default')
style.configure("black.Horizontal.TProgressbar", background='black')
bar = Progressbar(window, length=200, style='black.Horizontal.TProgressbar')
bar['value'] = 70
bar.grid(column=0, row=6, columnspan=3, padx=10, pady=10)

# Ejercicio 10: Menú
menu = Menu(window)
new_item = Menu(menu)
new_item.add_command(label='Nuevo')
new_item.add_separator()
new_item.add_command(label='Editar')
menu.add_cascade(label='File', menu=new_item)
window.config(menu=menu)

window.mainloop()

#Orbin Daniel Morales López (Cta. 1220207)
#Asignatura: Análisis de Algoritmos
#Catedrático: Marco Tulio Alemán Watters (Cta. 219003)