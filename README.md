# transcendence

- Ver qué contenedores están corriendo

```bash
docker ps --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}"
```
- Parar y borrar TODOS los contenedores de prueba a la vez

```bash
docker stop $(docker ps -q) && docker rm $(docker ps -aq)
```

- El backend se lanza  en el directorio \backend con
```bash
npm run start:dev
```
