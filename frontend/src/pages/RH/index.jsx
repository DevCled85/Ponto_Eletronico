import { useState, useEffect } from "react";
import Gerar_nomesFull from "./func_utils/Gerar_nomesFull.js";
import SistemFuncPonto from './func_utils/SistemFuncPonto';
import SistemFuncPonto_saidaIntervalo from "./func_utils/SistemFuncPonto_saidaIntervalo";
import SistemFuncPonto_retornoIntervalo from "./func_utils/SistemFuncPonto_retornoIntervalo";
import SistemFuncPonto_saida from "./func_utils/SistemFuncPonto_saida";
import { useGerarFuncionarios } from "../../component/hooks/useGerarFuncionarios.js";
import { api } from "../../services/api.js";
// import Sis_P_Entrada from "./func_utils/Sis_P_Entrada.js";


//* cadastro de funcionarios por função

function Rh() {
    const limiteContratar = 0;
    const timeLimiteContratar = 0; // contratados por segundos

    // Gerar nomes completos
    const nomesArr = Array.from({ length: limiteContratar }, () => Gerar_nomesFull.namesFull());

    // Estado para armazenar os nomes gerados e matrículas
    const [nomesGerados, setNomesGerados] = useState([]);
    const [funcionariosCargos, setFuncionariosCargos] = useState([]);

    // Função para gerar matrícula com os 6 últimos dígitos
    const gerarMatricula = () => {
        const timestamp = Date.now(); // Obtém o timestamp atual
        return timestamp.toString().slice(-6); // Retorna os 6 últimos dígitos
    };

    // gerando aleatório vagas para o cargo
    const cargos = [
        'Compliance', 'Pesquisa TI', 'Desenvolvimento', 'Conformidade TI', 'Gestão de TI',
        'Des. Sistemas (BI)', 'Gestão Banco Dados', 'Consultoria em TI', 'Suporte Técnico', 'Infraestrutura de TI',
        'Des. de Software', 'Analista Senior', 'Analista Jr',
        'Supervisor', 'Gerente', 'Desenvolvedor '
    ];
    const aleatCargos = (arr) => Math.floor(Math.random() * arr.length);

    // useEffect(() => {
    //     // Função para adicionar nome e matrícula
    //     let index = 0;

    //     const intervalo = setInterval(async () => {
    //         if (index < nomesArr.length) {
    //             const nomeGerado = {
    //                 nomeFuncionario: nomesArr[index],
    //                 matriculaFuncionario: gerarMatricula(),
    //                 cargoFuncionario: cargos[aleatCargos(cargos)]
    //             };

    //             try {
    //                 // Envia os dados para o backend um por vez para contratar funcionario
    //                 // Envia ao backend via POST
    //                 // await api.post('/funcionario', nomeGerado);

    //                 // Atualiza o estado do frontend com os dados gerados
    //                 setNomesGerados((prev) => [...prev, nomeGerado]);
    //             } catch (error) {
    //                 console.error('Erro ao enviar os dados:', error);
    //             }

    //             index++;
    //         } else {
    //             // Limpa o intervalo quando todos os nomes forem gerados
    //             clearInterval(intervalo);
    //         }
    //     }, timeLimiteContratar * 1000); // A cada 1 segundo

    //     // Limpeza do intervalo quando o componente for desmontado
    //     return () => clearInterval(intervalo);
    // }, []); // Executa apenas uma vez, na montagem do componente

    // * busca de funcionarios por cargo
    const buscarFuncionarios = async () => {
        try {
            const response = await api.get('/funcionario');
            const funcionarios = response.data;

            // Obter todos os cargos em uma array, eliminando duplicados
            const cargos = [...new Set(funcionarios.funcionarios.map(func => func.cargo))];

            // Agrupar funcionários por cargo
            const funcionariosPorCargo = funcionarios.funcionarios.reduce((acc, func) => {
                const { cargo } = func;

                // Adiciona ao grupo do cargo ou cria um novo grupo
                if (!acc[cargo]) {
                    acc[cargo] = [];
                }
                acc[cargo].push(func);
                return acc;
            }, {});

            setFuncionariosCargos(funcionariosPorCargo); // Atualiza o estado fora do loop
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error); // Tratamento de erro
        }
    }

    //* busca funcionarios
    // buscarFuncionarios();

    // contratar funcionarios
    // useGerarFuncionarios(0, 0, [''])

    //* sistema de registro de ponto aos 'sabados' - entrada e saida
    // const enableDisabledFuncImportant = async () => {
        const agora = new Date();
        const horaLimite = new Date();
        horaLimite.setHours(8, 15, 0); // Define a hora limite para 08:15
        const ehSabado = agora.getDay() === 6;

        // await SistemFuncPonto_saidaIntervalo();

        // Verifica se a hora atual é antes da hora limite
        // if (agora < horaLimite) {
            
        //     // Chama a função SistemFuncPonto apenas se for antes da hora limite
        //     // await SistemFuncPonto();
        // } else {
        //     // console.log("A hora limite para registrar pontos já passou. SistemFuncPonto não será executada.");
        //     // return
        // }

        // Chama as outras funções independentemente da hora
        // await SistemFuncPonto_saidaIntervalo();
        // await SistemFuncPonto_retornoIntervalo();
        // SistemFuncPonto_saida(ehSabado);
    // }

    // useEffect(() => {
        // enableDisabledFuncImportant();

        // // Configura um intervalo para chamar a função diariamente
        // const intervaloDiario = setInterval(() => {
        //     enableDisabledFuncImportant();
        // }, 24 * 60 * 60 * 1000); // 24 horas em milissegundos

        // return () => clearInterval(intervaloDiario);
    // }, []);

    SistemFuncPonto()
    SistemFuncPonto_saidaIntervalo();
    SistemFuncPonto_retornoIntervalo();
    SistemFuncPonto_saida(ehSabado);

    // função para rodar as funções dentro de seus horarios respectivos
    // const verificarHorarioLimite = () => {
    //     const agora = new Date();
    //     const horaLimite = new Date();
    //     horaLimite.setHours(8, 15, 0); // Define a hora limite para interromper a execução

    //     if (agora < horaLimite) {
    //         SistemFuncPonto(); // Chama a função aqui se a hora for antes da hora limite
    //         return true; // Retorna true se a hora atual for antes da hora limite
    //     } else {
    //         console.log("A função SistemFuncPonto não pode ser executada após as " + horaLimite.toLocaleTimeString('pt-BR', {
    //             hour: '2-digit',
    //             minute: '2-digit',
    //         }));
    //         return false; // Retorna false se a hora limite já passou
    //     }
    // };

    // if (!verificarHorarioLimite()) {
    //     console.log("A função SistemFuncPonto não pode ser executada após as " + horaLimite.toLocaleTimeString('pt-BR', {
    //         hour: '2-digit',
    //         minute: '2-digit',
    //     }));
    //     return; // Interrompe a execução se a hora limite já passou
    // }


    // função para testar a entrada de funcionarios ainda em criação ----------------------
    // Sis_P_Entrada();



    return (
        <div>

            {/* renderiza nomes completos */}
            {/* {nomesGerados.map((item, index) => (
                <div key={index}>
                    {item.nome}: {item.matricula} - cargo: {item.cargo}
                </div>
            ))} */}


            {/* renderiza cargos com funcionarios */}
            {/* {
                Object.keys(funcionariosCargos).map(cargo => (
                    <div key={cargo} style={{textTransform: 'capitalize', width: 'fit-content', margin: '0 auto'}}>
                        <h3 style={{backgroundColor: '#ccc', padding: '10px 20px'}}>{cargo}</h3>
                        {
                            funcionariosCargos[cargo].map(func => (
                                <p key={func.matricula} style={{padding: '2px 20px'}}>
                                    <i style={{fontSize: '12px'}}>Nome:</i> {func.nome} | <i style={{fontSize: '12px'}}>Matricula: {func.matricula}</i>
                                </p>
                            ))
                        }
                        <br />
                        <br />
                    </div>
                ))

            } */}
        </div>
    );
}

export default Rh;
