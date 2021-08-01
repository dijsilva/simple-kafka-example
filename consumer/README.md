# Consumer

Aplicação em Node.js que atua como Consumer

Antes de iniciar a aplicação do consumer, certifique-se de o kafka está sendo executado ( execute `docker-compose up`) e que a aplicação que atuará como producer também está sendo executada.

Para instalar os pacotes:
```
yarn install
```
Para iniciar a aplicação:
```
yarn dev
```

- O consumer tentará ler processar a mensagem 3 vezes antes de restartar (a decisão de restartar ou não foi definida no consumer - restartOnFailure)
- Haverá novas tentativas de processamento das mensagens caso a mensagem seja possível de ser processada. Caso não seja, a aplicação lançara um erro informando que a mensagem foi enviada incorretamente (algum tipo de validação quanto aos campos, ou alguma informação específica etc) e nesse caso, enviará a mensagem para uma dead letter queue.