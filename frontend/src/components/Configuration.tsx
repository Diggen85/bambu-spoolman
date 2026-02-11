import useSettings from "@app/hooks/useSettings";
import AmsConfiguration from "./AmsConfiguration";
import ExternalSpoolConfiguration from "./ExternalSpoolConfiguration";
import BasicCard from "./BasicCard";
import { Spool } from "lucide-react";

function amsCount(trayCount: number) {
  return Math.ceil(trayCount / 4);
}

export default function Configuration() {
  const { data } = useSettings();
  const trayCount = data.tray_count || 0;
  const ams = amsCount(trayCount);

  const amsComponents = [];
  for (let i = 0; i < ams; i++) {
    amsComponents.push(<AmsConfiguration key={i} id={i} />);
  }


  return (
    <>
    <BasicCard headline={"External Spool"} icon={<Spool/>}>
          <ExternalSpoolConfiguration />
    </BasicCard>

      {ams > 0 && (
        <>{amsComponents}</>
      )}

    </>
  );
}
