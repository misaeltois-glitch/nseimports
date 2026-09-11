import { describe, expect, it } from "vitest";
import {
  addBusinessDays,
  getArrivalWindow,
  isBusinessDay,
  isHoliday,
  isWeekend,
} from "./business-days";

describe("isWeekend", () => {
  it("identifica sábado e domingo", () => {
    expect(isWeekend(new Date(2024, 0, 6))).toBe(true); // sábado
    expect(isWeekend(new Date(2024, 0, 7))).toBe(true); // domingo
    expect(isWeekend(new Date(2024, 0, 8))).toBe(false); // segunda
  });
});

describe("isHoliday", () => {
  it("identifica feriados nacionais fixos", () => {
    expect(isHoliday(new Date(2024, 4, 1))).toBe(true); // 1º de maio
    expect(isHoliday(new Date(2024, 11, 25))).toBe(true); // Natal
    expect(isHoliday(new Date(2024, 4, 2))).toBe(false);
  });
});

describe("isBusinessDay", () => {
  it("é falso em fim de semana e feriado, verdadeiro em dia comum", () => {
    expect(isBusinessDay(new Date(2024, 0, 1))).toBe(false); // feriado (Ano-novo)
    expect(isBusinessDay(new Date(2024, 0, 6))).toBe(false); // sábado
    expect(isBusinessDay(new Date(2024, 0, 2))).toBe(true); // terça comum
  });
});

describe("addBusinessDays", () => {
  it("avança pulando fim de semana", () => {
    const friday = new Date(2024, 0, 5); // sexta-feira
    const result = addBusinessDays(friday, 1);
    expect(result).toEqual(new Date(2024, 0, 8)); // segunda-feira
  });

  it("avança pulando feriado no meio da semana", () => {
    const tuesday = new Date(2024, 3, 30); // terça-feira
    const result = addBusinessDays(tuesday, 1);
    // quarta 1º de maio é feriado, então cai na quinta
    expect(result).toEqual(new Date(2024, 4, 2));
  });

  it("soma vários dias úteis corretamente", () => {
    const start = new Date(2024, 0, 2); // terça-feira, primeiro dia útil do ano
    const result = addBusinessDays(start, 5);
    expect(result).toEqual(new Date(2024, 0, 9));
  });
});

describe("getArrivalWindow", () => {
  it("retorna janela com início antes do fim, ambos em dias úteis", () => {
    const from = new Date(2024, 0, 2);
    const { start, end } = getArrivalWindow(from);

    expect(start.getTime()).toBeLessThan(end.getTime());
    expect(isBusinessDay(start)).toBe(true);
    expect(isBusinessDay(end)).toBe(true);
  });

  it("respeita minBusinessDays e maxBusinessDays customizados", () => {
    const from = new Date(2024, 0, 2);
    const short = getArrivalWindow(from, {
      minBusinessDays: 1,
      maxBusinessDays: 2,
    });

    expect(short.start).toEqual(addBusinessDays(from, 1));
    expect(short.end).toEqual(addBusinessDays(from, 2));
  });
});
