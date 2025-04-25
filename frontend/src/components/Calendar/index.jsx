import { useEffect, useState } from 'react';
import styles from './Calendar.module.css';

function Calendar({ month, year, onDateSelect, isOpen, isSetOpen, dataSelecionada }) {

    // Adicionando estado para o dia selecionado
    const [selectedDate, setSelectedDate] = useState({});

    // Usar mês e ano atual como padrão
    const now = new Date();
    // const currentMonth = 0; // Mês atual ou mês passado como parâmetro sendo o mês atual (0 = Janeiro)
    const currentMonth = month ?? now.getMonth(); // Mês atual ou mês passado como parâmetro sendo o mês atual (0 = Janeiro)
    const currentYear = year ?? now.getFullYear(); // Ano atual ou ano passado como parâmetro
    const currentDay = now.getDate(); // Dia atual

    // array com os dias da semana
    const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    // função para gerar o calendário
    const generateCalendar = (month, year) => {
        const days = [];
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const startDayOfWeek = firstDay.getDay();
        const totalDaysInMonth = lastDay.getDate();

        // Dia do mês anterior
        const prevMonthLastDay = new Date(year, month, 0).getDate();

        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            days.push({
                day: prevMonthLastDay - i,
                month: month - 1,
                year: month === 0 ? year - 1 : year,
                faded: true,
            });
        }

        // Dias do mês corrente
        for (let i = 1; i <= totalDaysInMonth; i++) {
            days.push({
                day: i,
                month,
                year,
                faded: false,
            });
        }

        // Dias do mês seguinte
        const totalDaysRendered = startDayOfWeek + totalDaysInMonth;
        const remainingDays = 7 - (totalDaysRendered % 7);
        if (remainingDays < 7) {
            for (let i = 1; i <= remainingDays; i++) {
                days.push({
                    day: i,
                    month: month + 1,
                    year: month === 11 ? year + 1 : year,
                    faded: true,
                });
            }
        }

        return days;
    }

    const days = generateCalendar(currentMonth, currentYear);

    const handleDateClick = (date) => {
        dataSelecionada(date);
        setSelectedDate(date); // Atualiza o dia selecionado
    };

    return (

        <section className={styles.calendarContainer}>
            <div className={styles.calendar}>
                {daysOfWeek.map((day, index) => (
                    <div key={index} className={styles.header}>
                        {day}
                    </div>
                ))}

                {days.map((date, index) => {
                    const isSelected = dataSelecionada && date.day === dataSelecionada?.day && date.month === dataSelecionada?.month && date.year === dataSelecionada?.year;
                    const isToday = date.day === currentDay && date.month === currentMonth && date.year === currentYear;
                    const className = date.faded ? styles.faded : isToday ? styles.today : isSelected ? styles.selectedDate : styles.day;

                    return (
                        <div
                            key={index}
                            className={className}
                            onClick={() => handleDateClick(date)}
                        >
                            {date.day}
                        </div>
                    )
                })}
            </div>
        </section>

    )
}

export default Calendar;
