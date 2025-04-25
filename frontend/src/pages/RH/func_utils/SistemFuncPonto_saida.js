import { api } from "../../../services/api";

async function SistemFuncPonto_saida(ehSabado) {
    const response = await api.get('/funcionario');
    const dados = response.data.funcionarios;

    // Filtrar os funcionários que não tem ponto no dia atual
    const funcFiltradoAusente = dados.filter(func => !func.pontos.some(ponto => ponto.data === new Date().toLocaleDateString('pt-BR'))).map(func => func.id);
    funcFiltradoAusente.push('84398205-e092-41d7-bea6-58fe6a9022a5'); // adiciona o id do funcionario cledson

    // Filtrar o funcionário com o ID específico
    const funcionariosFiltrados_saida = dados.filter(
        funcionario => funcionario.id !== "84398205-e092-41d7-bea6-58fe6a9022a5" // Cledson
    );

    // Total de funcionários restantes
    const totalFuncionarios = funcionariosFiltrados_saida.length;

    // Calcular o corte de minutos para o início e limite do horário
    const minutosParaCorteHoraInicial_saida = totalFuncionarios / 4;

    const horaFinal_saida = ehSabado ? 13 : 19;

    // Hora inicial
    const horaInicial_saida = new Date();
    horaInicial_saida.setHours(horaFinal_saida, - minutosParaCorteHoraInicial_saida - 15, 0);

    // Hora limite
    const horaLimite_saida = new Date();
    horaLimite_saida.setHours(horaFinal_saida - .5, minutosParaCorteHoraInicial_saida, 0);

    // console.log(horaLimite_saida);

    // Gerar horários para cada funcionário
    const horariosFuncionarios_saida = funcionariosFiltrados_saida.map(funcionario => {
        const horario_saida = new Date(horaInicial_saida.getTime());
        const minutosAleatorios_saida = Math.floor(Math.random() * (minutosParaCorteHoraInicial_saida * 2 + 1));
        horario_saida.setMinutes(horaInicial_saida.getMinutes() + minutosAleatorios_saida);

        return {
            ...funcionario,
            horario: horario_saida
        };
    });

    console.log("Horários gerados Saída:", horariosFuncionarios_saida.sort((a, b) => a.horario - b.horario));

    // Função para registrar o ponto no horário correto
    for (const funcionario of horariosFuncionarios_saida) {
        const delay = funcionario.horario - new Date(); // Tempo em milissegundos até o horário do ponto

        if (delay > 0) {
            setTimeout(async () => {
                // Verificar se já foi registrado
                // const responsePontos = await api.get(`/funcionario/pontos/${funcionario.id}`);
                // const pontosRegistrados = responsePontos.data.pontos;
                // const jaTemPontoHoje = pontosRegistrados.some(ponto => ponto.data === funcionario.horario.toLocaleDateString('pt-BR') && ponto.registro === 'saida');

                // if (!jaTemPontoHoje) {
                // Formatar horário para HH:MM
                const horarioFormatado = funcionario.horario.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                });

                const registro = {
                    data: funcionario.horario.toLocaleDateString('pt-BR'),
                    registro: 'saida',
                    hora: horarioFormatado,
                };

                try {
                    // Enviar ao backend
                    await api.patch(`/funcionario/pontos/reg/${funcionario.id}`, registro);
                    console.log(`Ponto registrado Saída: ${funcionario.nome} às ${horarioFormatado}`);
                } catch (error) {
                    console.error(`Erro ao registrar ponto de Saída de ${funcionario.nome}:`, error);
                }
                // } else {
                console.log(`Ponto de Saída já registrado para ${funcionario.nome} hoje.`);
                // }
            }, delay);
        } else {
            console.log(`Horário de Saída de ${funcionario.nome} já passou: ${funcionario.horario.toTimeString()}`);
        }
    }
}

// SistemFuncPonto_saida();

export default SistemFuncPonto_saida;
