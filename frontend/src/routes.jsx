import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Funcionario from './pages/Funcionario';
import Dashboard from './pages/Dashboard';
import Ponto from './pages/Ponto';
import Gerenciar from './pages/Gerenciar';
import Registro from './pages/Ponto/Registro';
import Rh from './pages/RH';
import React, { useState } from 'react';
import Header from './component/Header/index';

function AppRoutes() {
    // Estado compartilhado entre as rotas
    const [isRoot, setIsRoot] = useState(false);

    return (
        <BrowserRouter>
            <div>
                <Header setIsRoot={setIsRoot} />
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/funcionario" element={<Funcionario />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/ponto" element={<Ponto />} />
                    <Route path="/gerenciar" element={<Gerenciar isRoot={isRoot} />} />
                    <Route path="/registro" element={<Registro />} />
                    <Route path="/rh" element={<Rh />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default AppRoutes;