# Deploy com Docker + Node.JS

## Projetando o deploy
Ambiente de Desenvolvimento
- NGINX + Node.JS + Postgres

Ambiente de Produção (VPS)
- NGINX + Node.JS + Postgres

## NGINX e Hosts
[PULL NGINX](https://hub.docker.com/_/nginx/)

Vamos fazer o `docker pull nginx` e criar nosso `docker-compose.yml`

```bash
version: '3'

services:
  web:
    image: nginx
    ports:
    - "80:80"
  db:
    image: postgres
    restart: always
    environment:
      POSTGRES_PASSWORD: password
    volumes:
      - ./database:/var/lib/postgresql/data
    ports:
      - 5432
  my_app:
    image: paulorcvieira/app-dockerizada:latest
    build: .
    ports:
      - 3030
    depends_on:
      - db
```

Vamos criar nossa imagem e subir o docker-compose

```bash
$ docker-compose build
$ docker-compose up -d
$ docker container ls
```

## Postgres

Agora vamos pegar a porta do postgres, e no pgAdmin vamos criar um novo banco de dados com o nome `crud-node`

## Node.JS

Feito isso, precisamos lembrar que qualquer alteração feita no código após rodarmos o comando `docker-compose build` vamos precisar fazer os comandos abaixo

```bash
$ docker-compose down
$ docker-compose build
$ docker-compose up -d
```

## Ligando o NGINX
[nginx/app.conf](https://gist.github.com/jacksonpires/1b688a57fee2eac8cc1a9)

Agora vamos precisar alterar no `docker-compose.yml`

```bash
version: '3'

services:
  web:
    image: nginx
    volumes:
      - ./nginx/app.conf:/etc/nginx/nginx.conf
    depends_on:
      - my_app
    ports:
    - 80:80
  db:
    image: postgres
    restart: always
    environment:
      POSTGRES_PASSWORD: password
    volumes:
      - ./database:/var/lib/postgresql/data
    ports:
      - 5432
  my_app:
    image: paulorcvieira/app-dockerizada:latest
    build: .
    depends_on:
      - db
```

Pronto agora já podemos acessar `http://localhost`


## Publicando na Digital Ocean

Primeiramente precisamos criar uma conta, após isso vamos gerar um par de chaves SSH

```bash
$ ssh-keygen -t rsa -b 4096 -C "exemple_email@exemple.com"
```

Vamos enviar para o `github`

```bash
$ git init
$ git add .
$ git commit -m "My Docker Project"
```

Vamos criar um repositório no `github` com o mesmo nome do nosso projeto, e copiar as instruções em "...or push an existing repository from the command line"

```bash
$ git remote add origin https://github.com/<github_username>/deploy-docker-node.git
$ git push origin master
```

Vamos copiar a chave pública

```bash
$ cat ~/.ssh/id_rsa.pub
```

Agora precisa acessar a Digital Ocean e criar um droplet com docker
Ps. não esquecer da chave ssh
Podemos escolher uma maquina pronta em "One-click apps" e escolher uma máquina com docker
Colar a nossa chave em "New SSH Key" e criamos nossa máquina
Agora podemos logar via SSH

```bash
$ ssh root@ip_digital_ocean
```

Dentro do servidor vamos verificar se esta ativo o firewall e desativar para desbloquear as portas

```bash
$ ufw disable
```

Ou podemos liberar porta por porta, por exemplo

```bash
$ ufw allow 80/tcp
```

Agora precisamos clonar nosso repositório dentro do nosso servidor

```bash
$ git clone https://github.com/<github_username>/deploy-docker-node.git
$ ll
```

Agora precisamos primeiramente fazer o build e depois subir nossa app

```bash
$ docker-compose build
$ docker-compose up -d
$ docker container ls
```

Agora precisamos criar o `crud-node`, que será nosso banco de dados, para isso vamos entrar com nosso dados no pgAdmin com o IP da Digital Ocean e criar nosso banco de dados

Feito isso podemos acessar o IP da nossa máquina na Digital Ocean atravez do nosso browser

#### Workflow Básico
- Desenvolver em sua máquina local `.env=development`
- Faz um commit para o repositório (github)
- Faz um pull no servidor
- Alterar o `.env=production`
- Fazer um buil
- Derruba com o `docker-compose down` e levanta com o `docker-compose up -d`

# Pronto ;)

## Considerações Finais