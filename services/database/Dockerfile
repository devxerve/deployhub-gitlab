FROM postgres:15

# Si necesitas ejecutar scripts SQL al iniciar la base de datos por primera vez, 
# se copian a la carpeta docker-entrypoint-initdb.d
# PostgreSQL los ejecutará en orden alfabético antes de levantar el servicio.
COPY init.sql /docker-entrypoint-initdb.d/

# Opcional: puedes exponer el puerto 5432, aunque por defecto la imagen de postgres ya lo hace.
EXPOSE 5432
