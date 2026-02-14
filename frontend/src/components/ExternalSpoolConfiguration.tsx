import useSettings from "@app/hooks/useSettings";
import AmsSlot from "./AmsSlot";
import BasicCard from "./BasicCard";
import { Spool } from "lucide-react";

export default function ExternalSpoolConfiguration() {
  const { data } = useSettings();
  const activeSpool = data.trays["255"];

  return (

    <BasicCard headline={"External Spool"} icon={<Spool/>}>
      <div className="m-auto">
      <AmsSlot
        trayId={255}
        spoolId={activeSpool}
        active={false}
        locked={false}
      />
      </div>
    </BasicCard>

  );
}
