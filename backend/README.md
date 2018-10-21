# starter-kit
Backend nodejs

>yarn install


##Configuración Node >= 9.10

  `cp .env.example .env`
  `nvm install 9.10`
  `nvm use 9.10`
  `npm install -g typescript typeorm-model-generator schemats typeorm ts-node `
  `docker-compose up -d`
   - Para acceder a pgadmin la ip/host debe ser postgres
  `yarn setup`


##Iniciar

  `yarn dev`


##typeorm

yarn migrations:generate --name BaseMigration
yarn migrations:run
yarn migrations:revert