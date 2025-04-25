import { useEffect, useState, useRef } from 'react';
import Styles from './News.module.css';
import { baseURL } from '../../services/api';

// console.log(baseURL);

const timeNec = 39;

function News() {
    const [isVisibleNews, setIsVisibleNews] = useState(false); // false para esconder e true para mostrar
    const [news, setNews] = useState([]);
    const [infoNewsOpacity, setInfoNewsOpacity] = useState(0); // 0 para esconder e 1 para mostrar
    const [animationDuration, setAnimationDuration] = useState(timeNec);
    const [isServerActive, setIsServerActive] = useState(); // Novo estado para o servidor
    const newsRef = useRef(null); // referencia do container
    const newsBoxOneRef = useRef(null); // referencia do container pai
    const lastMinuteRef = useRef(null); // Referência para controlar o minuto atual

    // Função para calcular a velocidade da animação
    const calculateAnimationDuration = () => {
        if (newsRef.current) {
            const containerWidth = newsBoxOneRef.current.offsetWidth; // Usando a largura do container pai
            const textWidth = newsRef.current.scrollWidth;
            const totalDistance = textWidth + containerWidth;

            const totalItemArr = news.length;

            // Ajustando para uma velocidade mais lenta
            // Aumentando para 25 pixels por segundo para uma animação mais lenta
            // const duration = totalDistance / 25;
            // const duration = (60 / totalItemArr) > 15 ? 15 : (60 / totalItemArr);
            // const duration = ((totalItemArr + 1) * 20) > 55 ? 55 : (totalItemArr * 20);
            // setAnimationDuration(Math.max(duration, 15)); // Mínimo de 15 segundos
            if (totalItemArr <= 2) {
                setAnimationDuration(Math.max(9, 9)); // Mínimo de 20 segundos
            } else if (totalItemArr <= 4) {
                setAnimationDuration(Math.max(19, 19)); // Mínimo de 20 segundos
            } else if (totalItemArr <= 6) {
                setAnimationDuration(Math.max(29, 29)); // Mínimo de 20 segundos
            } else if (totalItemArr <= 8) {
                setAnimationDuration(Math.max(39, 39)); // Mínimo de 20 segundos
            } else {
                setAnimationDuration(Math.max(49, 49)); // Mínimo de 20 segundos
            }
        }
    };

    useEffect(() => {
        calculateAnimationDuration();
    }, [news]);

    useEffect(() => {
        const handleResize = () => {
            calculateAnimationDuration();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const eventSource = new EventSource(`${baseURL}/ponto_updates`);

        eventSource.onmessage = (event) => {
            setIsServerActive(true); // Servidor está ativo quando recebe mensagens
            if (event.data === 'ping') return;

            try {
                const data = JSON.parse(event.data);

                if (data.type === 'ponto_registrado') {
                    const currentMinute = new Date(Date.now() - 5000).getMinutes(); // Subtrai 5 segundos

                    // Se mudou o minuto, limpa o array anterior
                    if (lastMinuteRef.current !== currentMinute) {
                        setNews([]);
                        lastMinuteRef.current = currentMinute;
                    }

                    // Adiciona os novos registros ao array
                    if (Array.isArray(data.registros)) {
                        setNews(data.registros.map(registro => ({
                            id: registro.id || Date.now(),
                            message: registro.message,
                            timestamp: registro.timestamp
                        })));
                    }

                    // Mostra o container apenas se houver registros
                    if (data.registros && data.registros.length > 0) {
                        setIsVisibleNews(true);

                        // Pequeno delay para calcular a duração da animação
                        setTimeout(() => {
                            calculateAnimationDuration();
                            setInfoNewsOpacity(1);
                        }, 300);

                        // Aguarda a animação terminar antes de esconder
                        setTimeout(() => {
                            setInfoNewsOpacity(0);
                            setTimeout(() => {
                                setIsVisibleNews(false);
                            }, 10);
                        }, animationDuration * 1000);
                        // }, (animationDuration * 9000) + 100);
                    }
                }
            } catch (error) {
                console.error('Erro ao processar mensagem:', error);
            }
        };

        eventSource.onerror = (error) => {
            console.error('Erro na conexão SSE:', error);
            setIsServerActive(false); // Servidor está inativo quando há erro
            eventSource.close();
        };

        eventSource.onopen = () => {
            setIsServerActive(true); // Servidor está ativo quando a conexão é estabelecida
        };

        return () => {
            eventSource.close();
            setIsServerActive(false);
        };
    }, [animationDuration]);

    return (
        <div className={Styles.newsContainer}>
            <div className={`${Styles.newsBoxOne} ${isVisibleNews ? Styles.visible : ''}`}>
                <div ref={newsBoxOneRef} className={Styles.newsBoxOne_container}>
                    <div className={Styles.newsWrapper}>
                        <div
                            ref={newsRef}
                            className={Styles.sliceNews}
                            style={{
                                animation: isVisibleNews ? `${Styles.animTxtNews} ${animationDuration}s linear` : 'none',
                                animationPlayState: isVisibleNews ? 'running' : 'paused',
                                opacity: isVisibleNews ? 1 : 0,
                            }}
                        >
                            {news.map((item) => (
                                <small key={item.id} className={Styles.newsItem}>
                                    {item.message}
                                </small>
                            ))}
                        </div>
                    </div>

                    <div
                        className={Styles.infoNews}
                        style={{ opacity: infoNewsOpacity }}
                    >
                        news
                    </div>
                </div>
            </div>

            <div
                // onClick={() => setIsVisibleNews(!isVisibleNews)}
                className={Styles.newsBoxTwo}
            >
                <div className={isServerActive ? Styles.aspiral_one : Styles.serverInactiveOne}>
                    <div className={isServerActive ? Styles.aspiral_two : Styles.serverInactiveTwo}>
                        <div className={isServerActive ? Styles.aspiral_three : Styles.serverInactiveThree}>
                            <div className={isServerActive ? Styles.aspiral_four : Styles.serverInactiveFour}></div>
                        </div>
                    </div>
                </div>
                <p
                    className={isServerActive ? Styles.serverActiveTxt : Styles.serverInactiveTxt}
                >{isServerActive ? 'Online' : 'Offline'}</p>
            </div>
        </div>
    );
}

export default News;
