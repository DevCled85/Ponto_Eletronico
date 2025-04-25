import Styles from './SeloRegistroPonto.module.css';
import Selo from '../../../assets/selo.png';

function SeloRegistroPonto(props) {
    return (
        <div className={Styles.boxContainer}>

            <div className={Styles.box}>

                <img src={Selo} alt="selo" />

                <span>{ props.msg || 'Registro efetuado com sucesso!!!' }</span>

                <p>{ props.txt || '' }</p>

            </div>

        </div>
    )
}

export default SeloRegistroPonto;