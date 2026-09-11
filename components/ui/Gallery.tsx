"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { ImagePlaceholder } from "./ImagePlaceholder";

export interface GalleryImage {
  label: string;
}

/**
 * Galeria de produto (BRIEF.md, seção 09): miniaturas verticais no desktop,
 * lista com scroll no mobile, zoom em modal (1:1) ao clicar na foto principal.
 */
export function Gallery({
  referencia,
  images,
}: {
  referencia: string;
  images: GalleryImage[];
}) {
  const [active, setActive] = useState(0);
  const activeImage = images[active];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
      <div className="order-2 flex gap-2 overflow-x-auto sm:order-1 sm:w-20 sm:flex-col sm:overflow-visible">
        {images.map((image, index) => (
          <button
            key={image.label}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Ver foto: ${image.label}`}
            aria-current={index === active}
            className={`shrink-0 transition-opacity duration-[400ms] ease-[var(--ease-nse)] ${
              index === active ? "opacity-100" : "opacity-40 hover:opacity-70"
            }`}
          >
            <ImagePlaceholder label={image.label} ratio="1/1" className="w-16 sm:w-full" />
          </button>
        ))}
      </div>

      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="order-1 flex-1 cursor-zoom-in sm:order-2"
            aria-label="Ampliar foto"
          >
            <ImagePlaceholder
              label={activeImage?.label}
              referencia={referencia}
              ratio="4/5"
            />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-onix/90" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 z-50 w-[min(90vw,640px)] -translate-x-1/2 -translate-y-1/2"
            aria-describedby={undefined}
          >
            <Dialog.Title className="sr-only">{activeImage?.label}</Dialog.Title>
            <ImagePlaceholder
              label={activeImage?.label}
              referencia={referencia}
              ratio="1/1"
            />
            <Dialog.Close asChild>
              <button
                type="button"
                className="absolute -top-10 right-0 font-mono text-[12px] text-marfim/70 hover:text-marfim"
              >
                Fechar
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
