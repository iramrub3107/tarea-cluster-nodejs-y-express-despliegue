# Despliegue de una aplicación en "Cluster" con NodeJS y Express | Práctica realizada por Izan Ramos Rubio

Hay que tener en cuenta que, antes de empezar esta práctica, sí o sí tenemos que tener instalado NodeJS. Como usaremos una versión de Ubuntu fuera de soporte, para instalarnos NodeJS, tendremos que instalarnos una versión de esta herramienta llamada "NodeJS LTS" (NodeJS Long Term Service).

Para instalarnos NodeJS LTS, tenemos que ejecutar dos comandos:

1. ```curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -```

<img width="1202" height="677" alt="image" src="https://github.com/user-attachments/assets/a108ab23-50ef-4240-a1c5-24cf37fa76e6" />

2. ```sudo apt install -y nodejs```. Básicamente nos instalaremos NodeJS con normalidad después de ejecutar el anterior comando.

<img width="1203" height="676" alt="image" src="https://github.com/user-attachments/assets/e71e6cdf-ad3f-44d1-a37e-d289c22f02f0" />

Una vez tengamos instalado NodeJS, ya sí podremos empezar a hacer esta práctica.

# USANDO LOS CLUSTERS: 1. Primero sin cluster

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

A continuación, vamos a crear nuestro archivo app.js (puede llamarse de cualquier forma este archivo mientras sea un .js, yo lo he llamado "app" por ponerle un nombre sencillo) ejecutando ```nano app.js```, y en este pondremos el código que aparece en el PDF. En mi caso, he hecho unos ligeros cambios para que, al ejecutar node app.js, el comando se ejecute sin problemas, como por ejemplo cambiar las siguientes líneas:

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

Como podemos observar, se está ejecutando correctamente, ya que al ejecutar el comando nos pone justo después “App listening on port 3000”, o sea, el "console.log" que teníamos dentro de la función flecha "app.listen" de nuestro programa.

---

Vamos a comprobar si la aplicación se ha desplegado correctamente. Para ello, vamos a ver primero qué nos sale tras acceder a http://172.20.10.4:3000/ (esto es con mi IP, hay que cambiar la IP a la que se disponga)

<img width="1201" height="205" alt="image" src="https://github.com/user-attachments/assets/d1ccda0d-29d1-4c91-b851-8ad70b0753f6" />

Aquí podemos observar que la aplicación se ha desplegado correctamente. Ahora, vamos a ver qué pasa si ponemos /api/50 en la URL:

<img width="1201" height="187" alt="image" src="https://github.com/user-attachments/assets/b3e12ccd-c5c7-4db7-94cd-7a6bdb513f57" />

Como podemos observar, nos ha imprimido por pantalla que “Final count is 1275”, por lo que, con solo esto, podemos confirmar que la aplicación funciona correctamente.
A continuación, vamos a realizar otra comprobación pero esta vez con un valor mucho más grande de n. Para esto, accederemos a la ruta http://172.20.10.4:3000/api/5000000000 y, a la vez, iremos desde otra pestaña a http://172.20.10.4:3000/api/555. Luego, iremos a las Dev Tools, y en “Performance”, veremos cuánto tarda en cargar cada una de las dos páginas.

<img width="1201" height="687" alt="image" src="https://github.com/user-attachments/assets/98b2a175-5617-4855-8faa-ed183b4e322f" />
<img width="1201" height="717" alt="image" src="https://github.com/user-attachments/assets/6c9c7023-6909-4860-be05-2f0a3266d72a" />

Como se puede ver, ambas páginas han tardado bastante en cargar. Esto ocurre porque el único subproceso que está ocupado con el primer proceso, al pasarle un segundo proceso, tiene que procesar primero el primer proceso antes de ponerse con el segundo.

---

# USANDO LOS CLUSTERS: 2. ¡Ahora con más cluster!

Ahora vamos a implementar los clústeres en nuestra aplicación. Para ello, vamos a editar nuestro archivo app.js y pondremos el código que aparece en la captura de pantalla:

