import Link from "next/link";

/**
 * Placeholder da fundação. A Home real (sete blocos, BRIEF.md seção 06)
 * é a próxima fase, construída depois da revisão de /estilo.
 */
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <p className="text-[15px] tracking-tight text-marfim">NSEImports</p>
      <p className="max-w-xs text-[13px] text-marfim/50">
        Fundação em construção. Confira os componentes em{" "}
        <Link href="/estilo" className="text-ouro-claro hover:underline">
          /estilo
        </Link>
        .
      </p>
    </main>
  );
}
