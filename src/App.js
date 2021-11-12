import { useState } from "react";
import "./App.scss";
const simplifyFloat = (x) => parseFloat(x.toFixed(2));
export default function App() {
  const useInput = ({ label, placeholder }) => {
    const [value, setValue] = useState("");
    const input = (
      <div className="field">
        <label>{label}</label>
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
    return [value, input];
  };
  const [batteryVoltage, batteryVoltageInput] = useInput({
    label: "Voltage (V)",
    placeholder: "e.g. 3.7",
  });
  const [batteryAh, batteryAhInput] = useInput({
    label: "Current/time (Ah)",
    placeholder: "e.g. 2.5",
  });
  const [deviceVoltage, deviceVoltageInput] = useInput({
    label: "Voltage (V)",
    placeholder: "e.g. 5",
  });
  const [deviceAmps, deviceAmpsInput] = useInput({
    label: "Current (A)",
    placeholder: "e.g. 0.5",
  });
  const batteryWattHours = batteryVoltage * batteryAh || 0;
  const deviceWatts = deviceVoltage * deviceAmps || 0;
  const batteryLife = batteryWattHours / deviceWatts || 0;
  const batteryLifeHuman =
    batteryLife < 1 / 60
      ? simplifyFloat(batteryLife * 60 * 60) + " seconds"
      : batteryLife < 1
      ? simplifyFloat(batteryLife * 60) + " minutes"
      : batteryLife > 24
      ? simplifyFloat(batteryLife / 24) + " days"
      : simplifyFloat(batteryLife) + " hours";
  return (
    <main>
      <form>
        <fieldset>
          <legend>Battery</legend>
          {batteryVoltageInput}
          {batteryAhInput}
          <div className="field">
            <label>Power/time (Wh)</label>
            <div className="figure-wrapper">
              <input disabled value={simplifyFloat(batteryWattHours)} />
              <figure>Pt = V * It</figure>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>Device</legend>
          {deviceVoltageInput}
          {deviceAmpsInput}
          <div className="field">
            <label>Power (W)</label>
            <div className="figure-wrapper">
              <input disabled value={simplifyFloat(deviceWatts)} />
              <figure>P = V * I</figure>
            </div>
          </div>
        </fieldset>
      </form>
      <fieldset className="output">
        <legend>Output</legend>
        <div className="field">
          <label>Battery Life</label>
          <input disabled value={batteryLifeHuman} />
        </div>
      </fieldset>
    </main>
  );
}
