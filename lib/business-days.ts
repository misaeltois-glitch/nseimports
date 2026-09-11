/**
 * Cálculo de dias úteis e janela de chegada (BRIEF.md, seção 07).
 * Regra de negócio mais sensível do site: o prazo de 45 dias úteis nunca
 * aparece sem uma data real ao lado.
 */

// Feriados nacionais fixos (mesma data todo ano).
// Feriados móveis (Carnaval, Sexta-feira Santa, Corpus Christi) ainda não
// estão incluídos — adicionar via cálculo da Páscoa antes de publicar em
// produção, quando os números reais da operação forem confirmados.
const FIXED_HOLIDAYS_MM_DD = [
  "01-01", // Ano-novo
  "04-21", // Tiradentes
  "05-01", // Dia do Trabalho
  "09-07", // Independência
  "10-12", // Nossa Senhora Aparecida
  "11-02", // Finados
  "11-15", // Proclamação da República
  "11-20", // Consciência Negra
  "12-25", // Natal
];

function monthDay(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${mm}-${dd}`;
}

export function isHoliday(date: Date): boolean {
  return FIXED_HOLIDAYS_MM_DD.includes(monthDay(date));
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isBusinessDay(date: Date): boolean {
  return !isWeekend(date) && !isHoliday(date);
}

/** Soma `days` dias úteis a partir de `from` (não inclui o próprio `from`). */
export function addBusinessDays(from: Date, days: number): Date {
  const result = new Date(from);
  let remaining = Math.abs(days);
  const step = days < 0 ? -1 : 1;

  while (remaining > 0) {
    result.setDate(result.getDate() + step);
    if (isBusinessDay(result)) {
      remaining -= 1;
    }
  }

  return result;
}

export interface ArrivalWindow {
  start: Date;
  end: Date;
}

export interface ArrivalWindowOptions {
  /** Dias úteis até o início da janela. Padrão: 38. */
  minBusinessDays?: number;
  /** Dias úteis até o fim da janela. Nunca deve passar de 45 (a promessa do site). Padrão: 45. */
  maxBusinessDays?: number;
}

/**
 * Janela de chegada estimada a partir de hoje (ou de `from`), em dias úteis.
 * O padrão (38–45 dias úteis) fica dentro do teto de 45 dias úteis prometido,
 * com folga — ajustar quando a operação tiver números reais por etapa.
 */
export function getArrivalWindow(
  from: Date = new Date(),
  { minBusinessDays = 38, maxBusinessDays = 45 }: ArrivalWindowOptions = {}
): ArrivalWindow {
  return {
    start: addBusinessDays(from, minBusinessDays),
    end: addBusinessDays(from, maxBusinessDays),
  };
}
