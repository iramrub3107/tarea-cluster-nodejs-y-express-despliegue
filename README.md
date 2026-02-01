# Despliegue de una aplicación en "Cluster" con NodeJS y Express | Práctica realizada por Izan Ramos Rubio

Hay que tener en cuenta que, antes de empezar esta práctica, sí o sí tenemos que tener instalado NodeJS. Como usaremos una versión de Ubuntu fuera de soporte, para instalarnos NodeJS, tendremos que instalarnos una versión de esta herramienta llamada "NodeJS LTS" (NodeJS Long Term Service).

Para instalarnos NodeJS LTS, tenemos que ejecutar dos comandos:

1. ```curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -```

<img width="1202" height="677" alt="image" src="https://github.com/user-attachments/assets/a108ab23-50ef-4240-a1c5-24cf37fa76e6" />

2. ```sudo apt install -y nodejs```. Básicamente nos instalaremos NodeJS con normalidad después de ejecutar el anterior comando.

<img width="1203" height="676" alt="image" src="https://github.com/user-attachments/assets/e71e6cdf-ad3f-44d1-a37e-d289c22f02f0" />

Una vez tengamos instalado NodeJS, ya sí podremos empezar a hacer esta práctica.

# USANDO LOS CLUSTERS: 1. Primero sin Cluster

Como vamos a tener que acceder mediante SSH a muestra máquina, seguiremos estos pasos:

1. En la configuración de la máquina, vamos a ir al apartado de Red y pondremos “Adaptador Puente” para que, al ejecutar “ip a”, nos salga una IP “normal” (y no una rara al tener la VM conectada a una red NAT).

<img width="1201" height="697" alt="image" src="https://github.com/user-attachments/assets/96a0f565-b55d-458d-9a2d-02dc168cc8cb" />

2. Guardamos los cambios, iniciamos la máquina y una vez dentro ejecutamos ip a. Nos guardamos también la IP que nos salga al ejecutar este comando porque nos va a ser útil para poder acceder a la máquina más adelante:

<img width="1201" height="678" alt="image" src="https://github.com/user-attachments/assets/d74a4981-b4ec-4809-a2d3-ffca497724e6" />

3. Desde la terminal de nuestro equipo anfitrión, accederemos a la máquina ejecutando (al menos en mi caso, al usar Arch Linux) ssh usuario@172.20.10.4 (la IP de mi VM)

<img width="1202" height="677" alt="image" src="https://github.com/user-attachments/assets/675a0cbf-ee03-4f9b-91c9-8095bdc15d0f" />

--- 

Ahora, vamos a empezar a instalar todo lo necesario para poder empezar esta parte. Para ello, crearemos la carpeta cluster-node con ```mkdir cluster-node```, accedemos a ella (```cd cluster-node/```) y, una vez dentro de la nueva carpeta, ejecutaremos ```npm init```

<img width="1202" height="678" alt="image" src="https://github.com/user-attachments/assets/c1cc0c6f-4fb0-46e8-a382-a61b393b12e7" />

Luego vamos a instalarnos express ejecutando ```npm install express```, ya que nuestro programa lo va a necesitar.

<img width="1200" height="678" alt="image" src="https://github.com/user-attachments/assets/32b99232-d299-46e4-b87c-50d5005ed54d" />

A continuación, vamos a crear nuestro archivo app.js (puede llamarse de cualquier forma este archivo mientras sea un .js, yo lo he llamado "app" por ponerle un nombre sencillo) ejecutando ```nano app.js```, y en este pondremos el código que aparece en el PDF. En mi caso he hecho unos ligeros cambios para que, al ejecutar node app.js, el comando se ejecute sin problemas, como por ejemplo cambiar las siguientes líneas:

```js
res.send(`Final count is ${count}`);
```
y
```js 
console.log(`App listening on port ${port}`);
```
por estas:
```js
res.send("Final count is " + count);
```
y
```js 
console.log("App listening on port" + port);
```

<img width="1200" height="675" alt="image" src="https://github.com/user-attachments/assets/04ff08a5-9c6b-4925-9944-a1bd8f25d756" />

Después de añadir ese código a nuestro archivo, lo iniciaremos ejecutando ```node app.js``` 

<img width="1201" height="677" alt="image" src="https://github.com/user-attachments/assets/f70e6d83-b3b6-4abe-8898-41c1114e9230" />
