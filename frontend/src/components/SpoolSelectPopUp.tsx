import BasicCard from "./BasicCard";
import { SpoolIcon, X } from "lucide-react";

import useDebounce from "@app/hooks/debounce";
import { useSpoolQuery } from "@app/hooks/spool";
import { Spool } from "@app/types";
import AmsSpoolChip from "./AmsSpoolChip";
import { Suspense, useState } from "react";
import SpoolsSelect from "./SpoolsSelect";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AmsSlotProps } from "./AmsSlot";
import Button from "./Button";


function SpoolInformation({ spool }: {spool: Spool}) {
  return (
    <div className="flex flex-col">
      <h2 className="text-md pb-2 font-bold">
        {spool.filament.vendor.name} - {spool.filament.name}
      </h2>
      <AmsSpoolChip spool={spool} showUsage />
      <div>
        <span className="font-bold">Material: </span>
        {spool.filament.material}
      </div>
      <div>
        <span className="font-bold">Remaining Length: </span>
        {parseInt(spool.remaining_length.toFixed(2),10)/1000}m
      </div>
      <div>
        <span className="font-bold">Remaining Weight: </span>
        {spool.remaining_weight.toFixed(2)}g
      </div>
    </div>
  );
}

type spoolSelectPopupProps = {
 closeFn(): void;
  slot: AmsSlotProps;
}

export default function SpoolSelectPopup({closeFn, slot}: spoolSelectPopupProps) {
  const [ spoolId, setSpoolID ] = useState(slot.spoolId);
  const [ updateError, setUpdateError] = useState("");
  const debouncedSpoolId = useDebounce(spoolId, 300);
  const { data: spoolData } = useSpoolQuery(debouncedSpoolId);

  const queryClient = useQueryClient();

  const useUpdateTray = useMutation({
    mutationFn: async ({
      trayId,
      spoolId,
    }: {
      trayId: number;
      spoolId: number | null;
    }) => {
      const result = await fetch(`/api/tray/${trayId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spool_id: spoolId }),
      });
      if (!result.ok) {
        const error = await result.json();
        setUpdateError("Update Spool Error: " + error.message);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      setUpdateError("");
    },
  });
  
  const useUpdateUuid = useMutation({
    mutationFn: async ({ spoolId, tray_uuid }: { spoolId: number, tray_uuid: string }) => {
      const result = await fetch(`/api/set-uuid/${spoolId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tray_uuid: tray_uuid
        }),
      });
      if (!result.ok) {
        const error = await result.json();
        setUpdateError("Update UUID Error:" + error.message);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      setUpdateError("");
    },
  });
  

  const onSpoolIdChange = (e: React.ChangeEvent<HTMLSelectElement> ) => {
    useUpdateTray.reset();
    setUpdateError("");
    setSpoolID(Number(e.target.value));
    console.log(e.target.value + " - " + debouncedSpoolId + " - "+ spoolId);
  };

  const updateTray = () => {
    useUpdateTray.mutate({trayId: slot.trayId, spoolId: debouncedSpoolId });
    closeFn();
  }
  const emptyTray = () => {
    useUpdateTray.mutate({trayId: slot.trayId, spoolId: null });
    closeFn();
  }
  const validUuid: boolean = (parseInt(slot?.tray?.tray_uuid,10) == 0) ? false :true;

  console.log(updateError);
  return(
      <Suspense fallback="Loading...">
        <div className="fixed z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 ">
        <div className="relative top-40 mx-auto  max-w-md">
          <BasicCard 
            headline="AMS Configuration"
            icon={<SpoolIcon/>}
            action={
              <button
                onClick={closeFn}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              ><X /></button>
            }
          >
          <SpoolsSelect
            className="border border-gray-300 p-1 rounded"
            value={spoolId?.toString() || ""}
            onChange={onSpoolIdChange}
            disabled={slot.locked}
          />
          {spoolData ? (<SpoolInformation spool={spoolData}/>) : ("No Spool")}
          {updateError}
          {validUuid && (<>RFID-Tag:{slot.tray.tray_uuid }</>)}
            <div className="flex flex-row items-center gap-1">
              <Button intent="danger" onClick={closeFn}>
                Cancel
              </Button>
              <Button
                intent="neutral"
                onClick={emptyTray}
                disabled={spoolId == null || slot.locked }
              >
                Remove Spool
              </Button>
              <Button
                intent="primary"
                onClick={updateTray}
                disabled={spoolId == null || slot.locked }
              >
                Update
              </Button>
            </div>
            <div className="flex flex-row items-center gap-1 pt-2">
              { validUuid && (
                <Button
                  intent="neutral"
                  onClick={() => {
                      useUpdateUuid.mutate({ spoolId: debouncedSpoolId || 0, tray_uuid: slot.tray.tray_uuid });
                  }}
                  disabled={ slot.locked || spoolId == null }
                >
                  Set RFID Tag
                </Button>
              )}
            </div>
          </BasicCard>
        </div>
      </div>
      </Suspense>
  )
}