import styles from './BoxBancoHoras.module.css';

function BoxBancoHoras({ isOpen, setIsOpen, listaMaioresBancoHoras }) {
    console.log(listaMaioresBancoHoras);
    

    return (
        <div className={styles.boxContainer}>
            <div className={styles.boxBancoHoras}>
                <div className={styles.header}>
                    <span>Lista dos Maiores Banco de horas</span>
                    <button onClick={() => setIsOpen(!isOpen)}>X</button>
                </div>
                <div className={styles.main}>
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Matrícula</th>
                                <th>Cargo</th>
                                <th>Banco de horas</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                listaMaioresBancoHoras.map((item, index) => (
                                    <tr key={index}>
                                        <td>{ item.nome }</td>
                                        <td>{ item.matricula }</td>
                                        <td>{ item.cargo }</td>
                                        <td>{ item.bancoDeHoras }</td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default BoxBancoHoras;
