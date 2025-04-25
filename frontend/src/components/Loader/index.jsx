import Styles from './Loader.module.css';

function Loader() {
    return (
        <section className={Styles.sectionLoader}>
            <div className={Styles.loader}>
                <div className={Styles.loaderTwo}></div>
            </div>
        </section>
    )
}

export default Loader;