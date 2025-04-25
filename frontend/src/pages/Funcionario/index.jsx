import Styles from './Funcionario.module.css';
import Footer from './../../component/Footer';
import Container from '../../component/Container';
import { useEffect, useRef, useState } from 'react';
import { api } from '../../services/api';
import Mensager from '../../component/utils/Mensager';

const endpoint = '/funcionario';
const timeoutAlert = 5; // Em segundos o tempo antes de enviar ao backend a requisição

function Funcionario() {
    const [dados, setDados] = useState([])
    const [nomeFuncionario, setNomeFuncionario] = useState('');
    const [cargoFuncionario, setCargoFuncionario] = useState('');
    const [matriculaFuncionario, setMatriculaFuncionario] = useState('');

    const [alerta, setAlerta] = useState({ type: '', msg: '' });

    const inputNomeRef = useRef(null);
    const isDisabled = nomeFuncionario === "" || cargoFuncionario === "" || matriculaFuncionario === "";

    const mostrarAlerta = (type, msg) => {
        setAlerta({ type, msg });
        setTimeout(() => {
            setAlerta({ type: '', msg: '' });
        }, 5000);
    };

    const carregarDados = async () => {
        try {
            const response = await api.get(endpoint);
            setDados(response.data.funcionarios || []);
        } catch (error) {
            console.error('Erro detalhado:', error.response || error);
            setDados([]);
        }
    };

    useEffect(() => {
        inputNomeRef.current.focus();
        carregarDados();
    }, []);

    const handleFormCadFuncionario = async (e) => {
        e.preventDefault();

        // busca para ver se ja tem cadastro com a matricula em questão
        if (dados.some(funcMtrc => funcMtrc.matricula === matriculaFuncionario)) {
            mostrarAlerta('warning', 'Matrícula já cadastrada!');
            return; // Se já existe, cancela o processo
        }

        // prepara o novo cadastro se a matricula não for encontrada no banco de dados
        const novoFuncionario = { nomeFuncionario, cargoFuncionario, matriculaFuncionario };

        // Exibe Mensager antes de salvar no banco
        mostrarAlerta('success', 'Funcionário cadastrado com sucesso!');

        // Aguarda a animação antes de salvar os dados
        setTimeout(async () => {
            try {
                // Faz a requisição ao backend para cadastrar
                await api.post(endpoint, novoFuncionario);

                carregarDados();

                // Atualiza o estado local com o novo cadastro
                setDados(prevDados => [...prevDados, novoFuncionario]);

                // Limpa os inputs
                setNomeFuncionario('');
                setCargoFuncionario('');
                setMatriculaFuncionario('');

                inputNomeRef.current.focus();
            } catch (error) {
                console.error('Erro ao cadastrar o funcionário', error);
                mostrarAlerta('error', 'Erro ao cadastrar o funcionário.');
            }
        }, timeoutAlert * 1000); // Aguarda 5 segundos (tempo do Mensager)
    };

    const handleDelete = async (id) => {
        // Exibe um popup com a pergunta de confirmação
        const confirmDelete = window.confirm('Tem certeza que deseja deletar o cadastro?');
        // Exibe o alerta antes de deletar
        mostrarAlerta('success', 'Funcionário deletado com sucesso!');

        // Se o usuário confirmar, executa a exclusão
        if (confirmDelete) {
            // Aguarda a animação antes de excluir no banco
            setTimeout(async () => {
                try {
                    // Remove o funcionário do backend
                    await api.delete(`${endpoint}/${id}`);

                    // Atualiza os dados localmente
                    setDados(dados.filter(func => func.id !== id));

                } catch (error) {
                    console.error('Erro ao deletar o funcionário.', error);
                    mostrarAlerta('error', 'Erro ao deletar o funcionário.');
                }
            }, timeoutAlert * 1000); // Tempo da animação do Mensager
        }

    };

    const handleEdit = async (data) => {
        const { nome, cargo, matricula, id } = data;

        // Solicitando as edições
        const nomeEditado = prompt('Nome do funcionário:', nome);
        const cargoEditado = prompt('Cargo do funcionário:', cargo);
        const matriculaEditado = prompt('Matrícula do funcionário:', matricula);

        // Verificando se os valores estão preenchidos
        if (!nomeEditado || !cargoEditado || !matriculaEditado) {
            mostrarAlerta('warning', 'Por favor, preencher todos os campos.');
            return;
        }

        // Dados atualizados
        const newData = {
            nome: nomeEditado,
            cargo: cargoEditado,
            matricula: matriculaEditado
        };

        // Exibe o alerta antes de enviar os dados ao backend
        mostrarAlerta('success', 'Dados atualizados com sucesso!');

        // Aguarda o tempo da animação antes de salvar no banco
        setTimeout(async () => {
            try {
                // Envia a atualização para o backend
                await api.patch(`${endpoint}/${id}`, newData);

                // Atualiza os dados localmente
                setDados(dados.map(func => func.id === id ? { ...func, ...newData } : func));

            } catch (error) {
                console.error('Erro ao atualizar cadastro.', error);
                mostrarAlerta('error', 'Erro ao atualizar cadastro.');
            }
        }, timeoutAlert * 1000); // Tempo da animação do Mensager
    };

    return (
        <div className={Styles.boxCadFuncionario}>
            {/* <Header /> */}
            <Container>

                {alerta.msg && <Mensager key={Date.now()} type={alerta.type} msg={alerta.msg} />}

                <section className={Styles.contBoxFuncionario}>
                    <form onSubmit={handleFormCadFuncionario}>
                        <div className={Styles.header}>
                            Cadastrar Funcionários
                        </div>

                        <div className={Styles.main}>

                            <label>Nome do Funcionário:
                                <input
                                    ref={inputNomeRef}
                                    type="text"
                                    placeholder='Digite o nome do funcionário'
                                    onChange={(e) => setNomeFuncionario(e.target.value)}
                                    value={nomeFuncionario}
                                />
                            </label>

                            <label>Cargo do Funcionário:
                                <input
                                    type="text"
                                    placeholder='Digite o cargo do funcionário'
                                    onChange={(e) => setCargoFuncionario(e.target.value)}
                                    value={cargoFuncionario}
                                />
                            </label>

                            <label>Matrícula do Funcionário:
                                <input
                                    type="text"
                                    placeholder='Digite a matrícula do funcionário'
                                    onChange={(e) => setMatriculaFuncionario(e.target.value)}
                                    value={matriculaFuncionario}
                                />
                            </label>

                            <button
                                disabled={isDisabled}
                                style={{
                                    opacity: isDisabled ? '' : 1,
                                    cursor: isDisabled ? 'not-allowed' : 'pointer'
                                }}
                                type="submit"
                            >Cadastrar
                            </button>

                        </div>
                    </form>

                    <div className={Styles.boxTableFuncionarios}>
                        {
                            dados.length > 0 && (
                                <table border={0}>
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Matrícula</th>
                                            <th>Cargo</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            dados.map((funcionario, index) => (
                                                <tr key={index}>
                                                    <td>{funcionario.nome}</td>
                                                    <td>{funcionario.matricula}</td>
                                                    <td>{funcionario.cargo}</td>
                                                    <td>
                                                        <button
                                                            onClick={() => handleEdit(funcionario)}
                                                            className={Styles.btnEdit}
                                                        >Editar</button>

                                                        <button
                                                            onClick={() => handleDelete(funcionario.id)}
                                                            className={Styles.btnDelete}
                                                        >Deletar</button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            )
                        }
                    </div>
                </section>
            </Container>
            <Footer />
        </div>
    )
}

export default Funcionario;