<img width="1201" height="675" alt="image" src="https://github.com/user-attachments/assets/3fdb6d4a-2193-4347-b2f3-85d567cf7427" />

Hay que tener en cuenta que he decidido adaptar un poco el código para que este no me llegue a dar posibles problemas más adelante.

A continuación, haremos una única solicitud al servidor con un valor de n grande, y rápidamente haremos otra solicitud con un número menor, no sin antes ejecutar ```node app.js``` para que se despliegue la aplicación con los cambios ya hechos.

<img width="901" height="669" alt="image" src="https://github.com/user-attachments/assets/19059040-cce3-4ecc-8b58-e9eb8e160c16" />
<img width="900" height="667" alt="image" src="https://github.com/user-attachments/assets/1b83b8c3-4a6a-4bfc-bddd-aded6af845b1" />

Como podemos observar, aunque la solicitud grande siga tardando un poco más, la otra (la que tiene un valor n = 555), se ha hecho casi inmediatamente tras aplicar más workers para las solicitudes.

---

# MÉTRICAS DE RENDIMIENTO

Para usar estas métricas de rendimiento, vamos a usar el paquete **loadtest**. Para ello, nos lo instalaremos ejecutando ```npm install -g loadtest```:

<img width="1203" height="677" alt="image" src="https://github.com/user-attachments/assets/531c740a-ad5e-42b6-a2af-982e007060ce" />

A continuación, iniciamos nuestra aplicación ejecutando ```node app.js```, y después, en otra terminal, hacemos una prueba de carga con el paquete que nos acabamos de instalar (con loadtest):

<img width="1200" height="677" alt="image" src="https://github.com/user-attachments/assets/ddbdf9a2-d5c9-4102-93e9-34f8e8a4d5f9" />
<img width="1201" height="676" alt="image" src="https://github.com/user-attachments/assets/bdaa0261-ce22-4690-8864-485002222274" />

Como podemos observar, la prueba no se ha demorado mucho en hacer: ha tardado apenas un segundo y medio y ha tenido una latencia de 135.1ms con 690 RPS efectivos.
Ahora haremos una prueba similar pero con n = 500000000 (y sin clústeres, por lo que tendremos que editar nuestro archivo app.js para que no los tenga).

<img width="1201" height="676" alt="image" src="https://github.com/user-attachments/assets/4f56e950-e324-4b31-81a0-1182d0d02996" />

Como podemos observar, el tiempo total y la latencia han incrementado considerablemente, y apenas ha habido 1 RPS efectivo.
A continuación, haremos estas mismas dos pruebas pero con nuestra app con clústeres. Para ello, simplemente creamos un archivo llamado app-clusters (por ejemplo), y pondremos el código con clústeres que teníamos previamente.
Ahora, ejecutaremos la aplicación con clústeres

<img width="1201" height="676" alt="image" src="https://github.com/user-attachments/assets/d13deb41-fe4a-4818-86e2-de86f8d51f79" />

Y vamos a ir haciendo las pruebas que hicimos antes:

<img width="1203" height="677" alt="image" src="https://github.com/user-attachments/assets/9a6c7f19-0e5b-4b06-9727-e839e42e7640" />
<img width="1203" height="677" alt="image" src="https://github.com/user-attachments/assets/077f97e0-6949-4fdc-b5c0-c99d27247c01" />

Como podemos observar, en comparación a la aplicación sin clústeres, la que los tiene reduce significativamente la duración total y la latencia.

---

# USO DE PM2 PARA ADMINISTRAR UN CLÚSTER DE Node.js

Para poder usar esta herramienta, primero nos la tendremos que instalar. Para ello, ejecutaremos en la terminal ```sudo npm install pm2 -g```

<img width="1203" height="677" alt="image" src="https://github.com/user-attachments/assets/42e9884e-a729-4847-bb11-a8d6d2c67010" />

Y, a continuación, usaremos esta herramienta con nuestra aplicación sin clusterizar (app.js). Para ello, ejecutaremos pm2 start app.js -i 0

