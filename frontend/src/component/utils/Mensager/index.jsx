import Styles from './Mensager.module.css';

function Mensager({ type, msg }) {
    // Estilos baseados no tipo de mensagem
    const styleConfig = {
        success: {
            backgroundColor: '#B7E9CE',
            color: '#02632f',
            borderColor: '#02632f',
        },
        error: {
            backgroundColor: '#F8D7DA',
            color: '#721C24',
            borderColor: '#721C24',
        },
        warning: {
            backgroundColor: '#FFF3CD',
            color: '#856404',
            borderColor: '#856404',
        },
        default: {
            backgroundColor: '#E2E3E5',
            color: '#383D41',
            borderColor: '#383D41',
        },
    };

    // Selecionando o estilo apropriado
    const styles = styleConfig[type] || styleConfig.default;

    // Não renderiza nada se não houver mensagem
    if (!msg) return null;

    return (
        <div className={Styles.boxMensager}>
            <div
                className={Styles.messageCard}
                style={{
                    backgroundColor: styles.backgroundColor,
                    color: styles.color,
                    borderLeft: `5px solid ${styles.borderColor}`,
                }}
            >
                <span className={Styles.text}>{msg}</span>
                <div
                    className={Styles.progressBar}
                    style={{ backgroundColor: styles.borderColor }}
                ></div>
            </div>
        </div>
    );
}

export default Mensager;
