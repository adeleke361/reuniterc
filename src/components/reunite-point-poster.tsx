"use client";

import { QrCode, ShieldCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import type { ReunitePoint } from "../domain/types";

interface ReunitePointPosterProps {
  point: ReunitePoint;
  featured?: boolean;
}

export function ReunitePointPoster({ point, featured = false }: ReunitePointPosterProps) {
  return (
    <article
      className={`border bg-[#f5fbfb] p-5 text-slate-950 shadow-command-glow ${
        featured ? "border-cyan" : "border-cyan/45"
      }`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-300 pb-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-deep">Official Reunite Point</p>
          <h2 className="mt-2 text-3xl font-black">{point.name}</h2>
          <p className="mt-1 font-semibold text-slate-600">{point.locationLabel}</p>
        </div>
        <div className="border-4 border-slate-950 px-3 py-2 text-center">
          <p className="text-xs font-black uppercase">Point Code</p>
          <p className="text-3xl font-black">{point.code}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-[170px_1fr]">
        <div className="grid place-items-center border-4 border-slate-950 bg-white p-3">
          <QRCodeSVG value={point.officialShortUrl} size={136} level="M" includeMargin={false} />
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Scan to report</p>
            <p className="mt-1 text-2xl font-black">{point.officialShortUrl}</p>
          </div>
          <div className="border border-slate-300 bg-cyan-50 p-3">
            <p className="flex items-center gap-2 text-sm font-black uppercase text-cyan-deep">
              <QrCode className="size-4" aria-hidden="true" />
              No-internet fallback
            </p>
            <p className="mt-1 text-sm font-semibold leading-6">{point.fallbackInstruction}</p>
          </div>
          <div className="border border-slate-300 bg-amber-50 p-3">
            <p className="flex items-center gap-2 text-sm font-black uppercase text-amber-700">
              <ShieldCheck className="size-4" aria-hidden="true" />
              Tamper check
            </p>
            <p className="mt-1 text-sm font-semibold leading-6">{point.tamperCheckInstruction}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
