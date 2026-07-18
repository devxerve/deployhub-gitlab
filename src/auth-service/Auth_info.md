# Auth --> Gestión de usuarios

Vale, esta carpeta se encargará de gestionar los permisos de usuarios en las sesiones dependiendo del rol.

# Será un nuevo contenedor que deberá llevar también prisma con sus dependencias, pero, la diferencia es que apuntará unicamente a la tabla de usuarios.

Para esto plantearé el tipo de arquitectura stateless.
Y usaremos las JWT que guardan basicamente la información del usuario dueño de una sesión con sus permisos dentro de la misma, además de guardar las credenciales de acceso para poder conectarse a la sesión de forma segura.

# Estructura de los JWT (JSON Web Tokens)

Estos son simplementes una cadena de texto dividida en 3 partes separadas por puntos.

header.payload.signature

# header:
Especifica el tipo de token y el algoritmo de encriptación o firma que usaremos. HS256 o RS256
# payload:
Contiene los datos del usuario.
ID
Nombres y/o roles.
etc... Esta información va codificada en Base64, no encriptada. Por ello no guardamos contraseñas aqui.
# signature:
Es la parte más importante.
Se genera tomando el header codificado y pasandolos por el algoritmo especificado, garantizando la integridad de los datos del token en el camino.

# FLUJO DE AUTENTICACION --GEMINI--
----------------------------------
Inicio de sesión: El usuario envía sus credenciales (usuario y contraseña) al servidor.

Generación del token: El servidor verifica que las credenciales sean correctas. Si lo son, crea un JWT usando su clave secreta y se lo devuelve al cliente.

Almacenamiento en el cliente: El cliente (frontend) guarda este token (usualmente en localStorage, sessionStorage o en una HttpOnly Cookie).

Peticiones protegidas: Cada vez que el cliente quiera pedir datos protegidos (como el perfil del usuario), envía el JWT en los headers de la petición HTTP, usando el formato:

Authorization: Bearer <tu_token_jwt>

Validación en el servidor: El servidor recibe la petición, toma el JWT y verifica la firma usando su clave secreta. Si la firma coincide, el servidor "confía" en los datos del payload sin necesidad de ir a buscar a la base de datos y le entrega la información al usuario.
----------------------------------

Por ahora deje las dependencias descargadas y el proyecto npm inicializado.


npm install axios dotenv && npm install --save-dev @types/axios
