import { Config } from '@/database/useConfigTable';
import { Registro } from '@/database/useRegistroTable';
import { differenceInMinutes } from 'date-fns';

export const calcularHorasMensaisEsperadas = (
    diasdasemana: string[],
    horapadrao: Date,
    intervalopadrao: Date,
    date: Date
): number => {
    const horaInicio = new Date(horapadrao).getHours();
    const minutoInicio = new Date(horapadrao).getMinutes();
    const horaFim = new Date(intervalopadrao).getHours();
    const minutoFim = new Date(intervalopadrao).getMinutes();

    const horasPorDia =
        differenceInMinutes(
            new Date(2024, 0, 1, horaFim, minutoFim),
            new Date(2024, 0, 1, horaInicio, minutoInicio)
        ) / 60;

    const diasNoMes = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDate();
    const diasTrabalhadosNoMes =
        diasdasemana.length * Math.floor(diasNoMes / 7) +
        diasdasemana.filter((dia) => {
            const diaAtual = new Date(
                date.getFullYear(),
                date.getMonth(),
                diasNoMes
            );
            return diaAtual.getDay() === diasdasemana.indexOf(dia);
        }).length;

    return horasPorDia * diasTrabalhadosNoMes * -1;
};

export const calcularTotalHorasTrabalhadas = (records: Registro[]): number => {
    let totalMinutosTrabalhados = 0;

    records.forEach((record, index) => {
        if (index % 2 === 1) {
            const entrada = new Date(records[index - 1].data);
            const saida = new Date(record.data);

            totalMinutosTrabalhados += differenceInMinutes(saida, entrada);
        }
    });

    return totalMinutosTrabalhados / 60;
};

export const calcularSaldoDiario = (
    records: Registro[],
    horapadrao: Date,
    intervalopadrao: Date
): { [key: string]: number } => {
    const horaInicio = new Date(horapadrao).getHours();
    const minutoInicio = new Date(horapadrao).getMinutes();
    const horaFim = new Date(intervalopadrao).getHours();
    const minutoFim = new Date(intervalopadrao).getMinutes();

    const horasPorDia =
        differenceInMinutes(
            new Date(2024, 0, 1, horaFim, minutoFim),
            new Date(2024, 0, 1, horaInicio, minutoInicio)
        ) / 60;

    let saldoDiario: { [key: string]: number } = {};

    records.forEach((record, index) => {
        if (index % 2 === 1) {
            const entrada = new Date(records[index - 1].data);
            const saida = new Date(record.data);

            const data = entrada.toDateString();
            const horasTrabalhadas = differenceInMinutes(saida, entrada) / 60;

            saldoDiario[data] =
                (saldoDiario[data] || horasPorDia) - horasTrabalhadas;
        }
    });

    return saldoDiario;
};

export const calcularSaldoHoras = (
    config: Config | null,
    records: Registro[],
    date: Date
): { saldoHoras: number; saldoDiario: { [key: string]: number } } => {
    if (!config) return { saldoHoras: 0, saldoDiario: {} };

    const { horapadrao, intervalopadrao, diasdasemana } = config;

    const totalHorasEsperadas = calcularHorasMensaisEsperadas(
        diasdasemana,
        horapadrao,
        intervalopadrao,
        date
    );
    const totalHorasTrabalhadas = calcularTotalHorasTrabalhadas(records);

    const horaInicio = horapadrao.getHours();
    const minutoInicio = horapadrao.getMinutes();
    const horaFim = intervalopadrao.getHours();
    const minutoFim = intervalopadrao.getMinutes();

    const horasPorDia =
        differenceInMinutes(
            new Date(2024, 0, 1, horaFim, minutoFim),
            new Date(2024, 0, 1, horaInicio, minutoInicio)
        ) / 60;

    const saldoHoras = totalHorasTrabalhadas - horaInicio;

    const saldoDiario = calcularSaldoDiario(
        records,
        horapadrao,
        intervalopadrao
    );

    return { saldoHoras, saldoDiario };
};
