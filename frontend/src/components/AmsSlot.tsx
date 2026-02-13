import { usePopup } from "@app/stores/popupStore";
import SpoolChangeModel from "./models/SpoolChangeModel";
import { useSpoolQuery } from "@app/hooks/spool";
import AmsSpoolChip from "./AmsSpoolChip";
import { Suspense } from "react";
import useChangeStore from "@app/stores/spoolChangeStore";


type AmsSlotProps = {
  spoolId: number;
  slotId: number;
  amsId: number;
  active: boolean;
  locked: boolean;
};

export default function AmsSlot(props: AmsSlotProps) {
  const { data: spool } = useSpoolQuery(props.spoolId);
  const { open } = usePopup();
  const { setSpoolId } = useChangeStore();

  const openChangeModel = () => {
    setSpoolId(props.spoolId);
    open(<SpoolChangeModel trayId={props.slotId} locked={props.locked} />, {
      title: "Update AMS " + (Number(props.amsId) + 1 ).toString() + " Slot " + (Number(props.slotId) + 1 ).toString()
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
};