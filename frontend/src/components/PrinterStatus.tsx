import { usePrinterStatus } from "@app/hooks/status";
import type { PrinterStatus } from "@app/types";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import BasicCard from "./BasicCard";
import { Wifi, Activity, RefreshCw, Thermometer, Fan, Printer, Bug, Circle, FileClock, Gauge, Hourglass, Pause, Play, Square, X, Wind, Cloud  } from "lucide-react";
import StatusChip from "./BasicChip";
import { fanSpeedLevel, fanSpeedPercentage, printerStages, remainingTime, speedLevel } from "@app/helper";

type TempChip = {
  text: string;
  icon: string | JSX.Element;
  temp: number;
  targetTemp: number;
};

function TempChip(props: TempChip) {
  return (
    <div className="px-2 py-2 rounded-lg flex flex-row bg-gray-200 ">
      <div className="flex justify-center items-center -h[24px] aspect-square">{props.icon}</div>
      <div className="flex flex-col text-gray-800 text-start">
        <div className="text-xs font-semibold">{props.text}</div>
        <div className="text-xs justify-start">{props.temp.toFixed(1)} {props.targetTemp > 0 ? ("/ "+ props.targetTemp.toFixed(1)) : "/ -" }</div>
      </div>
    </div>
  );

};

export default function PrinterStatus() {
  const queryClient = useQueryClient();
  const { data } = usePrinterStatus();

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: ["printer-status"],
    });
  };


if (data.connected) {
  return (
    <React.Suspense fallback={<h1 className="text-lg font-semibold text-gray-600">Loading...</h1>}>
      <BasicCard headline={"Printerstatus"} 
        subline={"Updated:" + new Date(data?.last_update * 1000).toLocaleString()} 
        icon={<Printer />}
        action={
          <button
            onClick={refresh}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          ><RefreshCw /></button>
        }
      >
        <div className="flex flex-row-reverse gap-4 mb-6 justify-items-end">
          <StatusChip text={""} state={data?.connected} icon={<Activity />} />
          <StatusChip text={data?.status.print.wifi_signal} state={+data?.status.print.wifi_signal.split("dBm")[0] > -80 ? true : false } icon={<Wifi/>} />
            {data?.status.print?.gcode_state == "RUNNING" && (
              <StatusChip text={data?.status.print?.gcode_state} state="green" icon={<Play />}/>
            )}
            {data?.status?.print?.gcode_state == "FINISH" && (
              <StatusChip title="Status" text={data?.status.print?.gcode_state} state="green" icon={<Square />}/>
            )}
            {data?.status?.print?.gcode_state == "PAUSE" && (
              <StatusChip title="Status" text={data?.status.print?.gcode_state} state="yellow" icon={<Pause />}/>
            )}
            {data?.status?.print?.gcode_state == "FAILED" && (
              <StatusChip title="Status" text={data?.status.print?.gcode_state} state="red" icon={<X />}/>
            )}
            {data?.status?.print?.gcode_state == "IDLE" && (
              <StatusChip title="Status" text={data?.status.print?.gcode_state} state="neutral" icon={<Circle />}/>
            )}

            {data?.status?.print?.print_type == "cloud" &&(
              <StatusChip title="Print Type" text={data?.status.print?.gcode_state} state="neutral" icon={<Cloud/>}/>
            )}
        </div>
        <div className="flex flex-col  items-center gap-2">
          <div className="flex flex-row gap-2">
          <TempChip text={"Bed"} icon={<Thermometer />} temp={data?.status?.print?.bed_temper} targetTemp={data?.status?.print?.bed_target_temper} />
          <TempChip text={"Nozzle"} icon={<Thermometer/ >} temp={data?.status?.print?.nozzle_temper} targetTemp={data?.status?.print?.nozzle_target_temper} />
          </div>
          <div className="flex flex-row gap-1">
            <StatusChip title="Speed" text={speedLevel.get(data?.status.print?.spd_lvl)} state="neutral" icon={<Gauge/>}/>
            <StatusChip title="Heatbreak" text={fanSpeedPercentage(data?.status.print?.heatbreak_fan_speed)} state="neutral" icon={<Fan/>}/>
            <StatusChip title="Part Cooling Fan" text={fanSpeedPercentage(data?.status.print?.cooling_fan_speed)} state="neutral" icon={<Wind/>}/>
          </div>
          <div className="flex flex-row gap-1">
            <StatusChip title="Aux Fan" text={"Aux " + fanSpeedPercentage(data?.status.print?.big_fan1_speed)} state="neutral" icon={<Fan/>}/>
            <StatusChip title="Chamber Fan" text={"Chamber " + fanSpeedPercentage(data?.status.print?.big_fan2_speed)} state="neutral" icon={<Fan/>}/>
          </div>
        </div> 
      </BasicCard>
      </React.Suspense>
  );
} else {
  return (
    <React.Suspense fallback={<h1 className="text-lg font-semibold text-gray-600">Loading...</h1>}>
      <BasicCard headline={"Printerstatus"} subline={"Updated:" + new Date(data?.last_update * 1000).toLocaleString()} icon={<Printer />}>
        <div className="flex flex-row-reverse gap-4 mb-6 justify-items-end">
          <StatusChip text={"Printer not Connected"} state={false} icon={<Activity />} />
        </div>
          <button onClick={refresh} className="flex flex-nowrap border-0 items-center gap-1 px-1 py-1 rounded-lg text-xs bg-gray-200 text-gray-600 hover:bg-blue-800 cursor-pointer">
            <RefreshCw />
          </button>
      </BasicCard>
      </React.Suspense>
  );
}
}