<img width="1203" height="677" alt="image" src="https://github.com/user-attachments/assets/7c77573e-d9bf-4d24-8896-f10247351e45" />

Y ahora tendríamos nuestra aplicación sin clústeres ejecutándose como si los tuviera.
Ahora, vamos a realizar las mismas pruebas que hicimos en el apartado de “Métricas de rendimiento”, y vamos a comparar los resultados que nos de ahora con los que nos dio previamente al ejecutar la misma aplicación con o sin clústeres:

<img width="1203" height="677" alt="image" src="https://github.com/user-attachments/assets/13b7220e-8b88-44d1-b8c4-315d4eabecaa" />
<img width="1203" height="677" alt="image" src="https://github.com/user-attachments/assets/c07ffecf-cc7a-4b9c-a6bc-5e171b75321d" />

Como podemos observar, hay una diferencia algo considerable ejecutando la aplicación sin clústeres pero “metiéndolos” con PM2, ante ejecutar la misma aplicación con clústeres. El tiempo de ejecución y la latencia llega a ser hasta 3 veces menor ejecutando la aplicación con PM2 que la aplicación con clústeres.

Si ejecutamos ahora pm2 stop app.js, veremos cómo la aplicación se desconecta

<img width="1203" height="135" alt="image" src="https://github.com/user-attachments/assets/b9730f07-23dd-41f9-88da-341da5de7803" />

Ahora, vamos a crear un archivo Ecosystem para que nos ahorremos la parte de “-i 0” cada vez que vayamos a iniciar nuestra aplicación con PM2. Para ello, ejecutaremos simplemente pm2 ecosystem

<img width="1202" height="154" alt="image" src="https://github.com/user-attachments/assets/ca0a9134-e779-4281-a6be-8d8831f328e6" />

Y con este comando ya nos habrá creado el archivo, por lo que ahora tocará configurarlo para nuestra aplicación. Para ello, ejecutaremos sudo nano ecosystem.config.js y pondremos el código que aparece a continuación:

<img width="1202" height="676" alt="image" src="https://github.com/user-attachments/assets/889e7b8a-d1aa-4b6d-8165-cc47fe55ca04" />

Y ahora, ejecutaremos pm2 start ecosystem.config.js y ya se nos ejecutaría nuestra aplicación sin necesidad de indicarle a PM2 que inicie la aplicación en "cluster_mode" (con la opción -i) y sin indicarle que genere x cantidad de workers.

<img width="1204" height="677" alt="image" src="https://github.com/user-attachments/assets/342aebcf-7af0-4d99-9e0d-e90f428568a1" />

---

Ahora, vamos a ejecutar varios comandos y veremos qué es lo que nos sale por la terminal:
1. pm2 ls: Al ejecutar este comando, nos sale básicamente la misma tabla que nos aparece cuando vamos a iniciar nuestra aplicación. O sea, que lo que nos sale es la lista de procesos gestionados por esta herramienta, su consumo, modo de ejecución, su estado…

<img width="1204" height="677" alt="image" src="https://github.com/user-attachments/assets/e0a13d4b-87df-45ce-93ef-3b77d02915dd" />


2. pm2 logs: Al ejecutar este comando, nos sale en tiempo real los logs de todos los procesos gestionados por PM2.

<img width="1204" height="677" alt="image" src="https://github.com/user-attachments/assets/f3c5f911-03a5-405b-ab68-cdb37ce6a73e" />

3. pm2 monit: Al ejecutar este comando, podemos monitorizar el uso de la CPU, memoria y estado de los procesos gestionados por PM2 mediante una interfaz.

<img width="1204" height="677" alt="image" src="https://github.com/user-attachments/assets/35583acc-189c-4c33-8dc6-402d3f0cf960" />

Finalmente, en el caso de que tengamos muchos procesos ejecutándose con PM2 y los queramos parar todos, podemos ejecutar pm2 stop all

<img width="1204" height="204" alt="image" src="https://github.com/user-attachments/assets/9b67ef18-a527-4c08-b440-1f387a2f3576" />
