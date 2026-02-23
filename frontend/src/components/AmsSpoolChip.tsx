import { luminaFromHex } from "@app/helpers/lumina";
import type { Spool } from "@app/types";
import { MultiColorDirection } from "@app/types";
import { cva, type VariantProps } from "class-variance-authority";
import { LockKeyhole, SpoolIcon, LockKeyholeOpen, TriangleAlert } from "lucide-react";
import { useLayoutEffect, useState } from "react";

const filamentChipSpool = cva(["aspect-square","border-gray-800", "grid", "grid-cols-1", "grid-rows-2", "gap-1"], {
  variants: {
    size: {
      large: ["w-[60px]", "h-[60px]", "rounded-lg","border-2"],
      small: ["w-[24px]", "h-[24px]","rounded-lg","border-2"],
      tiny: ["w-[16px]", "h-[16px]","border-[1px]"],
    },
  },
});

const filamentChip = cva(["flex", "flex-col", "items-center", "h-auto", "bg-gray-200"], {
  variants: {
    size: {
      large: [ "rounded-lg", "w-[68px]","p-2"],
      small: ["rounded-lg", "p-1"],
      tiny: [ "p-1"],
    },
  },
});

interface SpoolChipProps extends VariantProps<typeof filamentChip> {
  spool: Spool | null;
  showUsage?: boolean;
  locked?: boolean;
  showMaterial?: boolean;
  warning?: boolean;
}

function getBackgroundColor(spool: Spool) {
  if (
    spool.filament.multi_color_direction &&
    spool.filament.multi_color_hexes
  ) {
    if (
      spool.filament.multi_color_direction === MultiColorDirection.LONGITUDINAL
    ) {
      const hexes = spool.filament.multi_color_hexes
        .split(",")
        .map((hex) => "#" + hex)
        .join(", ");
      return "linear-gradient(90deg, " + hexes + ")";
    }
    if (spool.filament.multi_color_direction === MultiColorDirection.COAXIAL) {
      const hexes = spool.filament.multi_color_hexes
        .split(",")
        .map((hex) => "#" + hex);

      const percentages = 100.0 / hexes.length;
      const stops = hexes
        .map((hex, i) => {
          return `${hex} ${i * percentages}%, ${hex} ${(i + 1) * percentages}%`;
        })
        .join(", ");
      return "linear-gradient(90deg, " + stops + ")";
    }
  }
  else if (spool.filament.color_hex) {
    return "linear-gradient(90deg, #" + spool.filament.color_hex + " 100%)";
  }
  else {
    return "repeating-linear-gradient( 45deg, transparent 0 20px, red 20px 40px)";
  }
}

export default function AmsSpoolChip({
  spool,
  locked,
  size = "large",
  showUsage,
  showMaterial,
  warning,
}: SpoolChipProps) {
  const materialName = spool?.filament.material || "?";
  
  let percentage = 100;
  if (spool && spool.remaining_length && spool.used_length && showUsage) {
    const remainingLength = spool.remaining_length || 1;
    const usedLength = spool.used_length || 1;
    percentage=(remainingLength / (remainingLength + usedLength)) * 100;
  }
  
  let lockClass = "col-start-2 ";
  if (spool && luminaFromHex(spool?.filament.color_hex) < 64 && percentage > 50 ) {
    lockClass = "col-start-2 stroke-gray-600";
  };

  return (
    <div className={filamentChip({size})}>
      <div className={filamentChipSpool({ size })}
                style={{
           backgroundImage: spool ? getBackgroundColor(spool) : undefined,
           backgroundPosition: "bottom",
           backgroundRepeat: "no-repeat",
           backgroundSize: "100% "+ percentage +"%",
          }}>
        {(size == "large") && (
          <>
          { locked && <LockKeyhole className={lockClass} />}
          { warning && <TriangleAlert className="col-start-2 row-start-2 text-yellow-600" fill="rgb(253 224 71"/> }
          </>
      )}
      </div>
      {showMaterial && (<div className="mt-1 text-sm font-normal overflow-visible w-full flex flex-row items-center justify-center "><SpoolIcon size="12" className="inline-block shrink-0"/> {materialName}</div>)}
    </div>
  );
}
