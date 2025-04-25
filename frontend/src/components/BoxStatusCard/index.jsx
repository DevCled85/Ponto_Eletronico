import { useEffect, useState } from 'react';
import styles from './BoxStatusCard.module.css';
import { api, baseURL } from '../../services/api';
import BoxAusente from '../../component/BoxAusente';

const endpoint = '/funcionario';

function BoxStatusCard() {
    const status = ['trabalhando', 'intervalo', 'foraExpediente', 'ausente'];
    const [data, setData] = useState([]);
    const [visibleBoxAusente, setVisibleBoxAusente] = useState(false);

    const carregarDados = async () => {
        try {
            const response = await api.get(endpoint);
            const data = await response.data.funcionarios;
            setData(data);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
    }

    const filtrarStatus = () => {
        const hoje = new Date().toLocaleDateString('pt-BR');

        const funcionarios = data.map(funcionario => {
            const pontoHoje = funcionario.pontos?.find(ponto => ponto.data === hoje);

            if (pontoHoje) {
                const status = {
                    matricula: funcionario.matricula,
                    nome: funcionario.nome,
                    status: ''
                };

                if (pontoHoje.length) {
                    status.status = 'ausente';
                } else if (pontoHoje.saida) {
                    status.status = 'foraExpediente';
                } else if (pontoHoje?.saida_intervalo && !pontoHoje?.retorno_intervalo) {
                    status.status = 'intervalo';
                } else {
                    status.status = 'trabalhando';
                }

                return status;
            }
            return null;
        }).filter(Boolean);

        const trabalhando = funcionarios.filter(f => f.status === 'trabalhando').length;
        const intervalo = funcionarios.filter(f => f.status === 'intervalo').length;
        const foraExpediente = funcionarios.filter(f => f.status === 'foraExpediente').length;
        const ausente = data.length - trabalhando - intervalo - foraExpediente;

        return {
            trabalhando,
            intervalo,
            foraExpediente,
            ausente
        };
    }

    // Configurar um EventSource para escutar atualizações do servidor
    useEffect(() => {
        carregarDados();

        // Atualizar a URL do EventSource para corresponder à rota do backend
        const eventSource = new EventSource(`${baseURL}/ponto_updates`);
        // console.log(eventSource);

        eventSource.onmessage = (event) => {
            // Quando receber uma atualização, recarregar os dados
            carregarDados();
        };

        // Adicionar tratamento de erro
        eventSource.onerror = (error) => {
            console.error('Erro na conexão SSE:', error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div className={styles.box}>
            {status.map((item, index) => (
                filtrarStatus()[item] !== 0 && (
                    <div
                    key={index}
                    className={`${styles.spanBox} ${styles[`spanBox_${item}`]}`}
                    onClick={item === status[3] ? () => setVisibleBoxAusente(!visibleBoxAusente) : null}
                    >
                        <span className={styles.span_one}>{item}</span>
                        <span className={styles.span_two}>{filtrarStatus()[item]}</span>
                    </div>
                )
            ))}

            {visibleBoxAusente && <BoxAusente isOpen={visibleBoxAusente} setIsOpen={setVisibleBoxAusente} />}

        </div>
    )
}

export default BoxStatusCard;
