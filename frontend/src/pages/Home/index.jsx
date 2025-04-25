import styles from './Home.module.css';
import Container from "../../component/Container";
// import Header from "../../component/Header";
import Footer from '../../component/Footer';
import { api } from '../../services/api';
import { useEffect, useState } from 'react';
import BoxStatusCard from '../../components/BoxStatusCard';
import BoxBancoHoras from '../../component/BoxBancoHoras';
import BoxFuncAgrupadas from '../../component/BoxFuncAgrupadas';
import News from '../../component/News';

function Home() {
    const [data, setData] = useState([]);
    const [cargosCadastrados, setCargosCadastrados] = useState([]);
    const [visibleBoxBancoHoras, setVisibleBoxBancoHoras] = useState(false);
    const [visibleBoxFuncAgrupadas, setVisibleBoxFuncAgrupadas] = useState(false);
    const [cargoSelecionado, setCargoSelecionado] = useState(null);
    const [listaMaioresBancoHoras, setListaMaioresBancoHoras] = useState([]);

    const carregarDados = async () => {
        const response = await api.get('/funcionario');
        const data = await response.data.funcionarios;
        setData(data);
        setCargosCadastrados([...new Set(data.map(cargo => cargo.cargo))]);
    }

    useEffect(() => {
        carregarDados();
    }, []);

    const formatarHoras = (minutos) => {
        const horas = Math.floor(minutos / 60);
        const minutosRestantes = minutos % 60;
        return `${String(horas).padStart(2, '0')}:${String(minutosRestantes).padStart(2, '0')}`;
    }

    const listarExtrasDevidas = () => {
        let resultado = data.map(func => ({
            nome: func.nome,
            cargo: func.cargo,
            matricula: func.matricula,
            bancoDeHoras: func.pontos.reduce((acc, curr) => {
                const [horasExtras, minutosExtras] = curr.hora_extra.split(':').map(Number);
                const [horasDevidas, minutosDevidas] = curr.hora_devida.split(':').map(Number);
                const totalExtras = horasExtras * 60 + minutosExtras;
                const totalDevidas = horasDevidas * 60 + minutosDevidas;
                return acc + (totalExtras - totalDevidas);
            }, 0)
        }));

        // Filtra apenas os funcionários com banco de horas maior que 0
        resultado = resultado.filter(func => func.bancoDeHoras > 0);
        // Filtra apenas os funcionários com banco de horas maior que 0
        resultado = resultado.sort((a, b) => b.bancoDeHoras - a.bancoDeHoras);

        // Filtra apenas os funcionários com banco de horas maior que o corte de horas para filtrar
        // const horasParaFiltrar = 12
        // resultado = resultado.filter(func => func.bancoDeHoras >= (horasParaFiltrar * 60));

        // Selecionar apenas os 10 primeiros funcionários
        resultado = resultado.slice(0, 10);

        const resultadoFormatado = resultado.map(func => ({
            nome: func.nome,
            cargo: func.cargo,
            matricula: func.matricula,
            bancoDeHoras: formatarHoras(func.bancoDeHoras)
        }));

        setListaMaioresBancoHoras(resultadoFormatado);
        // console.log(resultadoFormatado);
    }

    useEffect(() => {
        listarExtrasDevidas();
    }, [data]);
    // listarExtrasDevidas();

    return (
        <>
            <section className={styles.homeContainer}>
                {/* <Header /> */}
                <span className={styles.dateHeader}>
                    {new Date().toLocaleDateString('pt-BR',
                        { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
                    }
                </span>
                <Container>
                    <div className={styles.mainHomeContainer}>
                        <div className={styles.homeHeaderNav}>

                            {/* Lista de Funções Agrupadas */}
                            <div className={styles.listaFuncoes}>
                                <span>Lista de Funções Agrupadas</span>

                                <article>

                                    {cargosCadastrados.map((cargo, index) => (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                setVisibleBoxFuncAgrupadas(!visibleBoxFuncAgrupadas);
                                                setCargoSelecionado(cargo); // Adicionando a seleção do cargo
                                            }}
                                        >{cargo}</div>
                                    ))}

                                </article>

                                <span></span>
                            </div>

                            {/* Lista de funcionários com mais horas extras e Horas devidas */}
                            <div className={styles.listaFuncionarios}>
                                <span
                                >Lista de funcionários com mais horas extras e Horas devidas e Banco de horas</span>

                                <article>
                                    <div
                                        onClick={() => setVisibleBoxBancoHoras(!visibleBoxBancoHoras)}
                                    >Lista dos Maiores Banco de horas</div>
                                </article>

                                <span></span>
                            </div>



                            {/* Situação de momento Funcional */}
                            <div className={styles.situacaoMomentoFuncional}>
                                <span>Situação de momento Funcional</span>

                                <BoxStatusCard />

                                <span></span>
                            </div>


                        </div>
                    </div>
                </Container>

                <News />

                {visibleBoxBancoHoras && <BoxBancoHoras listaMaioresBancoHoras={listaMaioresBancoHoras} isOpen={visibleBoxBancoHoras} setIsOpen={setVisibleBoxBancoHoras} />}
                {visibleBoxFuncAgrupadas &&
                    <BoxFuncAgrupadas isOpen={visibleBoxFuncAgrupadas} setIsOpen={setVisibleBoxFuncAgrupadas} dados={cargoSelecionado} />}
            </section>
            <Footer />
        </>
    )
}

export default Home;