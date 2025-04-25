import Styles from './Gerenciar.module.css';
import Footer from "../../component/Footer";
import Container from '../../component/Container';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import Mensager from '../../component/utils/Mensager';

const endpoint = '/funcionario';

function Gerenciar({ isRoot }) {
    const [dateAgora, setDateAgora] = useState('');
    const [data, setData] = useState('');
    const [searcTxt, setSearcTxt] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [pesquisaTxt, setPesquisaTxt] = useState([]);
    const [pesquisado, setPesquisado] = useState({});
    const [showTable, setShowTable] = useState(false);
    const [infoHeaderFuncionario, setInfoHeaderFuncionario] = useState(false);
    const [infos, setInfos] = useState(false);

    const [horasCalculadas, setHorasCalculadas] = useState({
        extras: '00:00',
        devidas: '00:00',
        banco: '00:00',
        negativo: false,
    });

    const [horasTrabalhar, setHorasTrabalhar] = useState('00:00');
    const [saldoHoras, setSaldoHoras] = useState('00:00');

    const [alerta, setAlerta] = useState({ type: '', msg: '' });

    const carregarDados = async () => {
        const db = await api.get(endpoint);
        const dados = db.data.funcionarios;
        setData(dados);
    }

    const handleSeach = () => {
        const filter = data.filter(func => func.nome.toLowerCase().includes(searcTxt.toLowerCase())
            || func.cargo.toLowerCase().includes(searcTxt.toLowerCase())
            || func.matricula.toLowerCase().includes(searcTxt.toLowerCase()));
        setPesquisaTxt(filter);
    }

    const handleFormatDateWeenkled = (dataDado) => {
        const [dd, mm, yy] = dataDado.split('/');
        return new Date(yy, mm - 1, dd).toLocaleDateString('pt-BR', { weekday: 'long' });
    }

    const handleDateAgora = () => {
        setDateAgora(
            new Date().toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        )
    }

    // console.log(pesquisado);

    const handle_itemPesquisado = (item) => {
        setPesquisado(item);
        setSearcTxt(item.nome);
        setInfoHeaderFuncionario(true);
        setInfos(true);
        setShowResults(false);
        setShowTable(true);
        setPesquisaTxt([]);
    }

    const handleSearchInput = (e) => {
        const value = e.target.value;
        setSearcTxt(value);

        if (value.trim() === '') {
            setShowResults(false);
            setShowTable(false);
            setPesquisaTxt([]);
            setInfoHeaderFuncionario(false);
            setInfos(false);
        } else if (!showTable) {
            handleSeach();
            setShowResults(true);
        }
    };

    const handleCalcHoras = () => {
        // if (!pesquisado || !pesquisado.pontos) return { extras: '00:00', devidas: '00:00', banco: '00:00', negativo: false };
        if (!pesquisado || !pesquisado.pontos) {
            setHorasCalculadas({ extras: '00:00', devidas: '00:00', banco: '00:00', negativo: false });
            return;
        }

        // horas extras
        const totalHorasExtras = pesquisado.pontos
            .filter(ponto => ponto.hora_extra && ponto.hora_extra !== '00:00')
            .reduce((total, ponto) => {
                const [horas, minutos] = ponto.hora_extra.split(':').map(Number);
                return total + horas * 60 + minutos;
            }, 0)

        const horasExtras = Math.floor(totalHorasExtras / 60);
        const minutosExtras = totalHorasExtras % 60;

        // horas devidas
        const totalHorasDevidas = pesquisado.pontos
            .filter(ponto => ponto.hora_devida && ponto.hora_devida !== '00:00')
            .reduce((total, ponto) => {
                const [horas, minutos] = ponto.hora_devida.split(':').map(Number);
                return total + horas * 60 + minutos;
            }, 0)

        const horasDevidas = Math.floor(totalHorasDevidas / 60);
        const minutosDevidas = totalHorasDevidas % 60;

        const bancoHoras = totalHorasExtras - totalHorasDevidas;
        const bancoHoras_horas = Math.floor(bancoHoras / 60);
        const bancoHoras_minutos = bancoHoras % 60;
        let resultadoBancoHoras
        if (bancoHoras < 0) {
            const bc = totalHorasDevidas - totalHorasExtras;
            const bc_hora = Math.floor(bc / 60);
            const bc_minuto = Math.floor(bc % 60);
            resultadoBancoHoras = `- ${bc_hora.toString().padStart(2, '0')}:${bc_minuto.toString().padStart(2, '0')}`
        } else {
            resultadoBancoHoras = `${bancoHoras_horas.toString().padStart(2, '0')}:${bancoHoras_minutos.toString().padStart(2, '0')}`
        }

        setHorasCalculadas({
            extras: `${horasExtras.toString().padStart(2, '0')}:${minutosExtras.toString().padStart(2, '0')}`,
            devidas: `${horasDevidas.toString().padStart(2, '0')}:${minutosDevidas.toString().padStart(2, '0')}`,
            banco: resultadoBancoHoras,
            negativo: bancoHoras < 0,
        });
    }
    // const { extras, devidas, banco, negativo } = handleCalcHoras();

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searcTxt.length >= 3) {
                setShowResults(true);
                handleSeach();
            } else {
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searcTxt]);

    useEffect(() => {
        carregarDados();
        handleDateAgora();
    }, []);

    const mostrarAlerta = (type, msg) => {
        setAlerta({ type, msg });
        setTimeout(() => {
            setAlerta({ type: '', msg: '' });
        }, 5000);
    };

    const handleSubmitUpadtePontos = async (qualPonto, { id }, ponto) => {
        // Verificar se o usuario não é root, so podera alterar ponto sem registro.
        if (isRoot || !ponto[qualPonto]) {
            let verificarPonto = null;

            while (true) {
                verificarPonto = prompt('Digite o horário para registro no formato HH:MM:');
                if (!verificarPonto) return; // Interromper se o usuário cancelar
                if (/^\d{2}:\d{2}$/.test(verificarPonto)) {
                    const [hours, minutes] = verificarPonto.split(':').map(Number);
                    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) break;
                }
                alert('Formato inválido! Use HH:MM (exemplo: 08:30)');
            }

            try {
                await api.patch(`${endpoint}/pontos/reg/${id}`, {
                    data: ponto.data,
                    registro: qualPonto,
                    hora: verificarPonto
                });

                // Mensagem específica para root ou usuário normal
                if (isRoot) {
                    mostrarAlerta('success', `Registro ${qualPonto.replace('_', ' ')} alterado com sucesso!`);
                } else {
                    mostrarAlerta('success', `Registro de ${qualPonto.replace('_', ' ')} efetuado!`);
                }

                // Atualiza os dados
                const response = await api.get(endpoint);
                const funcionarioAtualizado = response.data.funcionarios.find(f => f.id === id);
                setPesquisado(funcionarioAtualizado);
                handleCalcHoras();

            } catch (error) {
                console.error('Erro ao atualizar registro:', error);
                mostrarAlerta('error', 'Erro ao atualizar registro. Tente novamente.');
            }
        } else {
            mostrarAlerta('warning', 'Você não tem permissão para alterar registros já existentes!');
        }
    };

    const formatDataCount = (data) => {
        let ehSabado = 0, notSabado = 0;

        const dataInFormat = data?.map(ponto => {
            const [dd, mm, yy] = ponto?.split('/');
            return new Date(yy, mm - 1, dd).getDay()
        })

        dataInFormat?.forEach(dia => {
            if (dia === 6) {
                ehSabado += 1;
            } else {
                notSabado += 1;
            }
        });
        return (ehSabado * 4) + (notSabado * 8);
    }

    const countHoursToWork = () => {
        const horasTrabalhar = formatDataCount(pesquisado.pontos?.map(ponto => ponto.data))

        setHorasTrabalhar(`${horasTrabalhar} Hrs`);
    }

    useEffect(() => {
        countHoursToWork();
        handleCalcHoras();
    }, [pesquisado])

    return (
        <section className={Styles.boxContaninerGerenciar}>

            {alerta.msg && <Mensager key={Date.now()} type={alerta.type} msg={alerta.msg} />}

            <Container>

                <div className={Styles.container_gerenciar}>

                    <span className={Styles.dataAgora}>{dateAgora}</span>

                    <div className={Styles.containerTable}>

                        <div className={Styles.boxTable}>

                            <div className={Styles.headerBoxCont}>
                                <div>
                                    <div><i>Funcionario:</i>
                                        <div className={Styles.boxInput_}>
                                            <input
                                                type="search"
                                                value={searcTxt}
                                                onChange={handleSearchInput}
                                            />

                                            {/* Resultados da busca só aparecem se não houver tabela visível */}
                                            {!showTable && showResults && (
                                                <div className={Styles.resultSearch}>
                                                    <table border={1}>
                                                        <thead>
                                                            <tr>
                                                                <th>nome:</th>
                                                                <th>matricula:</th>
                                                                <th>cargo:</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {pesquisaTxt.map(item => (
                                                                <tr
                                                                    key={item.id}
                                                                    onClick={() => handle_itemPesquisado(item)}
                                                                >
                                                                    <td>{item.nome}</td>
                                                                    <td>{item.matricula}</td>
                                                                    <td>{item.cargo}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}

                                        </div>


                                    </div>
                                    <div
                                        style={{
                                            opacity: infoHeaderFuncionario ? '1' : '0'
                                        }}
                                    >
                                        <span><i>matricula:</i><b>{pesquisado.matricula}</b></span>
                                        <span><i>cargo:</i><b>{pesquisado.cargo}</b></span>
                                    </div>
                                </div>
                            </div>

                            {/* aqui começa a table */}

                            <div className={Styles.tableOff}>

                                {
                                    <table
                                        border={0}
                                        style={{ display: showTable ? '' : 'none' }}
                                    >
                                        <thead>
                                            <tr>
                                                <th>data</th>
                                                <th>dia</th>
                                                <th>entrada</th>
                                                <th>saida intervalo</th>
                                                <th>retorno intervalo</th>
                                                <th>saida</th>
                                                <th>hora extra</th>
                                                <th>hora devida</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {
                                                pesquisado && pesquisado.pontos ? (
                                                    pesquisado.pontos.map((ponto, index) => {
                                                        const diaSemana = handleFormatDateWeenkled(ponto.data);

                                                        return (
                                                            <tr key={index}>
                                                                <td>{ponto.data}</td>
                                                                <td>{diaSemana}</td>
                                                                <td
                                                                    onClick={() => handleSubmitUpadtePontos('entrada', pesquisado, ponto)}
                                                                >{ponto.entrada}</td>
                                                                <td
                                                                    style={{
                                                                        // cursor: diaSemana === 'sábado' ? 'not-allowed' : 'pointer',
                                                                        pointerEvents: diaSemana === 'sábado' ? 'none' : 'auto'
                                                                    }}
                                                                    onClick={() => handleSubmitUpadtePontos('saida_intervalo', pesquisado, ponto)}
                                                                >{diaSemana === 'sábado' ? '-:-' : ponto.saida_intervalo}</td>
                                                                <td
                                                                    style={{
                                                                        // cursor: diaSemana === 'sábado' ? 'not-allowed' : 'pointer',
                                                                        pointerEvents: diaSemana === 'sábado' ? 'none' : 'auto'
                                                                    }}
                                                                    onClick={() => handleSubmitUpadtePontos('retorno_intervalo', pesquisado, ponto)}
                                                                >{diaSemana === 'sábado' ? '-:-' : ponto.retorno_intervalo}</td>
                                                                <td
                                                                    onClick={() => handleSubmitUpadtePontos('saida', pesquisado, ponto)}
                                                                >{ponto.saida}</td>
                                                                <td
                                                                    style={{
                                                                        backgroundColor: ponto.hora_extra !== '00:00' ? 'rgba(188, 255, 173, 0.5)' : '',
                                                                        color: ponto.hora_extra !== '00:00' ? '#2b5e1f' : '',
                                                                    }}
                                                                >{ponto.hora_extra}</td>
                                                                <td
                                                                    style={{
                                                                        backgroundColor: ponto.hora_devida !== '00:00' ? 'rgba(255, 173, 173, 0.5)' : '',
                                                                        color: ponto.hora_devida !== '00:00' ? '#5e1f1f' : '',
                                                                    }}
                                                                >{ponto.hora_devida}</td>
                                                            </tr>
                                                        )
                                                    })
                                                ) : (
                                                    <tr>
                                                        <td colSpan={8}>
                                                            Nenhum dado disponível
                                                        </td>
                                                    </tr>
                                                )
                                            }

                                        </tbody>
                                    </table>
                                }

                            </div>

                        </div>

                        {
                            infos && (
                                <div className={Styles.boxInfos}>
                                    <div>
                                        <div className={Styles.headerBoxCont}>horas trabalhadas</div>
                                        <div className={Styles.bottomBoxCont}>{horasTrabalhar || '00:00'}</div>
                                    </div>
                                    <div>
                                        <div className={Styles.headerBoxCont}>horas totais extras</div>
                                        <div className={Styles.bottomBoxCont}>{horasCalculadas.extras}</div>
                                    </div>
                                    <div>
                                        <div className={Styles.headerBoxCont}>horas totais devedoras</div>
                                        <div className={Styles.bottomBoxCont}>{horasCalculadas.devidas}</div>
                                    </div>
                                    <div>
                                        <div className={Styles.headerBoxCont}>banco de horas</div>
                                        <div
                                            className={Styles.bottomBoxCont}
                                            style={{
                                                backgroundColor: horasCalculadas.negativo ? 'rgba(255, 173, 173, 0.5)' : '',
                                                color: horasCalculadas.negativo ? '#5e1f1f' : '',
                                            }}
                                        >{horasCalculadas.banco}</div>
                                    </div>
                                </div>
                            )
                        }

                    </div>

                </div>

            </Container>

            <Footer />
        </section>
    )
}

export default Gerenciar;