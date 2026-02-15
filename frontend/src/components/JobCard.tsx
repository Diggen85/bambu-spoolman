import { useQuery } from "@tanstack/react-query";
import StatusChip from "./BasicChip";
import BasicCard from "./BasicCard";
import { Bug, FileClock, Gauge, Hourglass, Play, Square } from "lucide-react";
import { PrinterStatusData, usePrinterStatus } from "@app/hooks/status";
import { printerStages } from "@app/helper";


  
export default function JobCard() {
  const result = useQuery({
    queryKey: ["printer-status"],
    queryFn: async () => {
      const response = await fetch("/api/printer-info");
      return response.json();
    },
  });
  if (result.isPending) {
    return (
      <BasicCard headline="Job Status" icon={<Hourglass/>}>
        Loading...
      </BasicCard>
    );
  };
  if (result.isError) {
    return (
    <BasicCard headline="Job Status" icon={<Bug/>}>
      {result.error.message}
    </BasicCard> 
    );
  };

const data: PrinterStatusData = result.data;

return (
  <BasicCard headline="Job Status" subline={data?.status?.print?.subtask_name} icon={<FileClock/>}>
        <div className="flex flex-row-reverse gap-4 mb-6 justify-items-end">
          {data?.status.print?.gcode_state == "RUNNING" && (
            <StatusChip text={data?.status.print?.gcode_state} state={true} icon={<Play />}/>
          )}
          {data?.status?.print?.gcode_state == "FINISH" && (
            <StatusChip text={data?.status.print?.gcode_state} state={true} icon={<Square />}/>
          )}
        <StatusChip text={"Speed " + data?.status.print?.spd_lvl.toString()} state="neutral" icon={<Gauge/>}/>
        </div>
        
        <div className="grid grid-cols-2">
          
          <div className="flex flex-col text-sm col-start-2">
            <p>mc_stage: {data?.status?.print?.mc_print_stage}</p>
            <p>MC State: {printerStages.get(data?.status?.print?.mc_print_stage)}</p>
            <p>mc_remaining_time: {data?.status?.print?.mc_remaining_time}</p>
            <p>mc_linenum: {data?.status?.print?.mc_print_line_number}</p>
            <p>stg_cur: {data?.status?.print?.stg_cur}</p>
            <p>State: {printerStages.get(data?.status?.print?.stg_cur)}</p>
            <p>stg: {data?.status?.print?.stg.length}</p>
            <ul>
              {data?.status?.print?.stg.map((val,id) => 
                <li key={id}>{val} - {printerStages.get(val)}</li>
              )}
            </ul>
            <p>print_type: {data?.status?.print?.print_type}</p>
          </div>

          <div className="flex flex-col grow col-span-2">
            <div className="flex flex-row-reverse text-sm align-bottom"> 
              Layer: {data?.status?.print?.layer_num + " / " + data?.status?.print?.total_layer_num} 
            </div>
            <div className="h-[16px] w-full rounded-lg border-2 border-gray-600 shadow-lg">
              <div className="h-full bg-gradient-to-r from-blue-800 to-blue-600"
                          style={{clipPath: `inset(0 ${100 - data?.status?.print?.mc_percent}% 0 0)`}}>
              </div>
            </div>
          </div>
          </div>
  </BasicCard>
);
};