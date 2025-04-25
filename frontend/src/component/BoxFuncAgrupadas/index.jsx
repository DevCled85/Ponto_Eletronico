import { useEffect, useState } from 'react';
import styles from './BoxFuncAgrupadas.module.css';
import { api } from '../../services/api';

function BoxFuncAgrupadas({ isOpen, setIsOpen, dados }) {
    const [funcionarios, setFuncionarios] = useState([]);
    const [cargoFiltrado, setCargoFiltrado] = useState([]);
    const [nomeCargos, setNomeCargos] = useState([]);
    const [cargoSelecionado, setCargoSelecionado] = useState(dados);

    const carregarFuncionarios = async () => {
        const response = await api.get(`/funcionario`);
        setFuncionarios(response.data.funcionarios);
    }

    const filtrarCargos = () => {
        const cargoFiltrado = funcionarios.filter(funcCargo => funcCargo.cargo === cargoSelecionado);
        cargoFiltrado.sort((a, b) => a.nome.localeCompare(b.nome));

        const cargosx = funcionarios.filter(funcCargo => funcCargo.cargo !== dados).map(funcCargo => funcCargo.cargo);
        cargosx.sort((a, b) => a.localeCompare(b));
        const newCargos = [...new Set(cargosx)];

        setNomeCargos(newCargos);
        setCargoFiltrado(cargoFiltrado);
    }

    useEffect(() => {
        carregarFuncionarios();
    }, []);

    useEffect(() => {
        filtrarCargos();
    }, [cargoSelecionado, funcionarios]);

    return (
        <div className={styles.boxFuncAgrupadasContainer}>

            <div className={styles.boxFuncAgrupadas}>

                <div className={styles.header}>
                    <select
                        className={styles.selectCargo}
                        onChange={(e) => setCargoSelecionado(e.target.value)
                        }>
                        <option value={dados}>{dados}</option>
                        {nomeCargos.map(cargo => (
                            <option key={cargo} value={cargo}>{cargo}</option>
                        ))}
                    </select>
                    <button onClick={() => setIsOpen(false)}>X</button>
                </div>

                <div className={styles.qtdFuncionarios}>
                    Quantidade de funcionários: {cargoFiltrado.length}
                </div>

                <div className={styles.main}>

                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Matrícula</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cargoFiltrado.length > 0 ? (
                                cargoFiltrado.map(func => (
                                    <tr key={func.matricula}>
                                        <td>{func.nome}</td>
                                        <td>{func.matricula}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2}>Nenhum funcionário encontrado</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </div>

            </div>

        </div>
    )
}

export default BoxFuncAgrupadas;