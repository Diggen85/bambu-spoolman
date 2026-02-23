import { Suspense } from "react";
import AmsConfiguration from "./AmsConfiguration";
import PrinterStatus from "./PrinterStatus";
import ExternalSpoolConfiguration from "./ExternalSpoolConfiguration";
import SpoolsList from "./SpoolsList";
import Header from "./Header";
import JobCard from "./JobCard";
import { SpoolSelect } from "./SpoolsSelect";


export default function Index() {
  return (
    <>
      <div className="container mx-auto p-4">
        <Header/>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          <Suspense fallback={<div>Loading...</div>}>
            <div className="flex flex-col max-w-md mx-auto gap-4 p-6">
              <PrinterStatus />
              <JobCard/>
              <AmsConfiguration />
              <ExternalSpoolConfiguration/>
            </div>
             <div className="flex flex-col max-w-md mx-auto gap-4 p-6">
              <SpoolSelect spoolId="4" onClick={(id) => (console.log("select " + id))}/>
             </div>
          </Suspense>
        </div>
      </div>
    </>
  );
}
