import BasicCard from "./BasicCard";
import { Palette, SpoolIcon, Tag, X } from "lucide-react";

import useDebounce from "@app/hooks/debounce";
import { useSpoolQuery } from "@app/hooks/spool";
import { Spool, Tray } from "@app/types";
import AmsSpoolChip from "./AmsSpoolChip";
import { Suspense, useEffect, useState } from "react";
import { SpoolSelect } from "./SpoolsSelect";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AmsSlotProps } from "./AmsSlot";
import Button from "./Button";
import Colour from "@app/helpers/deltae"
import { TriangleAlert } from "lucide-react";

function SpoolmanInformation({ spool }: {spool: Spool}) {
  return (
    <div className="flex items-center px-1 mx-1
      bg-gray-200 border-[1px] rounded-lg"
      >
        <div className="size-fit">
          <AmsSpoolChip 
                  spool={spool}
                  size="small"
                  showUsage
                  />
        </div>
        <div className="flex-grow p-2 whitespace-nowrap overflow-hidden" >
            <div className="text-xs font-semibold ">{spool.filament?.name ||"none"}</div>
            <div className="text-xs ">
                {spool.filament.vendor?.name || "none"}
            </div>
            <div className="text-xs text-gray-600 ">
                {spool.filament?.material} - {(spool.remaining_length/1000).toFixed(2)}m {} - {spool.remaining_weight.toFixed(2)}g
            </div>
        </div>
    </div>
  );
}

function AmsInformation({ tray }: {tray: Tray<string>}) {
  const orgSpool = (parseInt(tray.tray_uuid) == 0  ? false : true);
  return (
    <div className="flex flex-row flex-grow items-center  px-1 mx-1
      bg-gray-200 border-[1px] rounded-lg "
      >
        <div className="size-fit">
          {/*
            <div className="border-black border-2 aspect-square h-[24px] w-[24px] inline-block" style={{background: "#"+tray.tray_color.substring(0,6)}}></div>
          */}
          <Palette className="aspect-square h-[24px] w-[24px]" style={{fill: "#"+tray.tray_color.substring(0,6)}} />
        </div>
        <div className="flex-col flex-1 h-full items-start p-2 whitespace-nowrap overflow-hidden" >
            
            <div className="flex text-xs font-semibold ">{ orgSpool ? ("BambuLab") :  ("Other") }</div>
            <div className="flex text-xs min-h-">
                { orgSpool ? (tray.tray_sub_brands) :  ("-") }
            </div>
            <div className="flex flex-grow items-end text-xs text-gray-600 ">
                {tray.tray_type} - { orgSpool ? (tray.tray_uuid) :  ("No UUID") }
            </div>
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
  

  const onSpoolIdChange = (id: number) => {
    useUpdateTray.reset();
    setUpdateError("");
    setSpoolID(id);
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

  // Calc DeltaE
  const deltae = Colour.deltaE00(Colour.hex2lab("#" + slot.tray?.tray_color.substring(0,6)),Colour.hex2lab(spoolData?.filament.color_hex.substring(0,6) || "#FFFFFF" )).toFixed(0);


  return(
      <Suspense fallback="Loading...">
        <div className="fixed z-50 inset-0 bg-gray-900 bg-opacity-80 overflow-y-auto h-full w-full px-4 ">
        <div className="relative top-40 mx-auto max-w-sm">
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
          {updateError}

          <div className="flex flex-col items-center gap-4">
            {spoolData && !slot.locked && (
              <>
              <SpoolSelect spoolId={spoolId?.toString() || ""} onClick={(id) => {onSpoolIdChange(id)}}/>
              { (parseInt(deltae,10) > 10) && (
                  <div className="flex flex-grow w-full">
                  <p className="text-xs text-gray-800 bg-gray-200 p-2 rounded-lg flex-grow">
                    {(parseInt(deltae,10) > 10) && (parseInt(deltae,10) <= 50) && (<TriangleAlert className="text-yellow-600 inline mr-2" fill="rgb(253 224 71)"/>)}
                    {(parseInt(deltae,10) > 50) && (<TriangleAlert className="text-red-600 inline mr-2" fill="rgb(254 202 202)"/>)}
                    Possible Color mismatch! DeltaE is {deltae}</p>
                  </div>
                )}
              <div className="grid grid-rows- grid-cols-1 w-full gap-2">
                <div>
                <p className="text-lg text-gray-800">Spoolman Information</p>
                <SpoolmanInformation spool={spoolData}/>
                </div>
                <div>
                <p className="text-lg text-gray-800">AMS Information</p>
                <AmsInformation tray={slot.tray}/>
                </div>
              </div>
              </>
            )}
           {validUuid && (<div className="flex flex-row w-full"><AmsInformation tray={slot.tray}/></div>)}
          
            <div className="flex flex-row w-full justify-between">
              <Button intent="danger" onClick={closeFn}>
                Cancel
              </Button>
              { validUuid ? (
                <Button
                  intent="neutral"
                  onClick={() => {
                      useUpdateUuid.mutate({ spoolId: debouncedSpoolId || 0, tray_uuid: slot.tray.tray_uuid });
                  }}
                  disabled={ slot.locked || spoolId == null }
                >
                  Set RFID Tag
                </Button>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
          </BasicCard>
        </div>
      </div>
      </Suspense>
  )
}