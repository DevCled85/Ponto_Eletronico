import { api } from "../../../services/api";

async function SistemFuncPonto() {
    const response = await api.get('/funcionario');
    const dados = response.data.funcionarios;

    // Filtrar os funcionários que não tem ponto no dia atual
    const funcFiltradoAusente = dados.filter(func => !func.pontos.some(ponto => ponto.data === new Date().toLocaleDateString('pt-BR'))).map(func => func.id);

    // Filtrar o funcionário com o ID específico (Cledson)
    const funcionariosFiltrados = dados.filter(
        funcionario => funcionario.id !== "84398205-e092-41d7-bea6-58fe6a9022a5" // Cledson
    );

    // console.log(funcionariosFiltrados);

    // Total de funcionários restantes para mais ou menos
    const totalFuncionarios = funcionariosFiltrados.length;

    // Calcular o corte de minutos para o início e limite do horário
    const minutosParaCorteHoraInicial = Math.floor(totalFuncionarios / 4);

    const hoursLimit = 8;

    // Hora inicial
    const hoursInitial = new Date();
    hoursInitial.setHours(hoursLimit, - minutosParaCorteHoraInicial, 0);

    // Hora final
    const hoursEnd = new Date();
    hoursEnd.setHours(hoursLimit, minutosParaCorteHoraInicial, 0);

    // Gerar horários para cada funcionário
    const horariosFuncionarios = funcionariosFiltrados.map(funcionario => {
        const horario = new Date(hoursInitial.getTime());
        const minutosAleatorios = Math.floor(Math.random() * (minutosParaCorteHoraInicial * 2 + 1));
        horario.setMinutes(hoursInitial.getMinutes() + minutosAleatorios);

        return {
            ...funcionario,
            horario
        };
    });

    // mostra no console os horários gerados
    console.log("Horários gerados Entrada:", horariosFuncionarios.sort((a, b) => a.horario - b.horario));

    // Função para registrar o ponto no horário correto
    for (const funcionario of horariosFuncionarios) {
        const delay = funcionario.horario - new Date(); // Tempo em milissegundos até o horário do ponto

        if (delay > 0) {
            setTimeout(async () => {
                // Formatar horário para HH:MM
                const horarioFormatado = funcionario.horario.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                });

                const registro = {
                    data: funcionario.horario.toLocaleDateString('pt-BR'),
                    entrada: horarioFormatado,
                    saida_intervalo: "",
                    retorno_intervalo: "",
                    saida: "",
                };

                try {
                    // Enviar ao backend
                    await api.post(`/funcionario/pontos/${funcionario.id}`, registro);
                    console.log(`Ponto registrado: ${funcionario.nome} às ${horarioFormatado}`);
                } catch (error) {
                    console.error(`Erro ao registrar ponto de ${funcionario.nome}:`, error);
                }
            }, delay);
        } else {
            // mostra no console o horário do funcionário que já passou
            console.log(`Horário de ${funcionario.nome} já passou: ${funcionario.horario.toTimeString()}`);
        }
    }
}





// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------

const calcHorasMinutos = (time) => {
    if (!time) return 0;

    const [horas, minutos] = time.split(':').map(Number);
    return horas * 60 + minutos;
}

const calcMinutosHoras = (time) => {
    return `${Math.floor(time / 60).toString().padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`
}

const calcHoras = (pontos) => {
    let entrada = parseInt(calcHorasMinutos(pontos?.entrada) || 0);
    let saida_intervalo = parseInt(calcHorasMinutos(pontos?.saida_intervalo) || 0);
    let retorno_intervalo = parseInt(calcHorasMinutos(pontos?.retorno_intervalo) || 0);
    let saida = parseInt(calcHorasMinutos(pontos?.saida) || 0);

    if (!entrada) entrada = 480;
    if (entrada) saida_intervalo = entrada + 240;

    // Ajustar o retorno_intervalo para ser 2 horas após a saida_intervalo
    if (saida_intervalo) {
        retorno_intervalo = saida_intervalo + 120; // 2 horas em minutos
    }

    if (retorno_intervalo) saida = retorno_intervalo + 240;

    return {
        entrada: calcMinutosHoras(entrada),
        saida_intervalo: calcMinutosHoras(saida_intervalo),
        retorno_intervalo: calcMinutosHoras(retorno_intervalo),
        saida: calcMinutosHoras(saida)
    }
}

// função de correção de ponto e entrada para registro forçado
async function corrigirPonto() {
    const response = await api.get('/funcionario');
    const dados = response.data.funcionarios;

    // data de registro ---> informar a data para registro
    const dataRegistro = new Date().toLocaleDateString('pt-BR'); // Inserir como parametro a data para registro yyyy-mm-dd

    const funcionariosAhRegistrar = dados?.filter(func => func.id !== '84398205-e092-41d7-bea6-58fe6a9022a5');
    // const funcionariosAhRegistrar = dados?.filter(func => func.matricula === '116679');

    for (const funcionario of funcionariosAhRegistrar) {
        const pontos = funcionario?.pontos.find(ponto => ponto?.data === dataRegistro);
        const objPontos = calcHoras(pontos);

        const newsRegisters = {
            entrada: objPontos.entrada,
            saida_intervalo: objPontos.saida_intervalo,
            retorno_intervalo: objPontos.retorno_intervalo,
            saida: objPontos.saida,
        };

        // ponto individualmente...
        // await api.patch(`/funcionario/pontos/reg/${funcionario.id}`, {
        //     data: dataRegistro,
        //     registro: 'saida_intervalo',
        //     hora: newsRegisters.saida_intervalo,
        //     hora: "",
        // })

        // if (!pontos?.entrada) {
        //     await api.post(`/funcionario/pontos/${funcionario.id}`, {
        //         data: dataRegistro,
        //         entrada: newsRegisters.entrada,
        //         saida_intervalo: "",
        //         retorno_intervalo: "",
        //         saida: "",
        //     });
        // // } else if (!pontos?.saida_intervalo || pontos?.saida_intervalo !== "") {
        // }
        
        // if (!pontos?.saida_intervalo || pontos?.saida_intervalo === "") {
        //     await api.patch(`/funcionario/pontos/reg/${funcionario.id}`, {
        //         data: dataRegistro,
        //         registro: 'saida_intervalo',
        //         hora: newsRegisters.saida_intervalo,
        //     });
        // }

        // // if (!pontos?.retorno_intervalo || pontos?.retorno_intervalo !== "") {
        // if (!pontos?.retorno_intervalo || pontos?.retorno_intervalo === "") {
        //     await api.patch(`/funcionario/pontos/reg/${funcionario.id}`, {
        //         data: dataRegistro,
        //         registro: 'retorno_intervalo',
        //         hora: newsRegisters.retorno_intervalo,
        //     });
        // }

        // // if (!pontos?.saida || pontos?.saida !== "") {
        // if (!pontos?.saida || pontos?.saida === "") {
        //     await api.patch(`/funcionario/pontos/reg/${funcionario.id}`, {
        //         data: dataRegistro,
        //         registro: 'saida',
        //         hora: newsRegisters.saida,
        //     });
        // }

        console.log(`Pontos do funcionário ${funcionario.nome}:`, pontos);
    }
}
// corrigirPonto();

export default SistemFuncPonto;

