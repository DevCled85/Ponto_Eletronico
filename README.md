# Ponto Eletrônico

## Introdução 

> O Ponto Eletrônico é um sistema web completo de marcação de ponto e gerenciamento de funcionários. Ele permite registrar entradas, saídas de intervalo e saídas finais, além de calcular automaticamente horas extras e devidas e manter um banco de horas​. A aplicação conta com telas dedicadas para listar funcionários, filtrar situações de trabalho, cadastrar novos colaboradores e visualizar relatórios de ponto.

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
| **Deploy**  | Opcional: Vercel (frontend) · Qualquer servidor Node.js  |

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

## 🖼️ Descrição de cada tela (Frontend)

<!-- > Adicione sua própria screenshot em `frontend/public/screenshot.png` -->
### Home (Resumo Administrativo)
> A tela inicial apresenta um resumo executivo do estado atual dos funcionários e suas horas acumuladas. Ela exibe a data atual e diversos indicadores: uma lista de cargos agrupados (que expande informações sobre cada cargo), a lista de funcionários com maiores horas extras e devedoras (banco de horas) e um painel de “situação do momento” (situação funcional). Cada item é clicável para abrir detalhes adicionais. Por exemplo, ao clicar em “Lista dos Maiores Banco de horas”, aparece um quadro (BoxBancoHoras) mostrando funcionários como “Ana Silva, Desenvolvedora – Banco: +02:15”. A experiência é informativa: o gestor vê de relance quem tem mais horas acumuladas e pode navegar nas caixas de informação.
> 
> Função: Dashboard geral; resume métricas de ponto por cargo e funcionário.
>
> Exemplo de dados: Cargos cadastrados: “Desenvolvimento”, “Suporte”, “RH”; Funcionários no topo: > “João Pereira – Banco: +03:45”, “Maria Oliveira – Devido: 00:30” (dados fictícios).
![Tela Principal](/frontend/public/screenshot/Home.png)

![Tela Principal Websocket](/frontend/public/screenshot/Home_Websocket.png)
---
### Cadastro de Funcionários

> Esta tela permite cadastrar, listar, editar e deletar funcionários (CRUD completo)​
> O usuário encontra um formulário simples com campos Nome, Cargo e Matrícula. Após preencher e clicar em Cadastrar, o funcionário é salvo e listado em uma tabela abaixo do formulário. Por exemplo, pode-se cadastrar “Carlos Souza” como cargo “Analista” e matrícula “000123”. A tabela mostra colunas Nome, Matrícula e Cargo, com botões de Editar e Deletar para cada linha. Se o usuário tentar cadastrar uma matrícula já existente, aparece um alerta de aviso. Em resumo, a tela de cadastro oferece uma experiência de formulário tradicional, com validação básica (todos os campos obrigatórios) e feedback de sucesso/erro na criação de registros.
>
> Função: Manutenção do cadastro de funcionários (criar, visualizar, editar, remover).
>
> Exemplo de dados: Funcionários cadastrados no sistema: “Ana Ferreira, Matrícula 000101, Cargo Desenvolvedora”, “Miguel Lima, Matrícula 000102, Cargo Suporte”. A tabela exibiria esses registros com opções de edição/exclusão.
![Tela Cadastrar Funcionário](/frontend/public/screenshot/Cadastrar_funcionarios.png)
---

### Dashboard (Visão Geral por Funcionário)
> No Dashboard, cada funcionário é exibido em um cartão que resume seu estado atual no dia selecionado. No topo, uma data pode ser selecionada (clicando na data atual abre um calendário) para filtrar por dia específico. Abaixo, há filtros rápidos de situação, exibindo quantos funcionários estão “Trabalhando”, em “Intervalo”, “Ausentes” ou “Fora do expediente”. Por exemplo, ao clicar em Intervalo (filtro amarelo), apenas os cartões desses funcionários ficam visíveis. Cada cartão contém: o nome completo do funcionário (e.g. “João Silva”), cargo e matrícula, e a sua situação atual (“Trabalhando” em verde, “Intervalo” em amarelo, etc.). Um gráfico de progresso e texto indicam tempo trabalhado: p. ex., “+00:45” horas extras ou “-01:15” hora devida. A seção principal do card detalha os horários daquele dia (Entrada, Saída Intervalo, Retorno Intervalo, Saída). Campos preenchidos aparecem em destaque (ex.: Entrada: 08:00); campos não registrados ainda aparecem esmaecidos. A experiência do usuário é interativa e visual: o gestor rapidamente identifica quem está trabalhando ou em falta.
>
> Função: Listar funcionários com status de ponto diário, filtragem por situação e data.
>
> Experiência: Visão em cards coloridos, com barras de progresso mostrando o cumprimento da jornada. Por exemplo, um cartão poderia mostrar “Funcionário: Maria Santos – Cargo: Analista | Matrícula: 000123 – Trabalhando (em verde) – +01:20”, e abaixo os horários do dia (Entrada: 09:00, Saída: –, etc.).   
![Tela Dashboard](/frontend/public/screenshot/Dashboard_Filtrado.png)
---

