[x] Deve ser possível criar um usuário

- POST /users

[x] Deve ser possível identificar o usuário entre as requisições

- cookies

[x] Deve ser possível registrar uma refeição feita, com as seguintes informações

- POST /meals

_As refeições devem ser relacionadas a um usuário (cookies)_

- id (uuid)
- Nome (title -> string)
- Descrição (description -> string)
- Data e hora (created_at | datetime -> string)
- Está dentro ou não da dieta
  -> Recebe do front como yes / no, pode ser um enum

[] Deve ser possível editar uma refeição, podendo alterar TODOS os dados acima

- PUT /meals/:id

[] Deve ser possível apagar uma refeição

- DELETE /meals/:id

[] Deve ser possível listar todas as refeições de um usuário

- GET /meals
- cookies to id user

[] Deve ser possível visualizar uma única refeição

- GET /meals/:id

[] Deve ser possível recuperar as métricas de um usuário:

[] Quantidade total de refeições

- GET /meals sum

[] Quantidade total de refeições dentro da dieta

- GET /meals -> sum enum yes

[] Quantidade total de refeições fora da dieta

- GET /meals -> sum enum no

[] Melhor sequência de refeições dentro da dieta

[] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou

- Validação dos cookies em todas as rotas
