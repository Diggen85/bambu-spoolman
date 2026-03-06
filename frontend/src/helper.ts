
export const printerStages = new Map();
  printerStages.set(-2, "Offline");
  printerStages.set(-1, "Idle");
  printerStages.set(0, "Printing");
  printerStages.set(1, "Auto bed leveling");
  printerStages.set(2, "Heatbed preheating");
  printerStages.set(3, "Sweeping XY mech mode");
  printerStages.set(4, "Changing filament");
  printerStages.set(5, "M400 pause");
  printerStages.set(6, "Paused due to filament runout");
  printerStages.set(7, "Heating hotend");
  printerStages.set(8, "Calibrating extrusion");
  printerStages.set(9, "Scanning bed surface");
  printerStages.set(10, "Inspecting first layer");
  printerStages.set(11, "Identifying build plate type");
  printerStages.set(12, "Calibrating Micro Lidar");
  printerStages.set(13, "Homing toolhead");
  printerStages.set(14, "Cleaning nozzle tip");
  printerStages.set(15, "Checking extruder temperature");
  printerStages.set(16, "Printing was paused by the user");
  printerStages.set(17, "Pause of front cover falling");
  printerStages.set(18, "Calibrating the micro lidar");
  printerStages.set(19, "Calibrating extrusion flow");
  printerStages.set(20, "Paused due to nozzle temperature malfunction");
  printerStages.set(21, "Paused due to heat bed temperature malfunction");
  printerStages.set(21, "? - After cleaning noozle - ?");
  printerStages.set(255, "? - prin end - ?");

export function remainingTime(value: number): string {
    /*let days = Math.floor(value / 1440);
    let hour = Math.floor((value % 1440) / 60);*/
    let hour = Math.floor(value / 60);
    let minute = Math.floor(value % 60);

    let m,h :string ;
    (minute < 10) ? (m = "0" + minute) : (m = minute.toString());
    (hour < 10) ? (h = "0" + hour): ( h = hour.toString());
    return  h+ ":" + m;
};

export const speedLevel = new Map();
  speedLevel.set(0, "Invalid");
  speedLevel.set(1, "Silence");
  speedLevel.set(2, "Normal");
  speedLevel.set(3, "Rapid");
  speedLevel.set(4, "Rampage");

export function fanSpeedPercentage(fanSpeed: string): string {
  //return (parseInt(fanSpeed, 10) / 15 * 255).toString() +"%"; //170 bei 10
  return (parseInt(fanSpeed, 10) / 15 * 100 ).toFixed(0) +"%"; //67 bei 10
}