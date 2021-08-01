# Producer

Aplicação em Node.js que atua como producer

Antes de iniciar a aplicação do consumer, certifique-se de o kafka está sendo executado ( execute `docker-compose up`).

Para instalar os pacotes:
```
yarn install
```
Para iniciar a aplicação:
```
yarn dev
```

Para enviar uma mensagem (e a aplicação publicar esta mensagem em um tópico), basta enviar uma requisição para `localhost:3333/send` e no corpo da requisição utilizar o campo `inputMessage` informando "retry" para mensagens que poderão ser processadas e "noretry" para mensagens que não poderão ser processadas.