# starter-kit
Backend nodejs

>yarn install


##Configuración Node >= 9.10

  `cp .env.example .env`
  `nvm install 9.10`
  `nvm use 9.10`
  `npm install -g typeorm-model-generator schemats`
  
   `docker-compose up -d`
   - Para acceder a pgadmin la ip/host debe ser la de la tarjeta de red 192.168.x.x o 10.10.x.x (No funciona localhost)
   - crear la base de datos ubicada en .env (Mysql o Postgres) 
   `yarn setup`


##Iniciar

  `yarn dev`