### Gerenciamento de Ponto (RH)
> Na tela de Gerenciar (RH), o usuário pode buscar um funcionário pelo nome, cargo ou matrícula usando a barra de pesquisa. Enquanto digita, aparece uma tabela de resultados dinâmicos. Por exemplo, ao buscar “João”, surgem linhas como “João Pereira | 000123 | Desenvolvedor”. 
![Tela Pesquisa Funcionário](/frontend/public/screenshot/Pesquisa_Funcionario.png)
> 
> Clicando em um resultado, abre-se uma tabela completa de registros de ponto daquele funcionário (datas e horários). Essa tabela lista Data, Dia da Semana, Entrada, Saída Intervalo, Retorno Intervalo, Saída, Hora Extra, Hora Devida para cada dia do mês. Cada célula de horário é clicável: ao clicar em um campo vazio (ex.: Saída do intervalo em dias úteis), o sistema registra o horário atual naquele ponto (via API). Horas extras/devidas são destacadas (e.g., “01:15” em fundo verde claro se hora extra, “00:30” em vermelho claro se hora devida). Abaixo da tabela, há um resumo de totais: “Horas Trabalhadas”, “Horas Extras Totais”, “Horas Devedoras” e “Banco de Horas”. Por exemplo, após registros para o mês, pode-se ver “Horas Extras: 05:30”, “Horas Devidas: 02:15”, “Banco de Horas: +03:15”.
>
> Função: Ferramenta do RH para visualizar e ajustar registros de ponto por funcionário.
>
> Experiência: Busca ágil e tabela detalhada. Exemplo fictício: pesquisar “Maria Silva” retorna seus registros; clicar em Saída registra o horário atual. O sistema calcula automaticamente as horas extras e devidas no final de cada linha.
![Tela Gerenciar Banco de Horas](/frontend/public/screenshot/Gerenciar_BancoHoras.png)
----

## Ponto Eletrônico (Registro de Ponto pelo Funcionário)

> Esta funcionalidade permite que o próprio funcionário registre o ponto. Na tela inicial do ponto, o usuário vê a data atual e um campo para digitar sua matrícula. Por exemplo, a tela pergunta “Matrícula:” com um input numérico.
![Tela Ponto Eletrônico](/frontend/public/screenshot/Ponto_Eletronico.png)
>
> Após inserir, digamos, “000123” e clicar em Verificar funcionário, o sistema checa no banco de dados. Se encontrado (ex.: “João Silva – Analista”), o funcionário é direcionado à tela de registro (abaixo). 
![Tela Ponto Eletrônico Logado](/frontend/public/screenshot/Ponto_Eletronico_Logado.png)
>
> Se não existir, exibe alerta de “Funcionário não encontrado”. Na tela de registro de ponto, o funcionário vê seu nome e a data atual no topo. Há um relógio atualizando com o horário corrente (e.g. “08:45”), e um grande botão Registrar (enquanto houver registros pendentes). Ao clicar em Registrar (ou pressionar Enter), o sistema salva o próximo registro de ponto: se for a primeira marcação do dia, registra a Entrada (por exemplo, “Entrada: 08:45” aparece no quadro). Em seguida, o mesmo funcionário poderá registrar “Saída Intervalo”, “Retorno Intervalo” e “Saída”, em cliques subsequentes. Após cada clique, aparece uma etiqueta de sucesso (ex.: “Entrada registrada com sucesso!”) e o campo correspondente é preenchido no rodapé.
>
> Função: Receber as marcações de ponto diárias dos funcionários.
>
> Experiência: Interface simples e focada. Exemplo de fluxo: “Maria Souza digita matrícula 000456 → confirma → vê seu nome e o horário corrente (e.g., 09:00) → clica em Registrar → o campo Entrada: 09:00 aparece, indicando que a marcação foi salva.” A cada nova marcação a tela avisa e mostra o horário registrado no rodapé (padronizado HH:mm).
![Tela Ponto Eletrônico Registrado](/frontend/public/screenshot/Ponto_Eletronico_Registrado.png)

---

## 📝 Licença

Este projeto está licenciado sob a MIT License. Sinta-se livre para usar, modificar e distribuir o código conforme os termos da licença MIT [MIT License](LICENSE).

Fontes: Documentação e estrutura do projeto obtidas no repositório original​ [github.com](https://github.com/DevCled85/Ponto_Eletronico)


