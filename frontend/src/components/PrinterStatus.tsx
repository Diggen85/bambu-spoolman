import { usePrinterStatus } from "@app/hooks/status";
import type { PrinterStatus } from "@app/types";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import BasicCard from "./BasicCard";

import { Wifi, Activity, Play, Square, RefreshCw, Thermometer, Fan, Printer } from "lucide-react";

type StatusChip = {
  text: string;
  icon?: string | JSX.Element ;
  state: boolean;
};

function StatusChip(props: StatusChip) {
  const chipClass = "flex flex-nowrap  border-0 items-center gap-1 px-1 py-1  rounded-lg text-xs font-bold " + (props.state ? "bg-green-800 text-green-400" : "bg-red-800 text-red-400");
  return (
      <div className={chipClass} >
       {props.icon}{props.text}
      </div>
  );
};

type TempChip = {
  text: string;
  icon: string | JSX.Element;
  temp: number;
  targetTemp: number;
};

function TempChip(props: TempChip) {
  return (
    <div className="text-center px-2 py-2 rounded-lg flex-1 flex flex-col bg-gray-100 justify-center items-center">
      {props.icon}
      <p className="text-sm ">{props.text}</p>
      <p className="text-sm text-black">{props.temp.toPrecision(2).toString()}</p>
      <p className="text-sm text-black">{props.targetTemp > 0 ? props.targetTemp.toPrecision(2).toString() : "/ -" } </p>
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
          {data?.status?.print?.gcode_state == "RUNNING" && (
            <StatusChip text={data?.status?.print?.gcode_state} state={true} icon={<Play />}/>
          )}
          {data?.status?.print?.gcode_state == "FINISH" && (
            <StatusChip text={data?.status?.print?.gcode_state} state={true} icon={<Square />}/>
          )}
          <StatusChip text={data?.status.print.wifi_signal} state={+data?.status.print.wifi_signal.split("dBm")[0] > -80 ? true : false } icon={<Wifi/>} />

        </div>
        <div className="flex items-center gap-2">
          <TempChip text={"Bed"} icon={<Thermometer />} temp={data?.status?.print?.bed_temper} targetTemp={data?.status?.print?.bed_target_temper} />
          <TempChip text={"Nozzle"} icon={<Thermometer/ >} temp={data?.status?.print?.nozzle_temper} targetTemp={data?.status?.print?.nozzle_target_temper} />
          <div className="text-center px-2 py-2 rounded-lg flex-1 flex flex-col bg-gray-100 justify-center items-center">
            {<Fan />}
            <p className="text-sm ">Heatbreak Fan</p>
            <p className="text-sm text-black">{data?.status.print.heatbreak_fan_speed + " rpm"}</p>
          </div>
        </div>
        {data?.status?.print?.gcode_state == "RUNNING" && (
          <span> Layer: {data?.status?.print?.layer_num} /{" "}
                {data?.status?.print?.total_layer_num} 
          </span>)}
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
