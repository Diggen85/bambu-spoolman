import useSettings from "@app/hooks/useSettings";
import AmsConfiguration from "./AmsConfiguration";
import ExternalSpoolConfiguration from "./ExternalSpoolConfiguration";

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
      <div className="max-w-md rounded-2xl bg-gray-50 p-8 shadow-xl m-4">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="{2}" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 18a9 9 0 100-18 9 9 0 000 18z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">External Spool Configuration</h2>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <ExternalSpoolConfiguration />
        </div>
      </div>
      {ams > 0 && (
        <>{amsComponents}</>
      )}

    </>
  );
}
