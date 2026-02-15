import { useSuspenseQuery } from "@tanstack/react-query";
import type { Ams, PrinterStatus } from "@app/types";

export type PrinterStatusData = {
  connected: boolean;
  status: PrinterStatus;
  last_update: number;
};

export function usePrinterStatus() {
  return useSuspenseQuery<PrinterStatusData>({
    queryKey: ["printer-status"],
    queryFn: async () => {
      const response = await fetch("/api/printer-info");
      return response.json();
    },
  });
}

export type amsPosition = {
  amsId  :number;
  trayId : number;
};

export function getAmsPosition(tray: number) : amsPosition {
  return ({amsId : Math.floor(tray / 4), trayId: tray % 4}) ;
}

export function useGetAmsTrayByTray(tray: number) {
  const { data } = usePrinterStatus();
  if (tray == 255) {
    return data.status.print.vt_tray || null;
  } else {
    return data.status.print?.ams?.ams[getAmsPosition(tray).amsId]?.tray?.filter(
      (t) => t.id == getAmsPosition(tray).trayId.toString(),
    )?.[0] || null;
}
}

export function useGetAmsTrayByDirect(slotId:number, amsId?:number,) {
  const { data } = usePrinterStatus();
  if (slotId == 255) {
    return data.status.print.vt_tray || null;
  } else if (amsId) {
    return data.status.print?.ams?.ams[amsId]?.tray?.filter(
      (t) => t.id == slotId.toString(),
    )?.[0] || null;
  } else {
    return null;
  }
}


export function useGetAmsByTray(tray: number) {
  const { data } = usePrinterStatus();
  return data.status.print?.ams?.ams[getAmsPosition(tray).amsId] || null;
}

export function useGetAmsByDirect(id: number) : Ams {
  const { data } = usePrinterStatus();

  return data.status.print?.ams?.ams[getAmsPosition(id).amsId] || null;
}

export function useAmsTrayUuid(tray: number) {
  const { data } = usePrinterStatus();

  const ams_tray_uuid = data.status.print?.ams?.ams[getAmsPosition(tray).amsId]?.tray?.filter(
    (t) => t.id == getAmsPosition(tray).trayId.toString(),
  )?.[0];
  if (
    !ams_tray_uuid ||
    ams_tray_uuid.tray_uuid === "00000000000000000000000000000000"
  ) {
    return null;
  }
  return ams_tray_uuid;
}
