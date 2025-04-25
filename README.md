# Ponto Eletrônico

> Sistema completo de marcação de ponto com gerenciamento de funcionários, cálculo automático de horas extras e banco de horas.

---

## 📂 Estrutura do Projeto

```
Ponto_Eletronico/
├── backend/           # API em Node.js + Express
│   ├── package.json
│   └── server.js
│
├── database/          # Banco de dados em arquivo JSON
│   └── data.json
│
└── frontend/          # Aplicação Web em React + Vite
    ├── public/
    │   ├── index.html
    │   └── screenshot.png  # captura de tela da aplicação
    ├── src/
    │   ├── pages/         # Páginas (Home, Dashboard, Ponto, etc.)
    │   ├── components/    # Componentes reutilizáveis
    │   ├── services/      # Serviços (axios configurado)
    │   └── App.jsx        # Componente raiz
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Tecnologias Utilizadas

| Camada      | Tecnologias                                  |
|-------------|-----------------------------------------------|
| **Frontend**| React · Vite · CSS Modules · Axios · React Router |
| **Backend** | Node.js · Express · body-parser · CORS · UUID  |
| **Banco**   | JSON file (`database/data.json`)              |
| **Deploy**  | Vercel (frontend) · Qualquer servidor Node.js  |

---

## ⚙️ Como Rodar o Projeto

1. **Clone o repositório**
   ```bash
   git clone https://github.com/DevCled85/Ponto_Eletronico.git
   cd Ponto_Eletronico
   ```

2. **Backend**
   ```bash
   cd backend
   npm install
   npm start  # servidor roda em http://localhost:5000
   ```

3. **Database**

   - O arquivo de dados fica em `database/data.json`.
   - Exemplo de estrutura:
     ```json
     {
       "funcionarios": [
         {
           "id": "uuid-v4",
           "nome": "Nome do Funcionario",
           "cargo": "Cargo",
           "matricula": "000123",
           "pontos": [
             {
               "data": "DD/MM/YYYY",
               "entrada": "HH:mm",
               "saida_intervalo": "HH:mm",
               "retorno_intervalo": "HH:mm",
               "saida": "HH:mm",
               "hora_extra": "HH:mm",
               "hora_devida": "HH:mm"
             }
           ]
         }
       ]
     }
     ```

4. **Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev  # abre em http://localhost:5173
   ```

   - Configure a variável de ambiente em `frontend/.env`:
     ```ini
     VITE_API_URL=http://localhost:5000
     ```

---

## 🔥 Funcionalidades Principais

- **CRUD de Funcionários**
  - Cadastro, listagem, edição e remoção de funcionários
- **Registro de Pontos**
  - Marcações de entrada, saída de intervalo e saída final
  - Cálculo automático de horas extras e horas devidas
- **Atualização em Tempo Real**
  - SSE (Server-Sent Events) para notificar novas marcações
- **Dashboard Interativo**
  - Cards com saldo de horas e agrupamento por cargo

---

## 📋 Endpoints da API

| Método | Rota                         | Descrição                                         |
|--------|------------------------------|---------------------------------------------------|
| GET    | `/funcionario`               | Lista todos os funcionários e seus registros      |
| POST   | `/funcionario`               | Cadastra novo funcionário                         |
| PATCH  | `/funcionario/:id`           | Atualiza dados do funcionário                     |
| DELETE | `/funcionario/:id`           | Remove um funcionário                             |
| POST   | `/funcionario/pontos/:id`    | Registra ponto para o funcionário                 |
| PATCH  | `/funcionario/pontos/reg/:id`| Atualiza registro e recalcula horas               |
| GET    | `/ponto_updates`             | SSE para notificações de marcação de pontos       |

---

## 🖼️ Captura de Tela (Frontend)

> Adicione sua própria screenshot em `frontend/public/screenshot.png`

![Tela Principal](/frontend/public/screenshot/Home.png)
![Tela Principal Websocket](/frontend/public/screenshot/Home_Websocket.png)
![Tela Cadastrar Funcionário](/frontend/public/screenshot/Cadastrar_funcionarios.png)
![Tela Dashboard](/frontend/public/screenshot/Dashboard_Filtrado.png)
![Tela Pesquisa Funcionário](/frontend/public/screenshot/Pesquisa_Funcionario.png)
![Tela Gerenciar Banco de Horas](/frontend/public/screenshot/Gerenciar_BancoHoras.png)

## Ponto Eletrônico Telas
![Tela Ponto Eletrônico](/frontend/public/screenshot/Ponto_Eletronico.png)
![Tela Ponto Eletrônico Logado](/frontend/public/screenshot/Ponto_Eletronico_Logado.png)
![Tela Ponto Eletrônico Registrado](/frontend/public/screenshot/Ponto_Eletronico_Registrado.png)


---

## 📝 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

