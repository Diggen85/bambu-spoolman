import { usePopup } from "@app/stores/popupStore";
import { Spool, X } from "lucide-react";
import BasicCard from "./BasicCard";

export default function Popup() {
  const { isOpen, data, close, properties } = usePopup();

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="fixed z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 ">
        <div className="relative top-40 mx-auto  max-w-md">
          <BasicCard 
            headline={properties?.title} 
            action={
              <button
                onClick={close}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              ><X /></button>
            }
            icon={<Spool/>}
          >
            {data}
          </BasicCard>
        </div>
      </div>
    </>
  );
}
