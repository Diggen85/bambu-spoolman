import type { Spool } from "@app/types";
import { MultiColorDirection } from "@app/types";
import { cva, type VariantProps } from "class-variance-authority";

const filamentChipSpool = cva(["aspect-square"], {
  variants: {
    size: {
      large: ["w-[60px]", "h-[60px]", "rounded-lg","border-2"],
      small: ["w-[24px]", "h-[24px]","rounded-lg","border-2"],
      tiny: ["w-[16px]", "h-[16px]","border-[1px]"],
    },
    locked: {
      true: ["border-red-500"],
      false: ["border-black"],
    },
  },
  defaultVariants: {
    locked: false,
  },
});

const filamentChipFill = cva(["h-full"], {
  variants: {
    size: {
      large: ["rounded-lg"],
      small: ["rounded-lg"],
      tiny: [],
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
    return "#" + spool.filament.color_hex;
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
}: SpoolChipProps) {
  const materialName = spool?.filament.material || "?";

  let percentage = 100;
  if (spool && spool.remaining_length && spool.used_length && showUsage) {
    const remainingLength = spool.remaining_length || 1;
    const usedLength = spool.used_length || 1;
    percentage = (remainingLength / (remainingLength + usedLength)) * 100;
  }

  return (
    <div className={filamentChip({size})}>
      <div className={filamentChipSpool({ size, locked })}>
        <div
          className={filamentChipFill({size})}
          style={{
            clipPath: `inset(${100 - percentage}% 0 0 0)`,
            background: spool ? getBackgroundColor(spool) : undefined,
          }}
        ></div>
      </div>
      {showMaterial && <span className="mt-1 text-sm font-normal">{materialName}</span>}
    </div>
  );
}
