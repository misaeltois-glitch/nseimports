"use client";

import { useState, type FormEvent } from "react";
import { addAddress, removeAddress, useAddresses, type Address } from "@/lib/addresses";
import { formatDayMonth, formatOrderCode, formatPriceBRL } from "@/lib/format";
import { useAllOrders, type Order } from "@/lib/orders";
import { isOrderDelivered } from "@/lib/tracking";
import { useWishlist } from "@/lib/wishlist";
import { MOCK_PRODUCTS } from "@/content/mock-products";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { ProductCard } from "@/components/ui/ProductCard";

const inputClass =
  "h-11 rounded-control border border-marfim/20 bg-transparent px-3 text-[13px] text-marfim placeholder:text-marfim/40 focus:border-ouro";

/** Conta (BRIEF.md, seção 06): pedidos, arquivo pessoal, desejos, endereços. */
export function AccountDashboard({
  email,
  onSignOut,
}: {
  email: string;
  onSignOut: () => void;
}) {
  const orders = useAllOrders();
  const wishlistSlugs = useWishlist();
  const addresses = useAddresses();

  const deliveredOrders = orders.filter(isOrderDelivered);
  const wishlistProducts = MOCK_PRODUCTS.filter((product) => wishlistSlugs.includes(product.slug));

  return (
    <div className="flex flex-col gap-14">
      <div className="flex items-center justify-between border-b border-marfim/10 pb-6">
        <p className="text-[13px] text-marfim/60">
          Conectado como <span className="text-marfim">{email}</span>
        </p>
        <button
          type="button"
          onClick={onSignOut}
          className="kicker text-marfim/40 hover:text-marfim/70"
        >
          Sair
        </button>
      </div>

      <section>
        <p className="kicker mb-4 text-ouro-claro">Pedidos</p>
        {orders.length === 0 ? (
          <EmptyState
            title="Você ainda não tem pedidos."
            description="Quando reservar uma peça, ela aparece aqui."
            action={
              <Button href="/arquivo" variant="contornado">
                Ver arquivo
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>

      <section>
        <p className="kicker mb-4 text-ouro-claro">Arquivo pessoal</p>
        {deliveredOrders.length === 0 ? (
          <p className="text-[13px] text-marfim/50">
            Suas peças recebidas aparecem aqui como coleção.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {deliveredOrders.flatMap((order) =>
              order.items.map((item) => (
                <PersonalPiece
                  key={item.id}
                  brand={item.brand}
                  name={item.name}
                  referencia={item.referencia}
                  productSlug={item.productSlug}
                  arrivedAt={formatDayMonth(new Date(order.arrivalWindowEnd))}
                />
              ))
            )}
          </div>
        )}
      </section>

      <section>
        <p className="kicker mb-4 text-ouro-claro">Desejos e avisos</p>
        {wishlistProducts.length === 0 ? (
          <p className="text-[13px] text-marfim/50">
            Toque no coração de uma peça no arquivo para salvá-la aqui.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section>
        <p className="kicker mb-4 text-ouro-claro">Endereços</p>
        <AddressBook addresses={addresses} />
      </section>
    </div>
  );
}

function OrderRow({ order }: { order: Order }) {
  return (
    <div className="flex items-center justify-between rounded-card border border-marfim/10 p-4">
      <div>
        <p className="font-mono text-[13px] text-marfim">{formatOrderCode(order.id)}</p>
        <p className="mt-1 text-[12px] text-marfim/50">
          {order.items.length} peça{order.items.length === 1 ? "" : "s"} ·{" "}
          {formatPriceBRL(order.subtotalCents)}
        </p>
      </div>
      <Button href={`/rastrear?pedido=${order.id}`} variant="fantasma" className="h-9 px-3 text-[12px]">
        Rastrear
      </Button>
    </div>
  );
}

function PersonalPiece({
  brand,
  name,
  referencia,
  productSlug,
  arrivedAt,
}: {
  brand: string;
  name: string;
  referencia: string;
  productSlug: string;
  arrivedAt: string;
}) {
  const product = MOCK_PRODUCTS.find((p) => p.slug === productSlug);
  return (
    <div>
      <ImagePlaceholder label="Estúdio" referencia={referencia} ratio="4/5" />
      <p className="mt-3 text-[13px] text-marfim">
        {brand} · {name}
      </p>
      <p className="mt-1 font-mono text-[11px] text-marfim/50">
        {product?.origin ?? "—"} · Chegou em {arrivedAt}
      </p>
    </div>
  );
}

function AddressBook({ addresses }: { addresses: Address[] }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    label: "",
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    uf: "",
  });

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addAddress(form);
    setForm({ label: "", cep: "", rua: "", numero: "", bairro: "", cidade: "", uf: "" });
    setShowForm(false);
  }

  return (
    <div className="flex flex-col gap-4">
      {addresses.map((address) => (
        <div
          key={address.id}
          className="flex items-center justify-between rounded-card border border-marfim/10 p-4"
        >
          <div className="text-[13px] text-marfim/80">
            <p className="text-marfim">{address.label || "Endereço"}</p>
            <p className="mt-1 text-[12px] text-marfim/50">
              {address.rua}, {address.numero} · {address.bairro} · {address.cidade}/{address.uf}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeAddress(address.id)}
            className="kicker text-marfim/40 hover:text-marfim/70"
          >
            Remover
          </button>
        </div>
      ))}

      {showForm ? (
        <form
          onSubmit={handleAdd}
          className="flex flex-col gap-3 rounded-card border border-marfim/10 p-4"
        >
          <input
            value={form.label}
            onChange={(event) => setForm((f) => ({ ...f, label: event.target.value }))}
            placeholder="Nome do endereço (ex.: Casa)"
            className={inputClass}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={form.cep}
              onChange={(event) => setForm((f) => ({ ...f, cep: event.target.value }))}
              placeholder="CEP"
              required
              className={inputClass}
            />
            <input
              value={form.numero}
              onChange={(event) => setForm((f) => ({ ...f, numero: event.target.value }))}
              placeholder="Número"
              required
              className={inputClass}
            />
          </div>
          <input
            value={form.rua}
            onChange={(event) => setForm((f) => ({ ...f, rua: event.target.value }))}
            placeholder="Rua"
            required
            className={inputClass}
          />
          <div className="grid grid-cols-3 gap-3">
            <input
              value={form.bairro}
              onChange={(event) => setForm((f) => ({ ...f, bairro: event.target.value }))}
              placeholder="Bairro"
              className={`${inputClass} col-span-1`}
            />
            <input
              value={form.cidade}
              onChange={(event) => setForm((f) => ({ ...f, cidade: event.target.value }))}
              placeholder="Cidade"
              required
              className={`${inputClass} col-span-1`}
            />
            <input
              value={form.uf}
              onChange={(event) => setForm((f) => ({ ...f, uf: event.target.value }))}
              placeholder="UF"
              maxLength={2}
              required
              className={`${inputClass} col-span-1`}
            />
          </div>
          <div className="mt-1 flex gap-3">
            <Button type="button" variant="contornado" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="solido">
              Salvar endereço
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="contornado" className="self-start" onClick={() => setShowForm(true)}>
          Adicionar endereço
        </Button>
      )}
    </div>
  );
}
