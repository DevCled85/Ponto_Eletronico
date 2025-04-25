import { useLocation, useNavigate } from 'react-router-dom';
import Container from "../Container";
import styles from './Header.module.css';
import { useState } from 'react';

function Header({ setIsRoot }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [txtUser, setTxtUser] = useState('logar Root');
    const ROOT_PASSWORD = '9655';

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleRootAccess = () => {
        if (txtUser === 'Sair Root') {
            setIsRoot(false);
            setTxtUser('logar Root');
            return;
        }

        const password = prompt('Digite a senha Root:');
        if (password === ROOT_PASSWORD) {
            setIsRoot(true);
            setTxtUser('Sair Root');
            alert('Bem-vindo usuário Root!')
        } else {
            alert('Senha não confere...')
        }
    }

    const isGerenciarPage = location.pathname === '/gerenciar';
    const buttonClass = isGerenciarPage ? styles.buttonGerenciar : styles.buttonDefault;

    return (
        <>
            {location.pathname !== "/ponto" && location.pathname !== '/registro' && (
                <header>
                    <Container>
                        <div>
                            <button
                                className={buttonClass}
                                onClick={() => handleNavigation('/')}
                            >
                                Home
                            </button>

                            <button
                                className={buttonClass}
                                onClick={() => handleNavigation('/funcionario')}
                            >
                                Funcionario
                            </button>

                            <button
                                className={buttonClass}
                                onClick={() => handleNavigation('/dashboard')}
                            >
                                Dashboard
                            </button>

                            <button
                                className={buttonClass}
                                onClick={() => handleNavigation('/ponto')}
                            >
                                Ponto
                            </button>

                            <button
                                className={buttonClass}
                                onClick={() => handleNavigation('/gerenciar')}
                            >
                                Gerenciar
                            </button>

                            {isGerenciarPage && (
                                <button
                                    className={buttonClass}
                                    style={{
                                        backgroundColor: txtUser === 'Sair Root' ? 'red' : '#724EDF',
                                        color: '#fff',
                                    }}
                                    onClick={handleRootAccess}
                                >{txtUser}</button>
                            )}
                        </div>
                    </Container>
                </header>
            )}
        </>
    )
}

export default Header;