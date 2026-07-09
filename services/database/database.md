Aqui pondre el schema de prisma que define los "Model" que son básicamente las tablas de la base de datos que prisma después traduce a código SQL.
A parte de tratar de crear la conexion como tal de la BBDD con el prisma cliente logrando así sustituir el "mock"(simulación) que hizo Claudia con los valores reales de la BBDD.

para esto entonces voy a tener que configurar el compose para trabajar con las redes internas de docker ya que me gustaria aislar la BBDD en una red que solo se tenga acceso desde el Backend y si grafana, necesito visualizar algo que le pida la información al backend. SABES.
_____
|- o|
| 3 |
-----
  | /
  |/
 /|
/ |
