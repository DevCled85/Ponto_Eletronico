import { api } from "../../../services/api";

async function SistemFuncPonto_retornoIntervalo() {
    const response = await api.get('/funcionario');
    const dados = response.data.funcionarios;

    // Filtrar os funcionários que não tem ponto no dia atual
    const funcFiltradoAusente = dados.filter(func => !func.pontos.some(ponto => ponto.data === new Date().toLocaleDateString('pt-BR'))).map(func => func.id);
    funcFiltradoAusente.push('84398205-e092-41d7-bea6-58fe6a9022a5'); // adiciona o id do funcionario cledson

    // Filtrar o funcionário com o ID específico
    const funcionariosFiltrados_retornoIntervalo = dados.filter(
        // funcionario => !funcFiltradoAusente.includes(funcionario.id)
        funcionario => funcionario.id !== "84398205-e092-41d7-bea6-58fe6a9022a5" // Cledson
    );

    // Total de funcionários restantes
    const totalFuncionarios = funcionariosFiltrados_retornoIntervalo.length;

    // Calcular o corte de minutos para o início e limite do horário
    const minutosParaCorteHoraInicial_retornoIntervalo = totalFuncionarios / 4;

    // Hora inicial
    const horaInicial_retornoIntervalo = new Date();
    horaInicial_retornoIntervalo.setHours(14, - minutosParaCorteHoraInicial_retornoIntervalo, 0);

    // Hora limite
    const horaLimite_retornoIntervalo = new Date();
    horaLimite_retornoIntervalo.setHours(14, minutosParaCorteHoraInicial_retornoIntervalo, 0);

    // Gerar horários para cada funcionário
    const horariosFuncionarios_retornoIntervalo = funcionariosFiltrados_retornoIntervalo.map(funcionario => {
        const horario_retornoIntervalo = new Date(horaInicial_retornoIntervalo.getTime());
        const minutosAleatorios_retornoIntervalo = Math.floor(Math.random() * (minutosParaCorteHoraInicial_retornoIntervalo * 2 + 1));
        horario_retornoIntervalo.setMinutes(horaInicial_retornoIntervalo.getMinutes() + minutosAleatorios_retornoIntervalo);

        return {
            ...funcionario,
            horario: horario_retornoIntervalo
        };
    });

    console.log("Horários gerados Retorno-Intervalo:", horariosFuncionarios_retornoIntervalo.sort((a, b) => a.horario - b.horario));

    // Função para registrar o ponto no horário correto
    for (const funcionario of horariosFuncionarios_retornoIntervalo) {
        const delay = funcionario.horario - new Date(); // Tempo em milissegundos até o horário do ponto

        if (delay > 0) {
            setTimeout(async () => {
                // Verificar se já foi registrado
                // const responsePontos = await api.get(`/funcionario/pontos/${funcionario.id}`);
                // const pontosRegistrados = responsePontos.data.pontos;
                // const jaTemPontoHoje = pontosRegistrados.some(ponto => ponto.data === funcionario.horario.toLocaleDateString('pt-BR') && ponto.registro === 'retorno_intervalo');

                // if (!jaTemPontoHoje) {
                    // Formatar horário para HH:MM
                    const horarioFormatado = funcionario.horario.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                    });

                    const registro = {
                        data: funcionario.horario.toLocaleDateString('pt-BR'),
                        registro: 'retorno_intervalo',
                        hora: horarioFormatado,
                    };

                    try {
                        // Enviar ao backend
                        await api.patch(`/funcionario/pontos/reg/${funcionario.id}`, registro);
                        console.log(`Ponto registrado Retorno-Intervalo: ${funcionario.nome} às ${horarioFormatado}`);
                    } catch (error) {
                        console.error(`Erro ao registrar ponto de Retorno-Intervalo ${funcionario.nome}:`, error);
                    }
                // } else {
                    console.log(`Ponto de Retorno-Intervalo já registrado para ${funcionario.nome} hoje.`);
                // }
            }, delay);
        } else {
            console.log(`Horário de Retorno-Intervalo de ${funcionario.nome} já passou: ${funcionario.horario.toTimeString()}`);
        }
    }
}

// SistemFuncPonto_retornoIntervalo();

export default SistemFuncPonto_retornoIntervalo;
