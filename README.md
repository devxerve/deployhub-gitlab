# transcendence

- Ver qué contenedores están corriendo

```bash
docker ps --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}"
```
- Parar y borrar TODOS los contenedores de prueba a la vez

```bash
docker stop $(docker ps -q) && docker rm $(docker ps -aq)
```

- El backend se lanza en el directorio services/backend con
```bash
npm run start:dev
```

- Cómo se prueba la parte de Giselle: user admin@deployhub.com y contraseña 1234

- Grafana: http://grafana.157.230.23.219.nip.io/

- Conectarse servidor Sam:
```bash
ssh root@157.230.23.219
```
