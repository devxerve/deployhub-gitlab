# Théorie : Infrastructure d'un PaaS (Pôle A)

Bienvenue dans le moteur du PaaS ! Ce fichier t'explique à quoi sert chaque composant que nous allons installer. Le but est de démystifier tout ce jargon.

## 1. Docker & Docker-Compose (Le Terrain et l'Architecte)
- **Docker** : C'est ce qui nous permet d'isoler nos applications. Plutôt que d'installer une base de données, un serveur web et Node.js directement sur ton ordinateur (ce qui pourrait créer des conflits), on met chaque application dans une boîte étanche appelée "Conteneur".
- **Docker-Compose** : C'est le plan d'architecture. Au lieu de taper 10 commandes longues pour démarrer 10 conteneurs, on écrit un fichier `docker-compose.yml` qui dit : "Démarre la base de données, puis Traefik, et relie-les sur ce réseau". 

## 2. Le Réseau `paas_network` (Les Routes)
Les conteneurs sont isolés par défaut. Pour qu'ils puissent se parler (par exemple, pour que le Backend du Pôle B puisse parler à la base de données du Pôle C), il faut les connecter à un même "réseau virtuel". C'est notre `paas_network`. Tout conteneur qui n'y est pas connecté sera invisible pour les autres.

## 3. Traefik (Le Gardien et l'Aiguilleur)
Quand un utilisateur tape `app1.mondomaine.com` dans son navigateur, la requête arrive sur notre serveur (port 80 ou 443). 
Mais notre serveur héberge peut-être 10 applications (app1, app2, backend, grafana...). **Qui décide où envoyer la requête ?** C'est Traefik !
- C'est un **Reverse Proxy**. Il intercepte toutes les requêtes entrantes.
- Il lit l'URL (ex: `grafana.localhost`).
- Il regarde dans Docker s'il y a un conteneur qui possède l'étiquette (label) : "Je gère le domaine grafana.localhost".
- Si oui, il transfère la requête à ce conteneur.
- *Pourquoi Traefik plutôt que Nginx ?* Parce que Traefik "écoute" Docker. Quand le Pôle B déploie un nouveau conteneur, Traefik le détecte automatiquement et met à jour ses routes, sans qu'on ait besoin de redémarrer le routeur ! Magique.

## 4. PostgreSQL (Le Disque Dur Central - Pôle C)
C'est notre système de gestion de base de données relationnelle.
- **Rôle** : Il stocke de façon permanente (grâce aux "Volumes" Docker) les informations vitales : la liste des utilisateurs, leurs mots de passe (cryptés), et la liste des déploiements (en cours, réussis, échoués).
- **Sécurité** : Il ne sera pas accessible depuis l'extérieur (pas de port ouvert au public), seulement depuis le `paas_network`.

## 5. Prometheus (Le Récolteur de Données)
Un système en production a besoin d'être surveillé.
- **Rôle** : Prometheus est une base de données temporelle. Son seul but dans la vie est d'aller poser des questions toutes les X secondes : "Hey cAdvisor, combien de RAM utilise l'app1 à 14h00 ? Et à 14h01 ?".
- Il stocke toutes ces métriques sous forme de graphiques temporels.

## 6. cAdvisor (Le Capteur Docker)
- **Rôle** : Prometheus ne sait pas lire les données de Docker tout seul. Il a besoin d'un agent. `cAdvisor` (Container Advisor) lit la consommation CPU, RAM, et Réseau de chaque conteneur qui tourne sur la machine, et expose ces données sur une page web que Prometheus vient lire (scraper).

## 7. Grafana (Le Tableau de Bord)
Prometheus stocke les données, mais c'est moche à lire (juste des listes de chiffres).
- **Rôle** : Grafana se connecte à Prometheus, lit les données, et te permet de créer de superbes graphiques en temps réel (Jauges, Courbes, Camemberts). C'est ce qui te permet de dire : "Oh oh, l'app de l'utilisateur X prend 90% de la RAM, on a un problème".

---
*Si tu comprends ces 7 points, tu as compris 90% du travail d'un ingénieur DevOps sur l'infrastructure moderne !*
