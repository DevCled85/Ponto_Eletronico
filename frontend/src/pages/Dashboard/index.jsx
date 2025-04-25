import Styles from './Dashboard.module.css';
import Footer from "../../component/Footer";
import { useEffect, useState, useCallback, useMemo } from 'react';
import { api } from '../../services/api';
import Loader from '../../components/Loader';
import Calendar from '../../components/Calendar';

const endpoint = '/funcionario'

function Dashboard() {
    // Estado para armazenar os dados carregados
    const [data, setData] = useState([]);
    // const [selectDate, setSelectDate] = useState(() => new Date().toLocaleDateString('pt-BR'));

    const [txtSituation_filter, setTxtSituation_filter] = useState('');

    const [loading, setLoading] = useState(false);

    const [showCalendar, setShowCalendar] = useState(false);
    const [dataSelecionada, setDataSelecionada] = useState(null);

    // Se for sábado {true} se for qualquer outro dia então {false}
    const [daySemana, setDaySemana] = useState(false);
    const handleDaySemana = () => {
        return new Date().toLocaleDateString('pt-BR', {
            weekday: 'long'
        }) === 'sábado' ? setDaySemana(true) : setDaySemana(false)
    }

    // Determina a situação do funcionário
    const handleSituationFunc = (ponto) => {
        if (!ponto || !ponto.entrada) {
            return 'Ausente'
        } else if (ponto.saida_intervalo && !ponto.retorno_intervalo) {
            return 'Intervalo'
        } else if (ponto.saida) {
            return 'Fora do expediente'
        }
        return 'Trabalhando';
    }

    // Função para carregar os dados dos funcionários
    const carregarDados = async () => {
        try {
            const response = await api.get(endpoint);
            const funcionarios = response.data.funcionarios || []; // Evita erro se não existir 'funcionarios'

            // Armazena os dados no estado
            setData(funcionarios)
            setLoading(true)
        } catch (error) {
            console.error('Erro ao carregar os dados:', error);
        }
    }

    const dataCurrentDay = (data, of) => {
        if (of) {
            return new Date(data.year, data.month, data.day).toLocaleDateString('pt-BR');
        }

        if (data) {
            return new Date(data.year, data.month, data.day).toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        }

        return new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

    };

    // Converte um horário no formato HH:MM para segundos
    const timeToSeconds = (time) => {
        if (!time) return 0;
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + (seconds || 0);
    }

    const timeToHorasMinutes = (time, secondsTrue = true, timestamp = false) => {
        const horas = Math.floor(time / 3600)
        const minutos = Math.floor((time % 3600) / 60)
        const segundos = time % 60

        if (timestamp) {
            return horas * 3600 + minutos * 60 + segundos;
        }

        if (secondsTrue) {
            return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        } else {
            return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
        }

    }

    //! Calcula o tempo restante ou hora extra baseado nos pontos registrados
    const calculateTimeStatus = (ponto, sliceBorderBottomWidth, ordenation) => {
        if (!ponto || !ponto.data) return null;
        // if (!ponto || !ponto.data) return 'sem registros';
        const horaAgora = timeToSeconds(new Date().toLocaleTimeString('pt-BR'));
        const entrada = timeToSeconds(ponto?.entrada);
        const saida_intervalo = timeToSeconds(ponto?.saida_intervalo);
        const retorno_intervalo = timeToSeconds(ponto?.retorno_intervalo);
        const saida = timeToSeconds(ponto?.saida);

        // Formatação de data
        const semanaSplitada = ponto.data.split('/').reverse();
        const semanaFormatada = new Date(`${semanaSplitada[0]}/${semanaSplitada[1]}/${semanaSplitada[2]}`);
        const semana = semanaFormatada.toLocaleDateString('pt-BR', { weekday: 'long' });
        const jorHoras = semana === 'sábado' ? 4 : 8; // Verifica se é sábado, jornada de 4 horas 8
        const jornada = jorHoras * 3600; // Jornada de trabalho em segundos (8h ou 4h)

        let horasTrabalhada = 0;
        let timerOrdenation = 0;

        // Cálculo de horas trabalhadas
        if (semana === 'sábado') {
            if (entrada) {
                horasTrabalhada += (saida || horaAgora) - entrada;
            }
        } else {
            if (entrada) {
                horasTrabalhada += (saida_intervalo || horaAgora) - entrada;
            }
            if (retorno_intervalo) {
                horasTrabalhada += (saida || horaAgora) - retorno_intervalo;
            }
        }

        // Verifica se a jornada foi cumprida ou se há horas extras/devidas
        const situacaoHora = horasTrabalhada === jornada ? 'zerada' : horasTrabalhada > jornada ? 'extra' : 'devida';

        if (ordenation) {
            timerOrdenation = timeToHorasMinutes(jornada - horasTrabalhada, false, true);
            return { timerOrdenation };
        }

        if (!sliceBorderBottomWidth) {
            // Retorna a descrição das horas extras ou devidas
            switch (situacaoHora) {
                case 'extra':
                    return <b style={{
                        color: '#51E72B',
                        // color: '#242424',
                        backgroundColor: '#034703',
                        border: '1px solid #33ff00',
                        borderRadius: 3,
                        padding: '5px',
                        // margin: '0px 4px',
                        fontSize: 9,
                        width: '90px',
                        textAlign: 'center'
                    }}>
                        {/* hora extra: {timeToHorasMinutes(horasTrabalhada - jornada)} */}
                        hora extra: {handleSituationFunc(ponto) === 'Ausente' || handleSituationFunc(ponto) === 'Fora do expediente' ?
                            timeToHorasMinutes(horasTrabalhada - jornada, false) :
                            timeToHorasMinutes(horasTrabalhada - jornada)
                        }
                    </b>

                case 'devida':
                    return <b
                        style={{
                            color: '#fff',
                            fontSize: 9,
                            // backgroundColor: '#fff',
                            // backgroundColor: '#242424',
                            backgroundColor: '#e01010',
                            // border: '1px solid #fff',
                            border: '1px solid #fbff01',
                            borderRadius: 3,
                            padding: '5px',
                            fontWeight: 'bold',
                            fontStyle: 'normal',
                            width: '90px',
                            textAlign: 'center'
                        }}
                    // >devida: {timeToHorasMinutes(jornada - horasTrabalhada)}</b>
                    >devida: {
                            handleSituationFunc(ponto) === 'Intervalo' || handleSituationFunc(ponto) === 'Fora do expediente' ?
                                timeToHorasMinutes(jornada - horasTrabalhada, false) :
                                timeToHorasMinutes(jornada - horasTrabalhada)
                        }
                    </b>
                default:
                    return;
            }
        } else {
            const timePorcent = (horasTrabalhada / jornada) * 100 || 0;
            const timePorcentFormat = timePorcent + '%' || 0

            return { timePorcent, timePorcentFormat, timerOrdenation };
        }
    };

    // Efeito para carregar os dados ao montar o componente
    useEffect(() => {
        carregarDados();
        handleDaySemana();
    }, [data]); //! Dependência vazia garante execução apenas uma vez

    // Memoização de funções de callback
    const countEmployees = useCallback((situation) => {
        return data.filter(func => {
            const ponto = func.pontos?.find(ponto =>
                ponto.data === new Date().toLocaleDateString('pt-BR'));
            return handleSituationFunc(ponto) === situation;
        }).length || '';
    }, [data]);

    // Uso de useMemo para cálculos pesados
    const employeeCounts = useMemo(() => ({
        working: countEmployees('Trabalhando'),
        break: countEmployees('Intervalo'),
        absent: countEmployees('Ausente'),
        offDuty: countEmployees('Fora do expediente')
    }), [countEmployees]);

    let timeStatus;
    let situationFunc;

    // console.log(dataSelecionada);
    

    // const handleDateClick = (date) => {
    //     console.log("Dia clicado:", date); // Para depuração
    //     if (date && !date.faded) {
    //         setShowCalendar(false); // Fecha o calendário
    //         console.log("Calendário fechado"); // Para depuração
    //     }
    // };

    // const now = new Date();
    // const currentMonth = now.getMonth(); // Mês atual (0 = Janeiro)
    // const currentYear = now.getFullYear(); // Ano atual


    // useEffect(() => {
    //     console.log("Estado do calendário:", onDateSelect); // Para depuração
    // }, [showCalendar]);

    return (
        <section>
            {!loading ? <Loader /> : (
                <main className={Styles.mainDashboard}>
                    <span
                        className={Styles.spanDate}
                        onClick={() => setShowCalendar(!showCalendar)}
                    >
                        {dataCurrentDay(dataSelecionada)}
                        {showCalendar && (
                            <Calendar
                                // month={currentMonth}
                                // year={currentYear}
                                // onDateSelect={handleDateClick}
                                // isOpen={showCalendar}
                                isSetOpen={setShowCalendar}
                                dataSelecionada={setDataSelecionada}
                            />
                        )}
                    </span>

                    <div style={{
                        gap: '10px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: '#242424',
                        width: '100%',
                        display: employeeCounts.working || employeeCounts.break || employeeCounts.absent || employeeCounts.offDuty ? 'flex' : 'none'
                    }}> <b
                        style={{
                            cursor: 'pointer'
                        }}
                        onClick={() => setTxtSituation_filter('')}
                    >Funcionarios:</b>

                        {employeeCounts.working && (
                            <p style={{
                                fontSize: '10px',
                                backgroundColor: '#51e72b',
                                padding: '5px 10px',
                                fontSize: '12px',
                                color: '#0d3b01',
                                borderRadius: '4px',
                                width: '150px',
                                cursor: 'pointer',
                                textAlign: 'center'
                            }}
                                onClick={() => setTxtSituation_filter('Trabalhando')}
                            ><i>Trabalhando:</i> <b>{employeeCounts.working}</b></p>
                        )}

                        {employeeCounts.break && (
                            <p style={{
                                fontSize: '10px',
                                backgroundColor: '#fbff04',
                                padding: '5px 10px',
                                fontSize: '12px',
                                color: '#565701',
                                borderRadius: '4px',
                                width: '150px',
                                cursor: 'pointer',
                                textAlign: 'center'
                            }}
                                onClick={() => setTxtSituation_filter('Intervalo')}
                            ><i>Intervalo:</i> <b>{employeeCounts.break}</b></p>
                        )}

                        {employeeCounts.absent && (
                            <p style={{
                                fontSize: '10px',
                                backgroundColor: '#eaeaea',
                                padding: '5px 10px',
                                fontSize: '12px',
                                color: '#565701',
                                borderRadius: '4px',
                                width: '150px',
                                cursor: 'pointer',
                                textAlign: 'center'
                            }}
                                onClick={() => setTxtSituation_filter('Ausente')}
                            ><i>Ausente:</i> <b>{employeeCounts.absent}</b></p>
                        )}

                        {employeeCounts.offDuty && (
                            <p style={{
                                fontSize: '10px',
                                backgroundColor: '#242424',
                                padding: '5px 10px',
                                fontSize: '12px',
                                color: '#c4c4c4',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                textAlign: 'center'
                            }}
                                onClick={() => setTxtSituation_filter('Fora do expediente')}
                            ><i>Fora do expediente:</i> <b>{employeeCounts.offDuty}</b></p>
                        )}

                    </div>

                    {/* depois passar filtro para renderizar apenas cards personalizados */}
                    <div className={Styles.container_box_cards}>
                        {/* Renderiza os cards apenas se houver dados */}
                        {
                            data.length > 0 ? (

                                [...data]

                                    .filter(func => {
                                        // Filtra os funcionários "Ausentes"
                                        const ponto = func.pontos?.find(p => p.data === new Date().toLocaleDateString('pt-BR')) || {}
                                        // const ponto = func.pontos?.find(p => p.data === dataCurrentDay(dataSelecionada)) || {}
                                        return txtSituation_filter ? handleSituationFunc(ponto) === txtSituation_filter : ponto;
                                    })

                                    // .filter(item => item.pontos?.find(p => p.data === new Date().toLocaleDateString('pt-BR')))
                                    .sort((a, b) => {
                                        // Recupera os pontos dos funcionários para o dia atual
                                        // const pontoA = a.pontos?.find(p => p.data === new Date().toLocaleDateString('pt-BR')) || {};
                                        // const pontoB = b.pontos?.find(p => p.data === new Date().toLocaleDateString('pt-BR')) || {};
                                        const pontoA = a.pontos?.find(dataSelecionada ? p => p.data === dataCurrentDay(dataSelecionada, true) : p => p.data === dataCurrentDay(dataSelecionada)) || {};
                                        const pontoB = b.pontos?.find(dataSelecionada ? p => p.data === dataCurrentDay(dataSelecionada, true) : p => p.data === dataCurrentDay(dataSelecionada)) || {};

                                        // Calcula o tempo restante ou horas extras usando a função `calculateTimeStatus`
                                        const timerA = calculateTimeStatus(pontoA, false, true)?.timerOrdenation || 0;
                                        const timerB = calculateTimeStatus(pontoB, false, true)?.timerOrdenation || 0;

                                        // encontrar horas extras
                                        const isDevidaA = timerA > 0;
                                        const isDevidaB = timerB > 0;

                                        if (isDevidaA && isDevidaB) {
                                            return timerA - timerB;
                                        }

                                        if (!isDevidaA && !isDevidaB) {
                                            return timerA - timerB;
                                        }

                                        if (isDevidaA && !isDevidaB) {
                                            return timerB - timerA;
                                        }
                                    })
                                    .map(funcionario => {
                                        // Filtra os registro de ponto para o dia corrente
                                        const ponto = funcionario.pontos?.find(
                                            dataSelecionada ? ponto => ponto.data === dataCurrentDay(dataSelecionada, true) : ponto => ponto.data === new Date().toLocaleDateString('pt-BR')
                                        ) || {}; // Fallback para objeto vazio se não houver registro

                                        // const situationFunc = handleSituationFunc(ponto);
                                        situationFunc = handleSituationFunc(ponto);

                                        // Calcula o tempo restante ou hora extra
                                        timeStatus = calculateTimeStatus(ponto, '');
                                        const sliceWiddBottom_time = calculateTimeStatus(ponto, true);

                                        return (

                                            <div key={funcionario.id} className={Styles.card}>

                                                <div
                                                    className={Styles.card_header}
                                                    style={{
                                                        backgroundColor: situationFunc === 'Trabalhando' ? '#51e72b' :
                                                            situationFunc === 'Intervalo' ? '#fbff04' :
                                                                situationFunc === 'Ausente' ? 'gray' : '',
                                                        position: 'relative',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            right: 0,
                                                            bottom: 0,
                                                            width: sliceWiddBottom_time?.timePorcent < 100 ? sliceWiddBottom_time?.timePorcentFormat : '0%',
                                                            height: '100%',
                                                            borderBottom: '5px solid #242424'
                                                        }}
                                                    ></div>

                                                    <div
                                                        className={Styles.card_header__one}
                                                        style={{
                                                            color: situationFunc === 'Trabalhando' ? '#0d3b01' :
                                                                situationFunc === 'Intervalo' ? '#565701' :
                                                                    situationFunc === 'Ausente' ? '#eaeaea' : '#ababab',
                                                            zIndex: 1000
                                                        }}
                                                    >
                                                        <span><i>Funcionário: <b>{funcionario.nome}</b></i></span>
                                                        <span>
                                                            <span style={{ display: 'flex', gap: 5, alignItems: 'center', justifyContent: 'space-between', width: '340px' }}>
                                                                <p>Cargo: {funcionario.cargo} | Matrícula:{funcionario.matricula}</p> <p>{timeStatus}</p>
                                                            </span>
                                                        </span>
                                                    </div>

                                                    {/* Aplicando a classe que contém a animação */}
                                                    <div
                                                        className={Styles.card_header__two}
                                                        style={{
                                                            color: situationFunc === 'Trabalhando' ? '#0d3b01' :
                                                                situationFunc === 'Ausente' ? '#eaeaea' :
                                                                    situationFunc === 'Intervalo' ? '#565701' : '#adadad',
                                                            textAlign: 'center'
                                                        }}
                                                    >
                                                        {situationFunc}
                                                    </div>

                                                </div>

                                                {
                                                    daySemana ? (
                                                        <div className={Styles.card_main}>

                                                            <div className={Styles.main__box}>
                                                                <p>Entrada:</p>
                                                                <span
                                                                    style={{
                                                                        opacity: ponto.entrada ? 1 : .25,
                                                                        backgroundColor: ponto.entrada ? '#69a369' : ''
                                                                    }}
                                                                >{ponto.entrada || '-:-'}</span>
                                                            </div>

                                                            <div className={Styles.main__box}>
                                                                <p>Saída:</p>
                                                                <span
                                                                    style={{
                                                                        opacity: ponto.saida ? 1 : .25,
                                                                        backgroundColor: ponto.saida ? '#69a369' : ''
                                                                    }}
                                                                >{ponto.saida || '-:-'}</span>
                                                            </div>

                                                        </div>
                                                    )
                                                        : (
                                                            <div className={Styles.card_main}>

                                                                <div className={Styles.main__box}>
                                                                    <p>Entrada:</p>
                                                                    <span
                                                                        style={{
                                                                            opacity: ponto.entrada ? 1 : .25,
                                                                            backgroundColor: ponto.entrada ? '#69a369' : ''
                                                                        }}
                                                                    >{ponto.entrada || '-:-'}</span>
                                                                </div>

                                                                <div className={Styles.main__box}>
                                                                    <p>Saída Intervalo:</p>
                                                                    <span
                                                                        style={{
                                                                            opacity: ponto.saida_intervalo ? 1 : .25,
                                                                            backgroundColor: ponto.saida_intervalo ? '#69a369' : ''
                                                                        }}
                                                                    >{ponto.saida_intervalo || '-:-'}</span>
                                                                </div>

                                                                <div className={Styles.main__box}>
                                                                    <p>Retorno Intervalo:</p>
                                                                    <span
                                                                        style={{
                                                                            opacity: ponto.retorno_intervalo ? 1 : .25,
                                                                            backgroundColor: ponto.retorno_intervalo ? '#69a369' : ''
                                                                        }}
                                                                    >{ponto.retorno_intervalo || '-:-'}</span>
                                                                </div>

                                                                <div className={Styles.main__box}>
                                                                    <p>Saída:</p>
                                                                    <span
                                                                        style={{
                                                                            opacity: ponto.saida ? 1 : .25,
                                                                            backgroundColor: ponto.saida ? '#69a369' : ''
                                                                        }}
                                                                    >{ponto.saida || '-:-'}</span>
                                                                </div>

                                                            </div>
                                                        )
                                                }

                                            </div>

                                        )
                                    })

                            ) : <p>Nenhum funcionário encontrado...</p>
                        }

                    </div>

                </main>
            )}
            <Footer />
        </section>
    )
}

export default Dashboard;
