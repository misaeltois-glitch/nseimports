export interface CheckoutStepperProps {
  steps: string[];
  /** Passo atual, 1-indexado. */
  currentStep: number;
}

/** Progresso do checkout em 3 passos (BRIEF.md, seções 06 e 09). */
export function CheckoutStepper({ steps, currentStep }: CheckoutStepperProps) {
  return (
    <ol className="flex items-start gap-2">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const state =
          stepNumber < currentStep
            ? "concluida"
            : stepNumber === currentStep
              ? "atual"
              : "futura";

        return (
          <li key={step} className="flex flex-1 flex-col gap-2">
            <span
              aria-hidden
              className={`h-[2px] w-full ${state === "futura" ? "bg-marfim/15" : "bg-ouro"}`}
            />
            <span
              className={`kicker ${state === "futura" ? "text-marfim/35" : "text-marfim/70"}`}
            >
              {String(stepNumber).padStart(2, "0")} · {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
