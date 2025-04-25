import { useEffect, useState } from 'react';
import styles from './BoxAusente.module.css';
import { api } from '../../services/api';

function BoxAusente({ isOpen, setIsOpen }) {
    const [dados, setDados] = useState([]);
    const [funcAusentes, setFuncAusentes] = useState([]);
    const [funcSelecionada, setFuncSelecionada] = useState({});

    const carregarDados = async () => {
        const hoje = new Date().toLocaleDateString('pt-BR'); // retirar a data depois de feito o teste 2025, 0, 21
        const response = await api.get('/funcionario');
        const data = response.data.funcionarios;
        const ausentes = data.filter(func => !func.pontos
            ?.filter(ponto => ponto.data === hoje)
            ?.some(ponto => ponto.entrada));

        setFuncAusentes(ausentes);
        setDados(data);

        const inicialSelecionada = {};
        ausentes.forEach(func => {
            inicialSelecionada[func.id] = 'ausente';
        });

        setFuncSelecionada(inicialSelecionada);
    }

    useEffect(() => {
        carregarDados();
    }, []);

    const handleSalvar = async (id) => {
        const dateCurrent_log = new Date().toLocaleDateString('pt-BR'); // retirar a data depois de feito o teste 2025, 0, 21
        const hoursCurrent_log = new Date().toLocaleTimeString('pt-BR');

        // estrutura do log que sera enviado para o banco de dados
        const log = [
            {
                type: funcSelecionada[id],
                dateCurrent: dateCurrent_log,
                hoursCurrent: hoursCurrent_log,
                message: ""
            }
        ]

        console.log(log);
        

        // FOLGA -> nada a fazer
        // ATESTADO -> zera horas
        // FALTA: -> zera horas e 08:00 devidas
        // COMPENSAR -> verificar se tem mais de 8 horas de banco e compensar. Se tiver menos, so com senha root
        // AUSENTE -> se nada for feito travar o sistma ate que seja feito algo

        // em todos os casos gravar log do que foi feito no ponto da data corrente
    }


    const handleHoras = (pontos) => {
        const horasExtras = pontos.reduce((total, ponto) => {
            return total + (ponto.hora_extra ? parseHoras(ponto.hora_extra) : 0);
        }, 0);

        const horasDevidas = pontos.reduce((total, ponto) => {
            return total + (ponto.hora_devida ? parseHoras(ponto.hora_devida) : 0);
        }, 0);

        const bancoHoras = horasExtras - horasDevidas;

        return formatarHoras(bancoHoras);
    }

    const parseHoras = (horas) => {
        const [horasInt, minutosInt] = horas.split(':').map(Number);
        return horasInt * 60 + minutosInt; // Converte para minutos
    }

    const formatarHoras = (minutos) => {
        const horas = Math.floor(minutos / 60);
        const minutosRestantes = minutos % 60;
        return `${String(horas).padStart(2, '0')}:${String(minutosRestantes).padStart(2, '0')}`;
    }

    return (
        <div className={styles.boxContainerAusente}>
            <div className={styles.boxAusente}>
                <div className={styles.boxAusente_header}>Funcionários Ausentes
                    <span onClick={() => setIsOpen(!isOpen)}>X</span>
                </div>
                <div className={styles.boxAusente_content}>
                    {funcAusentes.length > 0 ? (
                        <table className={styles.tableAusente}>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Matrícula</th>
                                    <th>Cargo</th>
                                    <th>Horas</th>
                                    <th>Situação</th>
                                    <th>Opt.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {funcAusentes.map(func => (
                                    <tr key={func.id}>
                                        <td>{func.nome}</td>
                                        <td>{func.matricula}</td>
                                        <td>{func.cargo}</td>
                                        <td>{handleHoras(func.pontos)}</td>
                                        <td>
                                            <select
                                                className={styles.selectAusente}
                                                onChange={e => setFuncSelecionada(prev => ({ ...prev, [func.id]: e.target.value }))}
                                            >
                                                <option value="ausente">Ausente</option>
                                                <option value="falta">Falta</option>
                                                <option value="folga">Folga</option>
                                                <option value="atestado">Atestado</option>
                                                <option value="compensar">Compensar</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                className={`${funcSelecionada[func.id] === 'ausente' ? styles.buttonNotAusente : styles.buttonAusente}`}
                                                onClick={() => handleSalvar(func.id)}
                                            >Salvar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className={styles.boxAusente_content_footer}>
                            Sem dados para exibir...
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BoxAusente;
