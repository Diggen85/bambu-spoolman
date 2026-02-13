import useSettings from "@app/hooks/useSettings";
import AmsSlot from "./AmsSlot";
import BasicCard from "./BasicCard";
import { Spool } from "lucide-react";

export type AmsCardProps = {
  id: number;
};



function amsCount(trayCount: number) {
  return Math.ceil(trayCount / 4);
}

export default function AmsConfiguration() {
  const { data } = useSettings();
  const trayCount = data.tray_count || 0;
  const amsQty = amsCount(trayCount);

  const amsComponents = [];
  for (let i = 0; i < amsQty; i++) {
    amsComponents.push(<AmsCard key={i} id={i} />);
  }

  
  return (
    <>
      {amsQty > 0 && (
        <>{amsComponents}</>
      )}

    </>
  );
}

export function AmsCard(props: AmsCardProps) {
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


  return (
<BasicCard headline={"AMS " + props.id + 1 } icon={<Spool />}>
  <div className="grid grid-cols-4 gap-4">
          {slots}
  </div>
</BasicCard>
  );
}
