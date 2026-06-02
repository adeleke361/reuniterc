"use client";

import { useMemo, useState } from "react";
import { Clipboard, Download, Printer } from "lucide-react";
import type { ReunitePoint } from "../domain/types";
import { ReunitePointPoster } from "./reunite-point-poster";

interface ReunitePointPosterStudioProps {
  points: ReunitePoint[];
}

export function ReunitePointPosterStudio({ points }: ReunitePointPosterStudioProps) {
  const [selectedPointId, setSelectedPointId] = useState(
    points.find((point) => point.code === "RP-014")?.id ?? points[0]?.id ?? ""
  );
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const selectedPoint = useMemo(
    () => points.find((point) => point.id === selectedPointId) ?? points[0],
    [points, selectedPointId]
  );
  const otherPoints = points.filter((point) => point.id !== selectedPoint?.id);

  if (!selectedPoint) {
    return null;
  }

  async function copyShortUrl() {
    await navigator.clipboard.writeText(selectedPoint.officialShortUrl);
    setCopyState("copied");
    window.setTimeout(() => setCopyState("idle"), 1400);
  }

  function printSelectedPoster() {
    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-poster-card='true']"));
    for (const card of cards) {
      if (card.dataset.posterId === selectedPoint.id) {
        card.classList.add("print-selected");
      } else {
        card.classList.add("print-hidden");
      }
    }

    window.print();
    window.setTimeout(() => {
      for (const card of cards) {
        card.classList.remove("print-selected", "print-hidden");
      }
    }, 500);
  }

  function printAllPosters() {
    window.print();
  }

  async function downloadSelectedPosterPng() {
    const qrSvg = document.querySelector<SVGElement>(`#poster-${selectedPoint.id} svg`);
    if (!qrSvg) {
      return;
    }

    await downloadPosterPng(selectedPoint, qrSvg);
  }

  return (
    <div className="space-y-7">
      <section className="no-print border border-blue-900/45 bg-[#071426]/95 p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-blue-100/75">Selected Reunite Point</span>
            <select
              value={selectedPoint.id}
              onChange={(event) => setSelectedPointId(event.target.value)}
              className="w-full border border-white/15 bg-[#0b1d3a] px-3 py-3 text-white outline-none focus:border-amber-200"
            >
              {points.map((point) => (
                <option key={point.id} value={point.id}>
                  {point.code} - {point.zone}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={printSelectedPoster}
              className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-blue-950 transition hover:bg-amber-100"
            >
              <Printer className="size-4" aria-hidden="true" />
              Print selected poster
            </button>
            <button
              type="button"
              onClick={downloadSelectedPosterPng}
              className="inline-flex items-center gap-2 rounded-md border border-white/25 px-4 py-2 text-sm font-semibold text-white transition hover:border-amber-200 hover:bg-white/10"
            >
              <Download className="size-4" aria-hidden="true" />
              Download selected PNG
            </button>
            <button
              type="button"
              onClick={copyShortUrl}
              className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm font-semibold text-blue-100/75 transition hover:border-red-300 hover:text-white"
            >
              <Clipboard className="size-4" aria-hidden="true" />
              {copyState === "copied" ? "Copied" : "Copy short URL"}
            </button>
            <button
              type="button"
              onClick={printAllPosters}
              className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm font-semibold text-blue-100/75 transition hover:border-red-300 hover:text-white"
            >
              <Printer className="size-4" aria-hidden="true" />
              Print all posters
            </button>
          </div>
        </div>
      </section>

      <ReunitePointPoster point={selectedPoint} featured domId={`poster-${selectedPoint.id}`} />

      <section className="grid gap-5 lg:grid-cols-3">
        {otherPoints.map((point) => (
          <ReunitePointPoster key={point.id} point={point} domId={`poster-${point.id}`} />
        ))}
      </section>
    </div>
  );
}

async function downloadPosterPng(point: ReunitePoint, qrSvg: SVGElement) {
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 1900;
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#0b2d63";
  context.fillRect(42, 42, canvas.width - 84, 165);
  context.fillStyle = "#b91c1c";
  context.fillRect(42, 207, canvas.width - 84, 18);
  context.fillStyle = "#f8fafc";
  context.fillRect(470, 207, 440, 18);
  context.strokeStyle = "#0b2d63";
  context.lineWidth = 14;
  context.strokeRect(42, 42, canvas.width - 84, canvas.height - 84);

  drawText(context, "ReuniteRC", 92, 145, "700 72px Arial", "#ffffff");
  drawText(context, "INFORMATION BUREAU SUPPORT LAYER", 92, 190, "700 24px Arial", "#fde68a");
  drawText(context, "OFFICIAL REUNITE POINT", 92, 305, "700 28px Arial", "#b91c1c");
  drawText(context, point.name, 92, 410, "800 64px Arial", "#0b2d63", 820, 76);
  drawText(context, point.locationLabel, 92, 530, "700 34px Arial", "#334155", 820, 44);

  context.fillStyle = "#b91c1c";
  context.fillRect(1010, 270, 265, 170);
  context.strokeStyle = "#b91c1c";
  context.lineWidth = 8;
  context.strokeRect(1010, 270, 265, 170);
  drawText(context, "POINT CODE", 1048, 330, "800 28px Arial", "#ffffff");
  drawText(context, point.code, 1050, 402, "900 64px Arial", "#ffffff");

  context.strokeStyle = "#0b2d63";
  context.lineWidth = 10;
  context.strokeRect(92, 560, 430, 430);
  context.fillStyle = "#ffffff";
  context.fillRect(112, 580, 390, 390);
  const qrImage = await loadSvgImage(qrSvg);
  context.drawImage(qrImage, 142, 610, 330, 330);

  drawText(context, "SCAN TO REPORT", 580, 620, "800 28px Arial", "#64748b");
  drawText(context, point.officialShortUrl, 580, 705, "900 50px Arial", "#0b2d63", 690, 58);

  drawPanel(
    context,
    92,
    1080,
    1216,
    270,
    "#eff6ff",
    "#0b2d63",
    "NO-INTERNET FALLBACK",
    point.fallbackInstruction
  );
  drawPanel(
    context,
    92,
    1400,
    1216,
    290,
    "#fffbeb",
    "#b91c1c",
    "TAMPER CHECK",
    point.tamperCheckInstruction
  );

  drawText(
    context,
    "No one should get lost in the crowd. No case should get lost in the process.",
    92,
    1800,
    "700 30px Arial",
    "#166534",
    1160,
    38
  );

  const link = document.createElement("a");
  link.download = `${point.code.toLowerCase()}-${point.zone.toLowerCase().replace(/\s+/g, "-")}-reunite-point.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function drawPanel(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  background: string,
  border: string,
  title: string,
  body: string
) {
  context.fillStyle = background;
  context.fillRect(x, y, width, height);
  context.strokeStyle = border;
  context.lineWidth = 5;
  context.strokeRect(x, y, width, height);
  drawText(context, title, x + 38, y + 58, "900 28px Arial", border);
  drawText(context, body, x + 38, y + 120, "700 32px Arial", "#061416", width - 76, 43);
}

function drawText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string,
  color: string,
  maxWidth?: number,
  lineHeight = 40
) {
  context.font = font;
  context.fillStyle = color;

  if (!maxWidth) {
    context.fillText(text, x, y);
    return;
  }

  const words = text.split(/\s+/);
  let line = "";
  let cursorY = y;
  for (const word of words) {
    const nextLine = line ? `${line} ${word}` : word;
    if (context.measureText(nextLine).width > maxWidth && line) {
      context.fillText(line, x, cursorY);
      line = word;
      cursorY += lineHeight;
    } else {
      line = nextLine;
    }
  }
  if (line) {
    context.fillText(line, x, cursorY);
  }
}

function loadSvgImage(svg: SVGElement): Promise<HTMLImageElement> {
  const serializedSvg = new XMLSerializer().serializeToString(svg);
  const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(serializedSvg)}`;

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = svgUrl;
  });
}
