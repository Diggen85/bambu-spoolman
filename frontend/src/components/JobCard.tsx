import { useQuery } from "@tanstack/react-query";
import StatusChip from "./BasicChip";
import BasicCard from "./BasicCard";
import { Bug, Circle, Fan, FileClock, Gauge, Hourglass, Pause, Play, Square, X } from "lucide-react";
import { PrinterStatusData, usePrinterStatus } from "@app/hooks/status";
import { fanSpeedLevel, fanSpeedPercentage, printerStages, remainingTime, speedLevel } from "@app/helper";


  
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
  data.connected && 
  !(data?.status?.print?.gcode_state == "IDLE" || data?.status?.print?.gcode_state == "FINISH") && 
  !(data?.status?.print?.print_type == "idle") && 
  (
  <BasicCard headline="Job Status" subline={data?.status?.print?.subtask_name} icon={<FileClock/>}>
        <div className="flex flex-row-reverse flex-wrap gap-1">
          {data?.status.print?.gcode_state == "RUNNING" && (
            <StatusChip text={data?.status.print?.gcode_state} state="green" icon={<Play />}/>
          )}
          {data?.status?.print?.gcode_state == "PAUSE" && (
            <StatusChip text={data?.status.print?.gcode_state} state="yellow" icon={<Pause />}/>
          )}
          {data?.status?.print?.gcode_state == "FAILED" && (
            <StatusChip text={data?.status.print?.gcode_state} state="red" icon={<X />}/>
          )}
        </div>
        <div className="grid grid-cols-2 mt-4">
          <div className="flex flex-col text-sm">
            {/*
            <p> {data.status.print.gcode_state} </p>

            <p>mc_stage: {data?.status?.print?.mc_print_stage}</p>
            <p>MC State: {printerStages.get(parseInt(data?.status?.print?.mc_print_stage,10))}</p>
            
            <p>mc_sub_stage: {data?.status?.print?.mc_print_sub_stage}</p>
            <p>MC Sub State: {printerStages.get(data?.status?.print?.mc_print_sub_stage)}</p>
            
            <p>mc_remaining_time: {data?.status?.print?.mc_remaining_time}</p>
     
            <p>mc_remaining_time: {remainingTime(data?.status?.print?.mc_remaining_time)}</p>
            */}
            <p>Current Stage: {printerStages.get(data?.status?.print?.stg_cur)}</p>
            <p>Print Type: {data?.status?.print?.print_type}</p>
          </div>
          <div className="flex flex-col text-sm col-start-2">
            <p>Past Stages:</p>
            <ul className="text-xs">
              {data?.status?.print?.stg.map((val,id) => 
                <li key={id}>{printerStages.get(val)}</li>
              )}
            </ul>
            
          </div>

          <div className="flex flex-col grow col-span-2">
            <div className="flex flex-row-reverse text-xs align-bottom"> 
              Remaining Time: {remainingTime(data?.status?.print?.mc_remaining_time)} - 
              Layer: {data?.status?.print?.layer_num + " / " + data?.status?.print?.total_layer_num} 
            </div>
            <div className="h-[16px] w-full rounded-lg border-2 border-gray-600 shadow-lg">
              <div className="h-full w-full bg-gradient-to-r from-blue-800 to-blue-500"
                style={{
                  backgroundPosition: "left",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: data?.status?.print?.mc_percent + "% 100% "
                }}
              >
              </div>
            </div>
          </div>
          </div>
  </BasicCard>
  )
);
};