import Styles from './Ponto.module.css';
import Container from './../../component/Container';
import { useRef, useState } from 'react';
import { api } from '../../services/api';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const endepoint = '/funcionario';

function Ponto() {
    const [dados, setDados] = useState([]);
    const [valueInput, setValueInput] = useState('');

    const [hoje, setHoje] = useState('');

    const inputRef = useRef(null);

    const navigate = useNavigate();

    const isDisabled = valueInput === '';

    const handleVerificarFuncionario = (e) => {
        e.preventDefault();
        // verificar se a matricula informada existe no banco de dados
        const funcionario = dados.find(func => func.matricula === valueInput);

        // funcionario não encontrado
        if (!funcionario) {
            alert("Funcionário não encontrado"); // TODO
            return;
        }

        // Ir para a tela de registro com os dados do funcionário
        navigate('/registro', { state: funcionario });
    }

    const carregarDados = async () => {
        try {
            const response = await api.get(endepoint);
            setDados(response.data.funcionarios);
        } catch (error) {
            console.error('Erro ao carregar dados do banco de dados', error);
        }
    }

    const handleDataHoje = () => {
        return new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    useEffect(() => {
        inputRef.current.focus();
        carregarDados()
        setHoje(handleDataHoje());

        // Atualizar a data ao virar o dia
        const intervalo = setInterval(() => {
            const novaData = handleDataHoje();
            if (novaData !== hoje) {
                setHoje(novaData);
            }
        }, 1000); // Verifica a cada minuto

        // Limpa o intervalo ao desmontar o componente
        return () => clearInterval(intervalo);
    }, []) // dependencia [hoje]

    return (
        <Container>
            <section className={Styles.boxPonto}>
                <div className={Styles.ponto}>

                    <form className={Styles.ponto}>

                        <h1>Vamos registrar o seu ponto?</h1>
                        
                        <span><i>{ hoje }</i></span>

                        <span>matrícula:
                            <input
                                ref={inputRef}
                                type="number"
                                onChange={(e) => setValueInput(e.target.value)}
                                value={valueInput}
                            />
                        </span>

                        <button
                            disabled={isDisabled}
                            onClick={handleVerificarFuncionario}
                            style={
                                {
                                    opacity: isDisabled ? .1 : 1,
                                    cursor: isDisabled ? 'not-allowed' : 'pointer'
                                }
                            }
                        >verificar funcionário
                        </button>

                    </form>
                </div>
            </section>
        </Container>
    )
}

export default Ponto;