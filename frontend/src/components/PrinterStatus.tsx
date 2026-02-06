import { usePrinterStatus } from "@app/hooks/status";
import type { PrinterStatus } from "@app/types";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";

export default function PrinterStatus() {
  const queryClient = useQueryClient();
  const { data } = usePrinterStatus();

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: ["printer-status"],
    });
  };

  return (
    <>
    <React.Suspense fallback={<h1 className="text-lg font-semibold text-gray-600">Loading...</h1>}>
      <div className="max-w-md rounded-2xl bg-gray-50 p-8 shadow-xl m-4">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="{2}" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 18a9 9 0 100-18 9 9 0 000 18z" />
            </svg>
          </div>
        <div className="flex-row h-12">
          <h2 className="text-xl font-semibold text-gray-800">Printerstatus</h2>
          <h1 className="text-sm font-medium text-gray-600">Updated: {new Date(data?.last_update * 1000).toLocaleString()}</h1>
        </div>
      </div>
        <div className="flex flex-row-reverse gap-4 mb-6 justify-items-end">
          <div className="flex flex-nowrap border-0 rounded-lg p-1 items items-center font-bold bg-green-800 text-green-300">
            {data?.connected ? "Yes" : "No"}
          </div>
          <div className="flex flex-nowrap border-0 rounded-lg p-1 items items-center font-bold bg-green-800 text-green-300">
            { data?.status?.print?.gcode_state }
          </div>
        </div>
        {data?.status?.print?.gcode_state == "RUNNING" && (
          <span> Layer: {data?.status?.print?.layer_num} /{" "}
                {data?.status?.print?.total_layer_num}
          </span>
        )}
        <button onClick={refresh} className="text-blue-500 hover:underline">
          Refresh
        </button>
      </div>
        </React.Suspense>
        
    </>
  );
}
