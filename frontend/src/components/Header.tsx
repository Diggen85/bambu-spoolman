import useAppStatus from "@app/hooks/appStatus"
import StatusChip from "./BasicChip";
import { Spool, Activity } from "lucide-react";

export default function Header() {
 const { data } = useAppStatus();

  return (
    <div className="rounded-2xl bg-gray-50 p-4 shadow-xl flex flex-col ">
      <div className="flex flex-row gap-4 items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
          BSM
        </div>
        <div className="h-12 place-content-center flex flex-col flex-grow">
          <h1 className="text-xl font-semibold text-gray-800">Bambu Spoolman Integration</h1>
        </div>
        <div className="items-top flex flex-grow-0 gap-4">
          <StatusChip state={data?.spoolman_valid} text="Spoolman" icon={<Spool className="w-4 h-4"/>}/>
          <StatusChip state={data?.status} text="Status" icon={<Activity/>}/>
        </div>
      </div>
    </div>
  )

}