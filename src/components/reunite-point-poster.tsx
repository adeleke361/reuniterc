"use client";

import { QrCode, ShieldCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import type { ReunitePoint } from "../domain/types";

interface ReunitePointPosterProps {
  point: ReunitePoint;
  featured?: boolean;
  domId?: string;
}

export function ReunitePointPoster({ point, featured = false, domId }: ReunitePointPosterProps) {
  return (
    <article
      id={domId}
      data-poster-card="true"
      data-poster-id={point.id}
      className={`overflow-hidden border bg-white text-slate-950 shadow-[0_24px_70px_rgba(7,20,43,0.18)] ${
        featured ? "border-blue-900" : "border-blue-900/45"
      }`}
    >
      <div className="bg-[#0b2d63] px-5 py-3 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-black">ReuniteRC</p>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-100">Digital Information Bureau</p>
        </div>
      </div>
      <div className="h-2 bg-gradient-to-r from-red-700 via-white to-[#0b2d63]" />
      <div className="p-5">
        <div className="flex flex-col gap-4 border-b border-blue-900/20 pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-red-700">Official Reunite Point</p>
            <h2 className="mt-2 text-2xl font-black leading-tight text-blue-950 md:text-3xl">{point.name}</h2>
            <p className="mt-1 font-semibold text-slate-600">{point.locationLabel}</p>
          </div>
          <div className="shrink-0 border-4 border-red-700 bg-red-700 px-3 py-2 text-center text-white">
            <p className="text-xs font-black uppercase">Point Code</p>
            <p className="text-3xl font-black">{point.code}</p>
          </div>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-[156px_1fr]">
          <div className="grid place-items-center self-start border-4 border-blue-950 bg-white p-3">
            <QRCodeSVG value={point.officialShortUrl} size={120} level="M" includeMargin={false} />
          </div>
          <div className="min-w-0 space-y-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Scan to report</p>
              <p className="mt-1 break-all text-xl font-black text-blue-950 md:text-2xl">{point.officialShortUrl}</p>
            </div>
            <div className="border border-blue-900/20 bg-blue-50 p-3">
              <p className="flex items-center gap-2 text-sm font-black uppercase text-blue-900">
                <QrCode className="size-4" aria-hidden="true" />
                No-internet fallback
              </p>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-800">{point.fallbackInstruction}</p>
            </div>
            <div className="border border-amber-500/35 bg-amber-50 p-3">
              <p className="flex items-center gap-2 text-sm font-black uppercase text-red-700">
                <ShieldCheck className="size-4" aria-hidden="true" />
                Tamper check
              </p>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-800">{point.tamperCheckInstruction}</p>
            </div>
          </div>
        </div>
        <p className="mt-5 border-t border-blue-900/20 pt-4 text-sm font-black leading-6 text-green-800">
          No one should get lost in the crowd. No case should get lost in the process.
        </p>
      </div>
    </article>
  );
}
