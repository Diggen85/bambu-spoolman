import { Suspense } from "react";
import Configuration from "./Configuration";
import PrinterStatus from "./PrinterStatus";
import SpoolsList from "./SpoolsList";


export default function Index() {
  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl text-center">Bambu Spoolman Integration</h1>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Suspense fallback={<div>Loading...</div>}>
            <div className="place-content-top flex flex-col flex-grow gap-4 p-4">
              <Configuration />
              <PrinterStatus />
            </div>
             <div className="object-center p-4">
              <SpoolsList />
             </div>
          </Suspense>
        </div>
      </div>
    </>
  );
}
