const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const server = express();
const PORT = 5000;

// Middleware
server.use(cors({
    // origin: ['http://192.168.100.18:5173', 'http://localhost:5173'],
    // methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    // allowedHeaders: ['Content-Type', 'Authorization'],
    // credentials: true 
}));

server.use(bodyParser.json());

// Caminho do banco de dados
const dbPath = path.resolve(__dirname, '..', 'database/data.json');

// Função para ler o banco de dados
const lerBancoDados = () => {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify({ funcionarios: [] }, null, 2));
    }

    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
}

// Função para gravar no banco de dados
const gravarBancoDados = (data) => {
    if (!data.funcionarios) {
        throw new Error("Formato de banco de dados inválido.");
    }

    data.funcionarios.sort((a, b) => a.id - b.id);

    // cache.set('db', data);

    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Função para deletar registros do dia 24/01/2025 ou data que quiser
const deletarRegistrosDataEspecifica = () => {
    const db = lerBancoDados();
    db.funcionarios.forEach(funcionario => {
        funcionario.pontos = funcionario.pontos.filter(ponto => ponto.data !== "24/01/2025");
    });
    gravarBancoDados(db);
}
// deletarRegistrosDataEspecifica();

// Rota para buscar todos os funcionários
server.get('/funcionario', (req, res) => {
    const db = lerBancoDados();
    res.json(db);
});

// Rota para cadastrar novo funcionário
server.post('/funcionario', (req, res) => {
    const { nomeFuncionario, cargoFuncionario, matriculaFuncionario } = req.body;

    if (!nomeFuncionario || !cargoFuncionario || !matriculaFuncionario) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const db = lerBancoDados();
    const novoCadastro = {
        id: uuidv4(),
        nome: nomeFuncionario,
        cargo: cargoFuncionario,
        matricula: matriculaFuncionario,
        pontos: []
    };

    db.funcionarios.push(novoCadastro);
    gravarBancoDados(db);
    res.status(201).json({ message: 'Funcionário cadastrado com sucesso!' });
});

// Rota para remover funcionário
server.delete('/funcionario/:id', (req, res) => {
    const id = req.params.id;

    let db = lerBancoDados();
    const funcionarioRemovido = db.funcionarios.find(func => func.id === id);

    if (!funcionarioRemovido) {
        return res.status(404).json({ message: 'Funcionário não encontrado.' });
    }

    db.funcionarios = db.funcionarios.filter(func => func.id !== id);
    gravarBancoDados(db);

    res.status(200).json({ message: `Funcionário ${funcionarioRemovido.nome} removido com sucesso!` });
});

// Rota para atualizar funcionário
server.patch('/funcionario/:id', (req, res) => {
    const { nome, cargo, matricula } = req.body;
    const id = req.params.id;

    let db = lerBancoDados();
    const funcionario = db.funcionarios.find(func => func.id === id);

    if (!funcionario) {
        return res.status(404).json({ message: 'Funcionário não encontrado.' });
    }

    funcionario.nome = nome || funcionario.nome;
    funcionario.cargo = cargo || funcionario.cargo;
    funcionario.matricula = matricula || funcionario.matricula;

    gravarBancoDados(db);
    res.status(200).json({ message: 'Cadastro atualizado com sucesso!' });
});

// Mapa para armazenar os registros do minuto atual
let registrosMinutoAtual = [];

// Função para limpar registros a cada minuto
setInterval(() => {
    registrosMinutoAtual = [];
}, 60000); // Limpa a cada minuto

// Rota para registrar ponto
server.post('/funcionario/pontos/:id', (req, res) => {
    const dados = req.body;
    const id = req.params.id;

    const weekday = 'sábado';
    const [dia, mes, ano] = dados.data.split('/');
    const dt = `${mes}/${dia}/${ano}`;
    const formatadaData = new Date(dt);
    const semana = formatadaData.toLocaleDateString('pt-BR', { weekday: 'long' });

    let newData;

    if (semana === weekday) {
        // Excluindo `saida_intervalo` e `retorno_intervalo` para o sábado
        const { saida_intervalo, retorno_intervalo, ...resto } = dados;
        newData = {
            ...resto,
            hora_extra: "00:00",
            hora_devida: "04:00"
        }
    } else {
        newData = {
            ...dados,
            hora_extra: "00:00",
            hora_devida: "08:00"
        }
    }

    try {
        const db = lerBancoDados();
        const funcionario = db.funcionarios.find(func => func.id === id);
        const funcionarioAtual = funcionario.pontos;
        const registroCorrente = funcionarioAtual.find(func => func.data === req.body.data);

        if (!registroCorrente) {
            funcionarioAtual.push(newData);
        }

        gravarBancoDados(db);

        // Adiciona o registro ao array do minuto atual
        const novoRegistro = {
            id: Date.now(),
            message: `${funcionario.nome} acabou de registrar o ponto de entrada às ${newData.entrada}`,
            timestamp: new Date().toLocaleTimeString()
        };

        registrosMinutoAtual.push(novoRegistro);

        // Envia todos os registros do minuto atual
        const mensagem = {
            type: 'ponto_registrado',
            registros: registrosMinutoAtual
        };

        // Enviar para todos os clientes conectados
        clients.forEach(client => client(JSON.stringify(mensagem)));

        res.status(200).json({ message: 'Registro salvo com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar registro.', error);
        res.status(500).json({ message: 'Erro interno no servidor' });
    }
});

// Rota para atualizar registros e calcular horas extras e devidas
server.patch('/funcionario/pontos/reg/:id', (req, res) => {
    const dados = req.body;
    const id = req.params.id;

    const horaParaMinuto = (hora) => {
        const [h, m] = hora.split(':').map(Number);
        return h * 60 + m;
    }

    try {
        const db = lerBancoDados();
        const funcionarioAtual = db.funcionarios.find(func => func.id === id);
        if (!funcionarioAtual) {
            return res.status(404).json({ message: 'Funcionário não encontrado.' });
        }

        const registrosCorrente = funcionarioAtual.pontos.find(ponto => ponto.data === req.body.data);
        if (!registrosCorrente) {
            return res.status(404).json({ message: 'Registro de ponto não encontrado.' });
        }

        registrosCorrente[dados.registro] = dados.hora;

        const calcExtraDevida = () => {
            const weekday = 'sábado';
            const [dia, mes, ano] = dados.data.split('/');
            const dt = `${mes}/${dia}/${ano}`;
            const formatadaData = new Date(dt);
            const semana = formatadaData.toLocaleDateString('pt-BR', { weekday: 'long' });

            let totalMinutosTrabalhados = 0;

            const minutosParaHora = (minutos) => {
                const h = Math.floor(minutos / 60).toString().padStart(2, '0');
                const m = (minutos % 60).toString().padStart(2, '0');
                return `${h}:${m}`;
            }

            if (semana === weekday) {
                // logica para os dias de Sábado
                const entrada = registrosCorrente?.entrada;
                const saida = registrosCorrente?.saida;

                if (entrada && saida) {
                    totalMinutosTrabalhados += horaParaMinuto(saida) - horaParaMinuto(entrada);
                }

                const jornadaPadrao = 4 * 60;
                let hora_extra = totalMinutosTrabalhados > jornadaPadrao ? totalMinutosTrabalhados - jornadaPadrao : 0;
                let hora_devida = totalMinutosTrabalhados < jornadaPadrao ? jornadaPadrao - totalMinutosTrabalhados : 0;

                registrosCorrente["hora_extra"] = minutosParaHora(hora_extra);
                registrosCorrente["hora_devida"] = minutosParaHora(hora_devida);
            } else {

                const entrada = registrosCorrente?.entrada;
                const saida_intervalo = registrosCorrente?.saida_intervalo;
                const retorno_intervalo = registrosCorrente?.retorno_intervalo;
                const saida = registrosCorrente?.saida;

                if (entrada && saida_intervalo) {
                    totalMinutosTrabalhados += horaParaMinuto(saida_intervalo) - horaParaMinuto(entrada);
                }
                if (retorno_intervalo && saida) {
                    totalMinutosTrabalhados += horaParaMinuto(saida) - horaParaMinuto(retorno_intervalo);
                }

                const jornadaPadrao = 8 * 60;
                let hora_extra = totalMinutosTrabalhados > jornadaPadrao ? totalMinutosTrabalhados - jornadaPadrao : 0;
                let hora_devida = totalMinutosTrabalhados < jornadaPadrao ? jornadaPadrao - totalMinutosTrabalhados : 0;

                registrosCorrente["hora_extra"] = minutosParaHora(hora_extra);
                registrosCorrente["hora_devida"] = minutosParaHora(hora_devida);
            }
        };

        calcExtraDevida();
        gravarBancoDados(db);

        // Adiciona o registro ao array do minuto atual
        const novoRegistro = {
            id: Date.now(),
            message: `${funcionarioAtual.nome} acabou de registrar o ponto de ${dados.registro} às ${dados.hora}`,
            timestamp: new Date().toLocaleTimeString()
        };

        registrosMinutoAtual.push(novoRegistro);

        // Envia todos os registros do minuto atual
        const mensagem = {
            type: 'ponto_registrado',
            registros: registrosMinutoAtual
        };

        clients.forEach(client => client(JSON.stringify(mensagem)));

        res.status(200).json({ message: 'Registro salvo com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar registro.', error);
        res.status(500).json({ message: 'Erro interno no servidor' });
    }
});

// Adicionar middleware de validação
const validarFuncionario = (req, res, next) => {
    const { nomeFuncionario, cargoFuncionario, matriculaFuncionario } = req.body;
    if (!nomeFuncionario?.trim() || !cargoFuncionario?.trim() || !matriculaFuncionario?.trim()) {
        return res.status(400).json({ message: 'Campos inválidos ou vazios.' });
    }
    next();
};

// Adicionar cache para melhorar performance
const cache = new Map();
const lerBancoDadosComCache = () => {
    if (cache.has('db')) return cache.get('db');
    const db = lerBancoDados();
    cache.set('db', db);
    return db;
};

// Mapa para armazenar as conexões dos clientes
const clients = new Map();

// Adicionar endpoint para SSE (Server-Sent Events)
// server.get('/ponto_updates', (req, res) => {
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Connection', 'keep-alive');
//     res.setHeader('Access-Control-Allow-Origin', 'http://192.168.100.18:5173');

//     // Manter a conexão viva
//     const intervalId = setInterval(() => {
//         res.write('data: ping\n\n');
//     }, 30000);

//     // Função para enviar atualização aos clientes
//     const sendUpdate = (dados) => {
//         res.write(`data: ${dados}\n\n`);
//     };

//     // Adicionar este cliente à lista de conexões
//     const clientId = Date.now();
//     clients.set(clientId, sendUpdate);

//     // Limpar quando o cliente desconectar
//     req.on('close', () => {
//         clients.delete(clientId);
//         clearInterval(intervalId);
//         res.end();
//     });
// });

server.get('/ponto_updates', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // res.setHeader('Access-Control-Allow-Origin', 'http://192.168.100.18:5173');
    res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    // Mantendo a conexão viva
    const intervalId = setInterval(() => {
        res.write('data: ping\n\n');
    }, 30000);

    // Adicionando este cliente à lista de conexões
    const clientId = Date.now();
    const sendUpdate = (dados) => {
        res.write(`data: ${dados}\n\n`);
    };

    clients.set(clientId, sendUpdate);

    // Limpando quando o cliente desconectar
    req.on('close', () => {
        clients.delete(clientId);
        clearInterval(intervalId);
        res.end();
    });
});

// MOVER ESTE MIDDLEWARE PARA O FINAL
// Este middleware deve ser o último, após todas as outras rotas
server.use((req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

server.listen(PORT, '0.0.0.0', () => console.log('Servidor rodando na porta 5000'));
