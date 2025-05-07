# 🐳 Examen Dockerizado - Proyecto

Este proyecto está compuesto por un **frontend** y un **backend** que interactúan con una base de datos PostgreSQL. Todos los componentes están containerizados usando **Docker** y **Docker Compose** para facilitar la implementación y despliegue en cualquier servidor.

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

## 📋 Descripción del Proyecto

Este proyecto contiene tres servicios principales:

1. **Frontend (app_frontend)**: Un servidor Nginx que aloja la interfaz de usuario (usualmente en React o Angular).
2. **API (app_api)**: Un backend en Python utilizando Flask que proporciona una API RESTful.
3. **Base de Datos (app_db)**: PostgreSQL como base de datos para la aplicación.

## 🚀 Requisitos previos

Antes de comenzar, asegúrate de tener instalados los siguientes programas:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## 🔧 Cómo configurar y ejecutar el proyecto

### 1. Clona el repositorio

Primero, clona el repositorio donde se encuentra el proyecto:

```bash
git clone https://github.com/Kussun-rd/examen02.git
cd examen02
```

### 2. Construir y levantar los contenedores

Ejecuta el siguiente comando para construir las imágenes de Docker y levantar los contenedores:

```bash
docker-compose up -d --build
```

Este comando realizará lo siguiente:
- Construirá las imágenes para el frontend y el backend si es necesario.
- Levantará los contenedores en segundo plano (-d significa detached mode).
- Conectará los servicios entre sí a través de una red interna.

### 3. Verifica que los contenedores están corriendo

Puedes verificar que todos los contenedores están corriendo con:

```bash
docker ps
```

Esto debería mostrarte una salida similar a la siguiente, con los puertos asignados:

```
CONTAINER ID   IMAGE               COMMAND                  CREATED          STATUS          PORTS                                               NAMES
733d97ef254f   examen02_frontend   "/docker-entrypoint.…"   20 minutes ago   Up 20 minutes   80/tcp, 0.0.0.0:4000->4000/tcp, :::4000->4000/tcp   app_frontend
750da7559cd1   examen02_api        "python app.py"          29 minutes ago   Up 29 minutes   0.0.0.0:8000->8000/tcp, :::8000->8000/tcp           app_api
4a1cfebd64b6   postgres:13         "docker-entrypoint.s…"   29 minutes ago   Up 29 minutes   0.0.0.0:5432->5432/tcp, :::5432->5432/tcp           app_db
```

### 4. Accede a la aplicación

- **Frontend**: Accede al frontend en el navegador en `http://<tu-ip-publica>:4000`.
- **Backend**: La API está corriendo en `http://<tu-ip-publica>:8000`.

*Nota: Asegúrate de reemplazar `<tu-ip-publica>` por la IP de tu servidor en AWS.*

## 📊 Monitoreo y Depuración

### Verifica los logs de los contenedores

Si experimentas algún problema con el frontend o el backend, puedes revisar los logs de los contenedores:

```bash
docker-compose logs app_frontend
docker-compose logs app_api
```

Esto te dará más detalles sobre cualquier error que pueda estar ocurriendo.

## ⚙️ Variables de entorno

Si necesitas configurar variables de entorno para la API o el frontend, puedes hacerlo en el archivo `.env`. Por ejemplo:

```
DATABASE_URL=postgres://user:password@db:5432/mydatabase
SECRET_KEY=mysecretkey
```

Este archivo es utilizado para almacenar credenciales y configuraciones sensibles, y puede ser cargado automáticamente en los contenedores con Docker Compose.

## 🛑 Cómo detener los contenedores

Si deseas detener los contenedores sin eliminar las imágenes, puedes usar el siguiente comando:

```bash
docker-compose down
```

Esto detendrá y eliminará los contenedores, pero mantendrá las imágenes y volúmenes.

### Limpiar completamente

Para eliminar todos los contenedores, imágenes y volúmenes, usa el siguiente comando:

```bash
docker-compose down --volumes --rmi all
```

## ⚠️ Problemas comunes

### 1. Puerto ya en uso

Si ves un error relacionado con puertos ocupados, puedes verificar los puertos en uso con:

```bash
sudo lsof -i :8000
sudo lsof -i :4000
```

Si un puerto está en uso, puedes liberarlo o cambiar la configuración del puerto en el archivo `docker-compose.yml`.

### 2. Errores de permisos

Asegúrate de que Docker tiene los permisos adecuados para acceder a los archivos de tu proyecto.

## 📚 Recursos adicionales

- [Documentación oficial de Docker](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
