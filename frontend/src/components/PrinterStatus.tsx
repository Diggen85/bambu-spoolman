import { usePrinterStatus } from "@app/hooks/status";
import type { PrinterStatus } from "@app/types";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import BasicCard from "./BasicCard";

type StatusChip = {
  text: String;
  icon?: String | JSX.Element;
  state: Boolean;
};

function StatusChip(props: StatusChip) {
  console.log(props.state);
  const chipColor = props.state ? "bg-green-800 text-green-400" : "bg-red-800 text-red-400";
  //const chipClass = "flex flex-nowrap border-0 rounded-lg p-1 items items-center font-bold " + chipColor;
  const chipClass = "flex flex-nowrap  border-0 items-center gap-1 px-1 py-1  rounded-lg text-xs " + chipColor;
  return (
    <div className={chipClass} >
      {props.text}
    </div>
  );
}

type TempChip = {
  text: String;
  icon: String | JSX.Element;
  temp: Number;
  targetTemp: Number;
};

function TempChip(props: TempChip) {
  return (
    <div className="text-center px-2 py-1.5 rounded-lg flex-1 bg-gray-100">
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

const icon = (<svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="{2}" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 18a9 9 0 100-18 9 9 0 000 18z" />
            </svg>);
const tempIcon = (<svg className="w-3.5 h-3.5 mx-auto mb-0.5" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 0.5C4.6 0.5 3.5 1.6 3.5 3V12.1C2.6 12.8 2 13.9 2 15C2 17.2 3.8 19 6 19C8.2 19 10 17.2 10 15C10 13.9 9.4 12.8 8.5 12.1V3C8.5 1.6 7.4 0.5 6 0.5Z" stroke="#fb923c" stroke-width="1" fill="none"></path><circle cx="6" cy="15" r="2.5" stroke="#fb923c" stroke-width="1" fill="none"></circle></svg>);



if (data.connected) {
//<StatusChip text={data?.status.print.heatbreak_fan_speed + "rpm"} state={data?.status.print.heatbreak_fan_speed ? true : false }/>
  return (
    <React.Suspense fallback={<h1 className="text-lg font-semibold text-gray-600">Loading...</h1>}>
      <BasicCard headline={"Printerstatus"} subline={"Updated:" + new Date(data?.last_update * 1000).toLocaleString()} icon={icon}>
        <div className="flex flex-row-reverse gap-4 mb-6 justify-items-end">
          <StatusChip text={data?.connected ? "Yes" : "No"} state={data?.connected} />
          <StatusChip text={ data?.status?.print?.gcode_state} state={data?.status?.print?.gcode_state ? true : false} />
          <StatusChip text={data?.status.print.wifi_signal} state={data?.status.print.wifi_signal.split("dBm")[0] > -80 ? true : false }/>
        </div>
        <div className="flex items-center gap-2">
          <TempChip text={"Bed"} icon={tempIcon} temp={data?.status?.print?.bed_temper} targetTemp={data?.status?.print?.bed_target_temper} />
          <TempChip text={"Nozzle"} icon={tempIcon} temp={data?.status?.print?.nozzle_temper} targetTemp={data?.status?.print?.nozzle_target_temper} />
          <div className="text-center px-2 py-1.5 rounded-lg flex-1 bg-gray-100">
            {tempIcon}
            <p className="text-sm ">Heatbreak Fan</p>
            <p className="text-sm text-black">{data?.status.print.heatbreak_fan_speed + " rpm"}</p>
          </div>
        </div>
        {data?.status?.print?.gcode_state == "RUNNING" && (
          <span> Layer: {data?.status?.print?.layer_num} /{" "}
                {data?.status?.print?.total_layer_num} 
          </span>)}
        <button onClick={refresh} className="text-blue-500 hover:underline">
          Refresh
        </button>
      </BasicCard>
      </React.Suspense>
  );
} else {
  return (
    <React.Suspense fallback={<h1 className="text-lg font-semibold text-gray-600">Loading...</h1>}>
      <BasicCard headline={"Printerstatus"} subline={"Updated:" + new Date(data?.last_update * 1000).toLocaleString()} icon={icon}>
        <div className="flex flex-row-reverse gap-4 mb-6 justify-items-end">
          <StatusChip text={"Printer not Connected"} state={false} />
        </div>
        <button onClick={refresh} className="text-blue-500 hover:underline">
          Refresh
        </button>
      </BasicCard>
      </React.Suspense>
  );
}
}
