import useSettings from "@app/hooks/useSettings";
import { usePopup } from "@app/stores/popupStore";
import SpoolChangeModel from "./models/SpoolChangeModel";
import { useSpoolQuery } from "@app/hooks/spool";
import AmsSpoolChip from "./AmsSpoolChip";
import { Suspense } from "react";
import useChangeStore from "@app/stores/spoolChangeStore";
import BasicCard, { BasicCardProps } from "./BasicCard";

export type AmsConfigurationProps = {
  id: number;
};

type AmsSlotProps = {
  spoolId: number;
  slotId: number;
  active: boolean;
  locked: boolean;
};

export function AmsSlot(props: AmsSlotProps) {
  const { data: spool } = useSpoolQuery(props.spoolId);
  const { open } = usePopup();
  const { setSpoolId } = useChangeStore();

  const openChangeModel = () => {
    setSpoolId(props.spoolId);
    open(<SpoolChangeModel trayId={props.slotId} locked={props.locked} />, {
      title: "Update Spool",
    });
  };
  return (
    <Suspense fallback={<AmsSpoolChip spool={null} />}>
      <div onClick={openChangeModel} className="cursor-pointer">
        <AmsSpoolChip
          spool={spool}
          active={props.active}
          showUsage
          showMaterial
        />
      </div>
    </Suspense>
  );
}

export default function AmsConfiguration(props: AmsConfigurationProps) {
  const { data } = useSettings();
  const start = props.id * 4;
  const end = start + 4;
  const trays = data.trays || {};
  const locked_trays = data.locked_trays || [];

  const slots = [];
  for (let i = start; i < end; i++) {
    const spool = trays[i.toString()];
    slots.push(
      <AmsSlot
        key={i}
        slotId={i}
        spoolId={spool}
        active={i == data.active_tray}
        locked={locked_trays.includes(i)}
      />,
    );
  }

const icon = (<svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="{2}" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 18a9 9 0 100-18 9 9 0 000 18z" />
            </svg>);

  return (
<BasicCard headline={"AMS " + props.id + 1 } icon={icon}>
  <div className="grid grid-cols-4 gap-4">
          {slots}
  </div>
</BasicCard>
  );
}
