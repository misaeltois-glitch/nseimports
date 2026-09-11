"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { CheckoutStepper } from "@/components/ui/CheckoutStepper";
import { EmptyState } from "@/components/ui/EmptyState";
import { getArrivalWindow } from "@/lib/business-days";
import { useCartStore } from "@/lib/cart-store";
import { computeCartTotals, maxDiasRestantes } from "@/lib/cart-totals";
import { fetchAddressByCep, isValidCep } from "@/lib/cep";
import { formatInstallments, formatPriceBRL } from "@/lib/format";
import { createOrder } from "@/lib/orders";

const STEPS = ["Identificação", "Entrega e embalagem", "Pagamento"];
const RESERVATION_SECONDS = 30 * 60;
const PIX_DISCOUNT_RATE = 0.05;

type PaymentMethod = "pix" | "cartao" | "boleto";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="kicker text-marfim/50">{label}</span>
      {children}
      {error && <span className="text-[12px] text-ouro-claro">{error}</span>}
    </label>
  );
}

const inputClass =
  "h-11 rounded-control border border-marfim/20 bg-transparent px-3 text-[13px] text-marfim placeholder:text-marfim/40 focus:border-ouro";

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

/** Checkout em 3 passos (BRIEF.md, seção 06 — Sacola e checkout). */
export function CheckoutFlow() {
  const items = useCartStore((state) => state.items);
  const shippingMode = useCartStore((state) => state.shippingMode);
  const clear = useCartStore((state) => state.clear);

  const [step, setStep] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(RESERVATION_SECONDS);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [step1Errors, setStep1Errors] = useState<Record<string, string>>({});

  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [step2Errors, setStep2Errors] = useState<Record<string, string>>({});

  const [payment, setPayment] = useState<PaymentMethod>("pix");
  const [installments, setInstallments] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [step3Error, setStep3Error] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const totals = useMemo(() => computeCartTotals(items, shippingMode), [items, shippingMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  async function handleCepBlur() {
    const digits = cep.replace(/\D/g, "");
    if (!digits) return;
    if (!isValidCep(digits)) {
      setStep2Errors((current) => ({ ...current, cep: "Informe um CEP com 8 dígitos" }));
      return;
    }
    setStep2Errors((current) => ({ ...current, cep: "" }));
    setCepLoading(true);
    const address = await fetchAddressByCep(digits);
    setCepLoading(false);
    if (!address) {
      setStep2Errors((current) => ({ ...current, cep: "CEP não encontrado" }));
      return;
    }
    setRua(address.street);
    setBairro(address.neighborhood);
    setCidade(address.city);
    setUf(address.state);
  }

  function goToStep2() {
    const errors: Record<string, string> = {};
    if (!nome.trim()) errors.nome = "Informe seu nome completo";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Informe um e-mail válido";
    if (!whatsapp.trim()) errors.whatsapp = "Informe um WhatsApp para contato";
    setStep1Errors(errors);
    if (Object.keys(errors).length === 0) setStep(2);
  }

  function goToStep3() {
    const errors: Record<string, string> = {};
    if (!isValidCep(cep)) errors.cep = "Informe um CEP com 8 dígitos";
    if (!rua.trim()) errors.rua = "Informe a rua";
    if (!numero.trim()) errors.numero = "Informe o número";
    if (!cidade.trim()) errors.cidade = "Informe a cidade";
    setStep2Errors(errors);
    if (Object.keys(errors).length === 0) setStep(3);
  }

  async function handleConfirm() {
    if (!agreed) {
      setStep3Error("Confirme que entendeu o prazo de importação antes de continuar.");
      return;
    }
    setSubmitting(true);
    const maxDias = maxDiasRestantes(items);
    const arrivalWindow = getArrivalWindow(new Date(), {
      minBusinessDays: maxDias,
      maxBusinessDays: maxDias + 7,
    });
    const order = createOrder({
      items,
      shippingMode,
      subtotalCents: totals.total,
      arrivalWindowStart: arrivalWindow.start.toISOString(),
      arrivalWindowEnd: arrivalWindow.end.toISOString(),
    });
    clear();
    // router.push (next/navigation) is unreliable for this navigation in
    // this Next.js build (same underlying issue as CatalogBrowser, verified
    // by hand) — a full navigation to the confirmation page is reliable and
    // fine here, since this is the natural end of the checkout flow anyway.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = `/pedido/${order.id}`;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Sua sacola está vazia."
        description="Volte ao arquivo antes de fechar um pedido."
      />
    );
  }

  const pixTotal = Math.round(totals.total * (1 - PIX_DISCOUNT_RATE));

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
      <div className="flex-1">
        <CheckoutStepper steps={STEPS} currentStep={step} />

        <div className="mt-8 max-w-md">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <Field label="Nome completo" error={step1Errors.nome}>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className={inputClass}
                  placeholder="Como no documento"
                />
              </Field>
              <Field label="E-mail" error={step1Errors.email}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="voce@email.com"
                />
              </Field>
              <Field label="WhatsApp" error={step1Errors.whatsapp}>
                <input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className={inputClass}
                  placeholder="(11) 90000-0000"
                />
              </Field>
              <p className="text-[12px] text-marfim/50">
                Convidado permitido — sua conta é criada na confirmação, com um clique.
              </p>
              <Button variant="solido" className="mt-2 w-full sm:w-auto" onClick={goToStep2}>
                Continuar
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <Field label="CEP" error={step2Errors.cep}>
                <input
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  onBlur={handleCepBlur}
                  className={inputClass}
                  placeholder="00000-000"
                  inputMode="numeric"
                />
                {cepLoading && <span className="text-[12px] text-marfim/40">Buscando endereço…</span>}
              </Field>
              <Field label="Rua" error={step2Errors.rua}>
                <input value={rua} onChange={(e) => setRua(e.target.value)} className={inputClass} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Número" error={step2Errors.numero}>
                  <input
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="Complemento">
                  <input
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                    className={inputClass}
                    placeholder="Apto, bloco…"
                  />
                </Field>
              </div>
              <Field label="Bairro">
                <input
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className={inputClass}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Cidade" error={step2Errors.cidade}>
                  <input
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="UF">
                  <input
                    value={uf}
                    onChange={(e) => setUf(e.target.value)}
                    maxLength={2}
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="mt-2 flex gap-3">
                <Button variant="contornado" onClick={() => setStep(1)}>
                  Voltar
                </Button>
                <Button variant="solido" onClick={goToStep3}>
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div>
                <p className="kicker text-marfim/50">Peça reservada por</p>
                <p
                  className={`font-mono text-[28px] ${
                    secondsLeft === 0 ? "text-marfim/40" : "text-marfim"
                  }`}
                >
                  {secondsLeft > 0 ? formatCountdown(secondsLeft) : "Tempo esgotado"}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <span className="kicker text-marfim/50">Pagamento</span>
                {(
                  [
                    { id: "pix", label: "Pix", hint: `${formatPriceBRL(pixTotal)} com 5% de desconto` },
                    {
                      id: "cartao",
                      label: "Cartão parcelado",
                      hint: formatInstallments(totals.total),
                    },
                    { id: "boleto", label: "Boleto", hint: formatPriceBRL(totals.total) },
                  ] as const
                ).map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-between rounded-card border p-4 text-[13px] ${
                      payment === option.id ? "border-ouro" : "border-marfim/15"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={payment === option.id}
                        onChange={() => setPayment(option.id)}
                        className="h-4 w-4 accent-ouro"
                      />
                      {option.label}
                    </span>
                    <span className="font-mono text-[12px] text-marfim/60">{option.hint}</span>
                  </label>
                ))}

                {payment === "cartao" && (
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(Number(e.target.value))}
                    className={`${inputClass} mt-1`}
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}x de {formatPriceBRL(totals.total / n)}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <label className="flex items-start gap-2 text-[13px] text-marfim/80">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    setStep3Error(null);
                  }}
                  className="mt-1 h-4 w-4 accent-ouro"
                />
                Entendi que esta peça é importada e chega em até 45 dias úteis.
              </label>
              {step3Error && <p className="text-[12px] text-ouro-claro">{step3Error}</p>}

              <div className="flex gap-3">
                <Button variant="contornado" onClick={() => setStep(2)}>
                  Voltar
                </Button>
                <Button variant="solido" loading={submitting} onClick={handleConfirm}>
                  Confirmar pedido
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <OrderSummary
        itemCount={items.length}
        subtotalCents={totals.itemsSubtotal}
        shippingFeeCents={totals.shippingFee}
        totalCents={totals.total}
      />
    </div>
  );
}

