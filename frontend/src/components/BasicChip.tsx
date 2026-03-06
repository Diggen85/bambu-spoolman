import { cva, type VariantProps } from "class-variance-authority";
import classNames from "classnames";
import { LucideProps } from "lucide-react";
import { isValidElement, cloneElement, ReactElement } from "react";


type baseProps= {
  text: string;
  icon?: ReactElement;
  state: string | boolean;
  title?: string;
};


const chipCVA = cva(
  [
    "flex flex-nowrap",
    "border-2",
    "items-center",
    "gap-1",
    "px-1",
    "py-1",
    "rounded-lg",
    "text-xs",
  ],
  {
    variants: {
      status: {
        green: ["bg-green-200", "text-green-800", "border-green-300"],
        red: ["bg-red-300", "text-red-800", "border-red-200"],
        yellow: ["bg-yellow-300", "text-yellow-800", "border-yellow-200"],
        neutral: ["bg-gray-200", "text-gray-800", "border-gray-300"]
      }
    }  
  }
);

export interface statusChipProps extends baseProps, VariantProps<typeof chipCVA> {};

export default function StatusChip(props: statusChipProps) {
  let stat = {status: "neutral"};
  if ( !props.state || props.state == "red") {
    stat.status = "red";
  } else if ( props.state == "green" || props.state == "ok" || props.state == true) {
    stat.status = "green";
  } else if (props.state == "yellow") {
    stat.status = "yellow"
  };
console.log(stat.status + " - " + props.state)
  return (
      <div className={chipCVA(stat)}  >
       <p title={props.title}> {isValidElement(props.icon) && (cloneElement(props.icon, {className: "w-[16px] h-[16px] inline"} as LucideProps))} {props.text}</p>
      </div>
  );
};