// import { useEffect, useState } from "react";
// import { api } from "../../../services/api";

// function Sis_P_Entrada() {
//     const [funcionarios, setFuncionarios] = useState([]);
//     const [funcSelecionados, setFuncSelecionados] = useState([]);
//     const [scriptIniciado, setScriptIniciado] = useState(false);

//     const carregarDados = async () => {
//         try {
//             const response = await api.get('/funcionario');
//             console.log('Dados carregados:', response.data);
//             setFuncionarios(response.data.funcionarios);
//         } catch (error) {
//             console.error('Erro ao carregar dados dos funcionários:', error);
//         }
//     };

//     const verificarFuncionariosSemRegistro = (funcionarios) => {
//         const dataHoje = new Date().toLocaleDateString('pt-BR');
//         return funcionarios.filter(func =>
//             !func.pontos.some(ponto => ponto.data === dataHoje)
//         );
//     };

//     const formatarHorario = (data) => {
//         const horas = data.getHours().toString().padStart(2, '0');
//         const minutos = data.getMinutes().toString().padStart(2, '0');
//         return `${horas}:${minutos}`;
//     };

//     const selecionarFuncionarios = () => {
//         const funcionariosSemRegistro = verificarFuncionariosSemRegistro(funcionarios);
//         const quantidade = Math.floor(Math.random() * 10) + 1;
//         const novosSelecionados = [];
//         const usedIndices = new Set();

//         while (novosSelecionados.length < quantidade && novosSelecionados.length < funcionariosSemRegistro.length) {
//             const randomIndex = Math.floor(Math.random() * funcionariosSemRegistro.length);
//             if (!usedIndices.has(randomIndex)) {
//                 novosSelecionados.push(funcionariosSemRegistro[randomIndex]);
//                 usedIndices.add(randomIndex);
//             }
//         }

//         setFuncSelecionados(novosSelecionados);
//     };

//     const iniciarScriptRegistros = () => {
//         const intervalo = setInterval(async () => {
//             const funcionariosSemRegistro = verificarFuncionariosSemRegistro(funcionarios);
//             if (funcionariosSemRegistro.length === 0) {
//                 clearInterval(intervalo); // Para o intervalo se todos os funcionários registraram
//                 return;
//             }

//             const quantidade = Math.min(
//                 Math.floor(Math.random() * 10) + 1,
//                 funcionariosSemRegistro.length
//             );
//             const novosSelecionados = [];
//             const usedIndices = new Set();

//             while (novosSelecionados.length < quantidade) {
//                 const randomIndex = Math.floor(Math.random() * funcionariosSemRegistro.length);
//                 if (!usedIndices.has(randomIndex)) {
//                     novosSelecionados.push(funcionariosSemRegistro[randomIndex]);
//                     usedIndices.add(randomIndex);
//                 }
//             }

//             const registro = {
//                 data: new Date().toLocaleDateString('pt-BR'),
//                 entrada: formatarHorario(new Date()),
//                 saida_intervalo: "",
//                 retorno_intervalo: "",
//                 saida: "",
//             };

//             try {
//                 for (const funcionario of novosSelecionados) {
//                     await api.post(`/funcionario/pontos/${funcionario.id}`, registro);
//                     console.log(`Ponto registrado: ${funcionario.nome} às ${registro.entrada}`);
//                 }
//             } catch (error) {
//                 console.error(`Erro ao registrar ponto:`, error);
//             }

//             setFuncSelecionados([]);
//         }, 10000); // Intervalo de 10 segundos

//         return () => clearInterval(intervalo);
//     };

//     useEffect(() => {
//         carregarDados();
//     }, []);

//     useEffect(() => {
//         if (funcionarios.length > 0 && !scriptIniciado) {
//             selecionarFuncionarios();
//             iniciarScriptRegistros();
//             setScriptIniciado(true); // Marca o script como iniciado
//         }
//     }, [funcionarios]);


// }

// export default Sis_P_Entrada;
