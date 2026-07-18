-- Este script se ejecutará automáticamente la primera vez que se cree el volumen de la base de datos.
-- Puedes usarlo para crear extensiones, roles adicionales, o datos semilla (seed data).

-- Nota: La creación de la base de datos principal y el usuario principal se maneja 
-- a través de las variables de entorno de Docker (POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB),
-- por lo que no es estrictamente necesario crearlos aquí.

-- Ejemplo: Habilitar una extensión útil como 'uuid-ossp' por si usas UUIDs en el futuro:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Puedes añadir más configuraciones aquí si la aplicación crece.
