import styles from './Footer.module.css';

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <span className={styles.footerText}>
                    Todos os direitos reservados - Desenvolvido por <b>@</b>DevCled85 2025
                </span>
            </div>
        </footer>
    )
}

export default Footer;