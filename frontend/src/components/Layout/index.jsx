import Header from '../Header';
import Footer from '../Footer';
import Container from '../Container';

function Layout({ children, hideHeader }) {
    return (
        <>
            {!hideHeader && <Header />}
            <Container>
                {children}
            </Container>
            <Footer />
        </>
    );
}

export default Layout; 