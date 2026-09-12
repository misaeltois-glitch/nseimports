"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { signIn, signOut, useAccount } from "@/lib/account";
import { AccountDashboard } from "./AccountDashboard";

const inputClass =
  "h-11 rounded-control border border-marfim/20 bg-transparent px-3 text-[13px] text-marfim placeholder:text-marfim/40 focus:border-ouro";

/**
 * Entrada da Conta (BRIEF.md, seção 06): e-mail com link mágico, nada de
 * login social obrigatório. Sem servidor de e-mail neste protótipo — a
 * confirmação do "link" é simulada, e isso fica explícito na tela.
 */
export function AccountGate() {
  const account = useAccount();
  const [email, setEmail] = useState("");
  const [linkSent, setLinkSent] = useState(false);

  if (account) {
    return <AccountDashboard email={account.email} onSignOut={signOut} />;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setLinkSent(true);
  }

  if (linkSent) {
    return (
      <div className="max-w-sm">
        <p className="text-[14px] text-marfim">Link mágico enviado para {email}.</p>
        <p className="mt-2 text-[13px] text-marfim/60">
          Este é um protótipo sem servidor de e-mail — confirme abaixo para simular o clique no
          link que você receberia.
        </p>
        <Button variant="solido" className="mt-4" onClick={() => signIn(email)}>
          Confirmar entrada
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="kicker text-marfim/50">E-mail</span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="voce@email.com"
          className={inputClass}
        />
      </label>
      <Button type="submit" variant="solido">
        Entrar com link mágico
      </Button>
      <p className="text-[12px] text-marfim/40">Nada de login social obrigatório.</p>
    </form>
  );
}
