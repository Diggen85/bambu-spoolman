import useSpoolsQuery from "@app/hooks/Spools";
import AmsSpoolChip from "./AmsSpoolChip";
import { Spool } from "@app/types";

export default function SpoolsList() {
    const { data } = useSpoolsQuery();
    return (
        <>
        {data.map((item: Spool) => 
            <div className="flex shadow-xl gap-2 p-2 items-center rounded-lg">
                <div className="flex w-12 p-2 text-2xl justify-end">
                    {item.id}
                </div>
                <div className="size-fit p-2">
                                    <AmsSpoolChip 
                                            spool={item}
                                            active={false}
                                            size="large"
                                            showUsage
                                            />
                </div>
                <div className="size-fit p-2" >
                    <div className="text-2xl font-medium">{item.filament.name}</div>
                    <div className="text-lg font-medium text-gray-600">
                        {item.filament.vendor.name}
                    </div>
                    <div className="flex text-sm font-medium text-gray-600 ">
                        {item.filament.material} - {(item.remaining_length/1000).toFixed(2)}m - {item.remaining_weight.toFixed(2)}g
                    </div>
                </div>
            </div>
        )}
        </>
    );
}