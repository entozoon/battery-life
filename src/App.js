import { useState } from "react";
import "./App.scss";
const simplifyFloat = (x) => parseFloat(x.toFixed(2));
const useInput = ({ label, defaultValue = "", placeholder }) => {
  const [value, setValue] = useState(defaultValue);
  const input = (
    <div className="field">
      <label>{label}</label>
      <div className="input">
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  );
  return [value, setValue, input];
};
export default function App() {
  const [batteryVoltage, setBatteryVoltage, batteryVoltageInput] = useInput({
    label: "Voltage (V)",
    placeholder: "3.7",
  });
  const [batteryAh, setBatteryAh, batteryAhInput] = useInput({
    label: "Current/time (Ah)",
    placeholder: "2.5",
  });
  const [deviceVoltage, setDeviceVoltage, deviceVoltageInput] = useInput({
    label: "Voltage (V)",
    placeholder: "5",
  });
  const [deviceAmps, setDeviceAmps, deviceAmpsInput] = useInput({
    label: "Current (A)",
    placeholder: "0.5",
  });
  const [deviceEfficiency, setDeviceEfficiency, deviceEfficiencyInput] =
    useInput({
      label: "Efficiency (%)",
      placeholder: "80",
      defaultValue: 80,
    });
  const batteryWattHours = batteryVoltage * batteryAh || 0;
  const deviceWatts =
    deviceVoltage * deviceAmps * (deviceEfficiency / 100) || 0;
  const batteryLife = batteryWattHours / deviceWatts || 0;
  const batteryLifeHuman =
    batteryLife < 1 / 60
      ? simplifyFloat(batteryLife * 60 * 60) + "  seconds"
      : batteryLife < 1
      ? simplifyFloat(batteryLife * 60) + "  minutes"
      : batteryLife > 24
      ? Math.ceil(batteryLife / 24) + "  days"
      : simplifyFloat(batteryLife) + "  hours";
  //
  //
  //
  // TO DO:
  //
  // -  Add some default buttons like:
  //   - Arduino / ESP / Pi
  //   - Battery types, serial / parallel
  //
  // - Output mA for everything next to it
  //
  // - Maybe just full text formulas? like:
  //   Power = (Volts * Current) / Efficiency
  //   Watts = (Volts * Amps) / Efficiency
  //
  //
  //
  return (
    <main>
      <form>
        <fieldset>
          <legend>Battery</legend>
          <div className="field">
            <label>Presets:</label>
            <button
              onClick={(e) => {
                e.preventDefault();
                setBatteryVoltage(3.6);
                setBatteryAh(2500);
              }}
            >
              18650
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setBatteryVoltage(3.7);
                setBatteryAh(500);
              }}
            >
              LiPo Small
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setBatteryVoltage(3.7);
                setBatteryAh(5000);
              }}
            >
              LiPo Large
            </button>
          </div>
          {batteryVoltageInput}
          {batteryAhInput}
          <div className="field">
            <label>Power/time (Wh)</label>
            <div className="figure-wrapper">
              <div className="input">
                <input disabled value={simplifyFloat(batteryWattHours)} />
              </div>
              <figure>
                {/* <div>Pt = V * It</div> */}
                <div>Wh = V * Ah</div>
              </figure>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>Device</legend>
          <div className="field">
            <label>Presets:</label>
            <button
              onClick={(e) => {
                e.preventDefault();
                setDeviceVoltage(5.0);
                setDeviceAmps(0.016);
              }}
            >
              Arduino Nano
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setDeviceVoltage(5.0);
                setDeviceAmps(0.09);
              }}
            >
              ESP32
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setDeviceVoltage(5.0);
                setDeviceAmps(0.2);
              }}
            >
              Pi Zero 2 W
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setDeviceVoltage(5.0);
                setDeviceAmps(0.3);
              }}
            >
              Pi 3
            </button>
          </div>
          {deviceVoltageInput}
          {deviceAmpsInput}
          <div className="field">
            <label>Power (W)</label>
            <div className="figure-wrapper">
              <div className="input">
                <input disabled value={simplifyFloat(deviceWatts)} />
              </div>
              <figure>
                {/* <div>P = V * I</div> */}
                <div>W = V * A</div>
              </figure>
            </div>
          </div>
        </fieldset>
      </form>
      <fieldset className="output">
        <legend>Output</legend>
        {deviceEfficiencyInput}
        <div className="field">
          <label>Battery Life</label>
          <div className="figure-wrapper">
            <div className="input">
              <input disabled value={batteryLifeHuman} />
            </div>
            <figure>T = Wh / W * Efficiency</figure>
          </div>
        </div>
      </fieldset>
    </main>
  );
}
