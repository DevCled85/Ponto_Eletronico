import { useEffect, useState } from 'react';
import Container from '../../../component/Container';
import Styles from './Registro.module.css';
import { useLocation, useNavigate } from "react-router-dom";
import { api } from '../../../services/api';
import SeloRegistroPonto from '../../../component/utils/SeloRegistroPonto';

const endpoint = "/funcionario";

function Registro() {
    const [dados, setDados] = useState([]);
    const location = useLocation();
    const { id, nome, cargo, matricula, pontos } = location.state;

    const navigate = useNavigate();

    const [msgSelo, setMsgSelo] = useState(null);
    const [hoje, setHoje] = useState('');
    const [hora, setHora] = useState('');
    const [timeoutCounter, setTimeoutCounter] = useState(20);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    const funcionario = { id, nome, cargo, matricula, pontos };

    const mostrarMsgSelo = (msg) => {
        setMsgSelo(msg);
        // Limpar a mensagem após o tempo definido
        setTimeout(() => {
            setMsgSelo(null);
        }, 5000);
    };

    // -------------------
    const criarRegistroPonto = async (dataAtual, horaAtual) => {
        await api.post(`${endpoint}/pontos/${id}`, {
            data: dataAtual,
            entrada: horaAtual,
            saida_intervalo: "",
            retorno_intervalo: "",
            saida: ""
        });
        mostrarMsgSelo('Entrada registrada com sucesso!');
    };

    const atualizarRegistroPonto = async (semanaDay, registroExistente, dataAtual, horaAtual) => {
        const campos = semanaDay === 'sábado'
            ? ['saida']
            : ['saida_intervalo', 'retorno_intervalo', 'saida'];

        for (const campo of campos) {
            if (!registroExistente[campo]) {
                await api.patch(`${endpoint}/pontos/reg/${id}`, {
                    data: dataAtual,
                    registro: campo,
                    hora: horaAtual
                });
                mostrarMsgSelo(`Registro de ${campo.replace('_', ' ')} efetuado!`);
                break;
            }
        }
    };

    //  ------------------------------------- 
    const handleRegistroPonto = async (id) => {
        const horaAtual = new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        });
        const dataAtual = new Date().toLocaleDateString('pt-BR');

        const semanaDay = new Date().toLocaleDateString('pt-BR', {
            weekday: 'long'
        });

        try {
            const response = await api.get(endpoint);
            const funcionario = response.data.funcionarios.find(func => func.id === id).pontos;

            const registroExistente = funcionario.find(ponto => ponto.data === dataAtual);

            if (!registroExistente) {
                criarRegistroPonto(dataAtual, horaAtual);
            } else {
                atualizarRegistroPonto(semanaDay, registroExistente, dataAtual, horaAtual);
            }

            //! Aguarda 5 segundos para exibir a mensagem antes de navegar
            setTimeout(() => {
                navigate('/ponto')
                carregarDadosRender();
            }, 6000)

        } catch (error) {
            console.error('Erro ao registrar ponto:', error);
        }
    };

    const dataHoje = () => {
        const data = new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
        setHoje(data);
    };

    const horaCurrent = () => {
        const hora = new Date().toLocaleTimeString('pt-BR');
        setHora(hora);
    };

    const carregarDadosRender = async () => {
        const response = await api.get(endpoint);
        const registroAtual = response.data.funcionarios.find(func => func.id === id).pontos
            .find(ponto => ponto.data === new Date().toLocaleDateString('pt-BR'));

        setDados(registroAtual || {});
    };

    useEffect(() => {
        dataHoje();
        horaCurrent();
        carregarDadosRender();

        const interval = setInterval(() => {
            dataHoje();
            horaCurrent();
        }, 1000);

        return () => clearInterval(interval);
    }, [dados]);

    // Adicionando evento para capturar a tecla Enter
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                handleRegistroPonto(funcionario.id);
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        }
    }, [funcionario.id]);

    // Função para verificar se todos os pontos foram registrados
    const verificarPontosCompletos = (registro, semanaDay) => {
        if (!registro) return false;

        if (semanaDay === 'sábado') {
            return registro.entrada && registro.saida;
        }

        return registro.entrada &&
            registro.saida_intervalo &&
            registro.retorno_intervalo &&
            registro.saida;
    };

    // Efeito para contagem regressiva
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeoutCounter((prev) => {
                if (prev <= 1) {
                    setShouldRedirect(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Efeito separado para redirecionamento
    useEffect(() => {
        if (shouldRedirect) {
            const redirectTimer = setTimeout(() => {
                navigate('/ponto');
            }, 1000);
            return () => clearTimeout(redirectTimer);
        }
    }, [shouldRedirect, navigate]);

    // Efeito para verificar pontos completos
    useEffect(() => {
        const verificarEstadoPontos = async () => {
            try {
                const response = await api.get(endpoint);
                const funcionario = response.data.funcionarios.find(func => func.id === id);
                const dataAtual = new Date().toLocaleDateString('pt-BR');
                const semanaDay = new Date().toLocaleDateString('pt-BR', { weekday: 'long' });
                const registroAtual = funcionario.pontos?.find(ponto => ponto.data === dataAtual);

                const pontosCompletos = verificarPontosCompletos(registroAtual, semanaDay);
                setIsButtonDisabled(pontosCompletos);
            } catch (error) {
                console.error('Erro ao verificar pontos:', error);
            }
        };

        verificarEstadoPontos();
    }, [id]);

    // Reset do timer
    const resetTimer = () => {
        setTimeoutCounter(20);
    };

    return (
        <Container>
            <section className={Styles.boxRegistro}>
                <div className={Styles.registro}>

                    {msgSelo && <SeloRegistroPonto msg={msgSelo} />}

                    <div className={Styles.header}>
                        <p>Funcionário:</p>
                        <h1>{funcionario.nome}</h1>
                        <span>{hoje}</span>
                        <small style={{
                            color: timeoutCounter <= 5 ? '#ff4444' :
                                timeoutCounter <= 10 ? '#fbff04' : '#969696',
                            fontSize: '12px',
                            marginTop: '10px'
                        }}>
                            {timeoutCounter > 0 ? `Retornando em ${timeoutCounter} segundos...` : 'Redirecionando...'}
                        </small>
                    </div>

                    <div className={Styles.main}>
                        <span>
                            <h1>{hora}</h1>
                        </span>
                        {!isButtonDisabled && (
                            <>
                                <p>Registrar ponto:</p>
                                <button
                                    onClick={() => handleRegistroPonto(funcionario.id)}
                                    onMouseMove={resetTimer}
                                >
                                    Registrar
                                </button>
                            </>
                        )}
                    </div>


                    <div className={Styles.footer}>
                        {
                            (() => {
                                const camposExibidos = hoje.split(',')[0] === 'sábado'
                                    ? ['entrada', 'saida']
                                    : ['entrada', 'saida_intervalo', 'retorno_intervalo', 'saida'];

                                return camposExibidos.map((campo) => (
                                    <span
                                        key={campo}
                                        style={{
                                            backgroundColor: dados?.[campo] ? 'aquamarine' : '',
                                            opacity: dados?.[campo] ? 1 : '',
                                            textTransform: 'capitalize',
                                            fontSize: '10px',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {campo.replace('_', ' ')}:
                                        <h1>{dados?.[campo] || "00:00"}</h1>
                                    </span>
                                ))
                            })()
                        }
                    </div>
                </div>
            </section>
        </Container>
    );
}

export default Registro;
