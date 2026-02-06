import useSettings from "@app/hooks/useSettings";
import AmsConfiguration from "./AmsConfiguration";
import ExternalSpoolConfiguration from "./ExternalSpoolConfiguration";
import BasicCard from "./BasicCard";

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

const icon = (<svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="{2}" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 18a9 9 0 100-18 9 9 0 000 18z" />
            </svg>);

  return (
    <>
    <BasicCard headline={"External Spool"} icon={icon}>
          <ExternalSpoolConfiguration />
    </BasicCard>

      {ams > 0 && (
        <>{amsComponents}</>
      )}

    </>
  );
}
