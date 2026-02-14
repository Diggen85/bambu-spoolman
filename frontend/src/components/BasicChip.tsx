import { cva, type VariantProps } from "class-variance-authority";
import classNames from "classnames";
import { LucideProps } from "lucide-react";
import { isValidElement, cloneElement, ReactElement } from "react";


type baseProps= {
  text: string;
  icon?: ReactElement;
  state: string | boolean;
};


const chipCVA = cva(
  [
    "flex flex-nowrap",
    "border-0",
    "items-center",
    "gap-1",
    "px-1",
    "py-1",
    "rounded-lg",
    "text-xs",
    "font-bold",
  ],
  {
    variants: {
      status: {
        green: ["bg-green-800", "text-green-400"],
        red: ["bg-red-800", "text-red-300"],
        yellow: ["bg-yellow-800", "text-yellow-400"],
        neutral: ["bg-gray-400", "text-gray-800"]
      }
    }  
  }
);

export interface statusChipProps extends baseProps, VariantProps<typeof chipCVA> {};

export default function StatusChip({status="neutral", ...props}: statusChipProps) {
  if ( !props.state || props.state == "red") {
    status = "red";
  } else if ( props.state || props.state == "green" ) {
    status = "green";
  } else if (props.state == "yellow") {
  } else {
    status="neutral";
  }

    return (
      <div className={classNames(chipCVA({status}))} >
       {isValidElement(props.icon) && (cloneElement(props.icon, {className: "w-4 h-4"} as LucideProps))}{props.text}
      </div>
  );
};