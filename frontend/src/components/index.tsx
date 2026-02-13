import { Suspense } from "react";
import AmsConfiguration from "./AmsConfiguration";
import PrinterStatus from "./PrinterStatus";
//import SpoolsList from "./SpoolsList";
import ExternalSpoolConfiguration from "./ExternalSpoolConfiguration";
import SpoolsList from "./SpoolsList";


export default function Index() {
  return (
    <>
      <div className="container mx-auto p-4">
        <div className="rounded-2xl bg-gray-50 p-4 shadow-xl flex flex-col ">
          <div className="flex flex-row gap-4 items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
              I
            </div>
              <h1 className="text-xl font-semibold text-gray-800">Bambu Spoolman Integration</h1>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Suspense fallback={<div>Loading...</div>}>
            <div className="flex flex-col max-w-md mx-auto gap-8 p-8">
              <PrinterStatus />
              <AmsConfiguration />
              <ExternalSpoolConfiguration/>
            </div>
             <div className="flex flex-col max-w-md mx-auto gap-8 p-8">
              <SpoolsList/>
             </div>
          </Suspense>
        </div>
      </div>
    </>
  );
}
