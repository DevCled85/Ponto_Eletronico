// hooks de criação de nomes e portanto de contratação pois gera nomes ou funcionarios ficticios.
import { useEffect, useState } from "react";
import gerar_nomes from "../../pages/RH/func_utils/Gerar_nomesFull.js";
import axios from "axios";

export const useGerarFuncionarios = (limiteContratar, timeLimiteContratar, arrCargos = []) => {
    const [nomesGerados, setNomesGerados] = useState([]);

    useEffect(() => {
        const controller = new AbortController();
        const nomesArr = Array.from({ length: limiteContratar }, () => gerar_nomes.namesFull());
        const gerarMatricula = () => Date.now().toString().slice(-6);
        const cargos = arrCargos;
        const aleatCargos = () => Math.floor(Math.random() * cargos.length);

        let index = 0;

        const intervalo = setInterval(async () => {
            if (index < nomesArr.length) {
                const nomeGerado = {
                    nomeFuncionario: nomesArr[index],
                    matriculaFuncionario: gerarMatricula(),
                    cargoFuncionario: cargos[aleatCargos()]
                };

                try {
                    await axios.post('http://localhost:5000/funcionario', nomeGerado, {
                        signal: controller.signal
                    });
                    setNomesGerados(prev => [...prev, nomeGerado]);
                } catch (error) {
                    if (!axios.isCancel(error)) {
                        console.error("Erro ao enviar os dados:", error);
                    }
                }
                index++;
            } else {
                clearInterval(intervalo);
            }
        }, timeLimiteContratar * 1000);

        return () => {
            clearInterval(intervalo);
            controller.abort();
        };
    }, [limiteContratar, timeLimiteContratar, arrCargos]);

    return nomesGerados;
}