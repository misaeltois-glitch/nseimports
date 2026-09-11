"use client";

import * as RadixAccordion from "@radix-ui/react-accordion";

export interface AccordionItemData {
  id: string;
  question: string;
  answer: string;
}

/** Acordeão de dúvidas (BRIEF.md, seções 06 e 09), abertura com altura animada. */
export function Accordion({
  items,
  defaultOpenId,
}: {
  items: AccordionItemData[];
  defaultOpenId?: string;
}) {
  return (
    <RadixAccordion.Root
      type="single"
      collapsible
      defaultValue={defaultOpenId}
      className="divide-y divide-marfim/10"
    >
      {items.map((item) => (
        <RadixAccordion.Item key={item.id} value={item.id}>
          <RadixAccordion.Header>
            <RadixAccordion.Trigger className="group flex w-full items-center justify-between gap-4 py-4 text-left text-[15px] text-marfim">
              {item.question}
              <span
                aria-hidden
                className="font-mono text-[15px] text-marfim/40 transition-transform duration-[400ms] ease-[var(--ease-nse)] group-data-[state=open]:rotate-45"
              >
                +
              </span>
            </RadixAccordion.Trigger>
          </RadixAccordion.Header>
          <RadixAccordion.Content className="overflow-hidden text-[13px] leading-relaxed text-marfim/70 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <p className="pb-4">{item.answer}</p>
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      ))}
    </RadixAccordion.Root>
  );
}