function OrderSummary({
  itemCount,
  subtotalCents,
  shippingFeeCents,
  totalCents,
}: {
  itemCount: number;
  subtotalCents: number;
  shippingFeeCents: number;
  totalCents: number;
}) {
  const content = (
    <>
      <div className="flex items-center justify-between text-[13px]">
        <span className="text-marfim/70">
          {itemCount} peça{itemCount === 1 ? "" : "s"}
        </span>
        <span className="font-mono text-marfim">{formatPriceBRL(subtotalCents)}</span>
      </div>
      {shippingFeeCents > 0 && (
        <div className="mt-2 flex items-center justify-between text-[13px]">
          <span className="text-marfim/70">Envio em partes</span>
          <span className="font-mono text-marfim">{formatPriceBRL(shippingFeeCents)}</span>
        </div>
      )}
      <div className="mt-3 flex items-center justify-between border-t border-marfim/10 pt-3 text-[15px]">
        <span className="text-marfim">Total</span>
        <span className="font-mono text-marfim">{formatPriceBRL(totalCents)}</span>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden w-80 shrink-0 rounded-card border border-ouro/40 p-5 lg:sticky lg:top-20 lg:block">
        <p className="kicker mb-4 text-ouro-claro">Resumo do pedido</p>
        {content}
      </aside>

      <details className="rounded-card border border-ouro/40 p-4 lg:hidden">
        <summary className="kicker cursor-pointer text-ouro-claro">
          Resumo do pedido · {formatPriceBRL(totalCents)}
        </summary>
        <div className="mt-4">{content}</div>
      </details>
    </>
  );
}
