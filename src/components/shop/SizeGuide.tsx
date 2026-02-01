"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Ruler } from "lucide-react";

// Size chart data by product type
const SIZE_CHARTS: Record<string, SizeChartData> = {
  default: {
    headers: ["Size", "Chest (in)", "Length (in)"],
    rows: [
      ["S", "36-38", "28"],
      ["M", "39-41", "29"],
      ["L", "42-44", "30"],
      ["XL", "45-47", "31"],
      ["2XL", "48-50", "32"],
    ],
  },
  "T-Shirt": {
    headers: ["Size", "Chest (in)", "Length (in)", "Sleeve (in)"],
    rows: [
      ["S", "36-38", "28", "8"],
      ["M", "39-41", "29", "8.5"],
      ["L", "42-44", "30", "9"],
      ["XL", "45-47", "31", "9.5"],
      ["2XL", "48-50", "32", "10"],
    ],
  },
  Hoodie: {
    headers: ["Size", "Chest (in)", "Length (in)", "Sleeve (in)"],
    rows: [
      ["S", "38-40", "27", "24"],
      ["M", "41-43", "28", "25"],
      ["L", "44-46", "29", "26"],
      ["XL", "47-49", "30", "27"],
      ["2XL", "50-52", "31", "28"],
    ],
  },
  Hat: {
    headers: ["Size", "Circumference (in)"],
    rows: [
      ["S/M", "21-22"],
      ["L/XL", "22.5-23.5"],
      ["One Size", "Adjustable"],
    ],
  },
};

interface SizeChartData {
  headers: string[];
  rows: string[][];
}

interface SizeGuideProps {
  productType?: string;
}

export function SizeGuide({ productType }: SizeGuideProps) {
  const chartData =
    SIZE_CHARTS[productType || ""] || SIZE_CHARTS.default;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 text-sm text-white/60 hover:text-lsr-orange transition-colors underline underline-offset-4">
          <Ruler className="h-4 w-4" />
          Size Guide
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg bg-lsr-charcoal border-white/10 rounded-none">
        <DialogHeader>
          <DialogTitle className="font-display font-black italic text-2xl uppercase tracking-normal">
            Size <span className="text-lsr-orange">Guide</span>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {chartData.headers.map((header) => (
                    <th
                      key={header}
                      className="py-3 px-4 text-left font-bold text-white/60 uppercase tracking-wider text-xs"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chartData.rows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`py-3 px-4 ${j === 0 ? "font-bold text-white" : "text-white/80"}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-xs text-white/40 space-y-2">
            <p>
              <strong>How to measure:</strong> Lay a similar garment flat and
              measure across the chest (armpit to armpit) and from shoulder to
              hem for length.
            </p>
            <p>
              Measurements are approximate. When in doubt, size up for a relaxed
              fit.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
