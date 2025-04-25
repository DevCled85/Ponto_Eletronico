import { api } from "../../../services/api";

async function SistemFuncPonto_saidaIntervalo() {
    const response = await api.get('/funcionario');
    const dados = response.data.funcionarios;

    // Filtrar os funcionários que não tem ponto no dia atual
    const funcFiltradoAusente = dados.filter(func => !func.pontos.some(ponto => ponto.data === new Date().toLocaleDateString('pt-BR'))).map(func => func.id);
    // funcFiltradoAusente.push('84398205-e092-41d7-bea6-58fe6a9022a5'); // adiciona o id do funcionario cledson

    // Filtrar o funcionário com o ID específico
    const funcionariosFiltrados_saidaIntervalo = dados.filter(
        // funcionario => !funcFiltradoAusente.includes(funcionario.id)
        funcionario => funcionario.id !== "84398205-e092-41d7-bea6-58fe6a9022a5" // Cledson
    );

    // Total de funcionários restantes
    const totalFuncionarios = funcionariosFiltrados_saidaIntervalo.length;

    // Calcular o corte de minutos para o início e limite do horário
    const minutosParaCorteHoraInicial_saidaIntervalo = totalFuncionarios / 5;

    const hoursLimit = 12;

    // Hora inicial
    const horaInicial_saidaIntervalo = new Date();
    horaInicial_saidaIntervalo.setHours(hoursLimit, - minutosParaCorteHoraInicial_saidaIntervalo, 0);

    // Hora limite
    const horaLimite_saidaIntervalo = new Date();
    horaLimite_saidaIntervalo.setHours(hoursLimit, minutosParaCorteHoraInicial_saidaIntervalo, 0);

    // Gerar horários para cada funcionário
    const horariosFuncionarios_saidaIntervalo = funcionariosFiltrados_saidaIntervalo.map(funcionario => {
        const horario_saidaIntervalo = new Date(horaInicial_saidaIntervalo.getTime());
        const minutosAleatorios_saidaIntervalo = Math.floor(Math.random() * (minutosParaCorteHoraInicial_saidaIntervalo * 2 + 1));
        horario_saidaIntervalo.setMinutes(horaInicial_saidaIntervalo.getMinutes() + minutosAleatorios_saidaIntervalo);

        return {
            ...funcionario,
            horario: horario_saidaIntervalo
        };
    });

    console.log("Horários gerados Saida-Intervalo:", horariosFuncionarios_saidaIntervalo.sort((a, b) => a.horario - b.horario));

    // Função para registrar o ponto no horário correto
    for (const funcionario of horariosFuncionarios_saidaIntervalo) {
        const delay = funcionario.horario - new Date(); // Tempo em milissegundos até o horário do ponto

        // console.log(funcionario);
        
        if (delay > 0) {
            setTimeout(async () => {
                // Verificar se já foi registrado
                // const responsePontos = await api.get(`/funcionario/pontos/${funcionario.id}`);
                // const pontosRegistrados = responsePontos.data.pontos;
                // const jaTemPontoHoje = pontosRegistrados.some(ponto => ponto.data === funcionario.horario.toLocaleDateString('pt-BR') && ponto.registro === 'saida_intervalo');
                // console.log(responsePontos);

                // if (!jaTemPontoHoje) {
                    // Formatar horário para HH:MM
                    const horarioFormatado = funcionario.horario.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                    });

                    const registro = {
                        data: funcionario.horario.toLocaleDateString('pt-BR'),
                        registro: 'saida_intervalo',
                        hora: horarioFormatado,
                    };

                    try {
                        // Enviar ao backend
                        await api.patch(`/funcionario/pontos/reg/${funcionario.id}`, registro);
                        console.log(`Ponto registrado Saida-Intervalo: ${funcionario.nome} às ${horarioFormatado}`);
                    } catch (error) {
                        console.error(`Erro ao registrar ponto de Saida-Intervalo ${funcionario.nome}:`, error);
                    }
                // } else {
                    console.log(`Ponto de Saida-Intervalo já registrado para ${funcionario.nome} hoje.`);
                // }
            }, delay);
        } else {
            console.log(`Horário de Saida-Intervalo de ${funcionario.nome} já passou: ${funcionario.horario.toTimeString()}`);
        }
    }
}

// SistemFuncPonto_saidaIntervalo();

export default SistemFuncPonto_saidaIntervalo;
