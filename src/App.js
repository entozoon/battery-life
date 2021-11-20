import { useState } from "react";
import "./App.scss";
const simplifyFloat = (x, sf = 2) => parseFloat(x.toFixed(sf));
const useInput = ({ label, defaultValue = "", placeholder, min, max }) => {
  const [value, setValue] = useState(defaultValue);
  const input = (
    <div className="field">
      <label>{label}</label>
      <div className="input">
        <input
          type="number"
          value={value}
          placeholder={placeholder}
          onChange={(e) =>
            setValue(
              e.target.value > max
                ? max
                : e.target.value < min
                ? min
                : e.target.value
            )
          }
          {...{ min, max }}
        />
      </div>
    </div>
  );
  return [input, value, setValue];
};
export default function App() {
  const [batteryVoltageInput, batteryVoltage, setBatteryVoltage] = useInput({
    label: (
      <>
        Voltage (V) <small>- Nominal</small>
      </>
    ),
    placeholder: "3.7",
    min: 0,
  });
  const [batteryAhInput, batteryAh, setBatteryAh] = useInput({
    label: "Current/time (Ah)",
    placeholder: "2.5",
    min: 0,
  });
  const [batteryDischargeInput, batteryDischarge, setBatteryDischarge] =
    useInput({
      label: "Safe Discharge (%)",
      placeholder: "20",
      defaultValue: "20",
      min: 0,
      max: 100,
    });
  const [deviceVoltageInput, deviceVoltage, setDeviceVoltage] = useInput({
    label: "Voltage (V)",
    placeholder: "5",
    min: 0,
  });
  const [deviceAmpsInput, deviceAmps, setDeviceAmps] = useInput({
    label: "Current (A)",
    placeholder: "0.5",
    min: 0,
  });
  const [deviceEfficiencyInput, deviceEfficiency] = useInput({
    label: (
      <>
        Efficiency (%){" "}
        <small>- of battery/converters/capacity ratings...</small>
      </>
    ),
    placeholder: "70%",
    defaultValue: 70,
    min: 0,
    max: 100,
  });
  const batteryWattHours =
    (batteryVoltage * batteryAh * batteryDischarge) / 100 || 0;
  const deviceWatts =
    deviceVoltage * deviceAmps * (deviceEfficiency / 100) || 0;
  const batteryLife = batteryWattHours / deviceWatts || 0;
  const batteryLifeHuman =
    batteryLife < 1 / 60
      ? simplifyFloat(batteryLife * 60 * 60) + "  seconds"
      : batteryLife < 1
      ? simplifyFloat(batteryLife * 60) + "  minutes"
      : batteryLife > 24
      ? simplifyFloat(batteryLife / 24, 1) + "  days"
      : simplifyFloat(batteryLife) + "  hours";
  //
  //
  //
  // TO DO:
  //
  // -  Add some default buttons like:
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
            <button
              onClick={(e) => {
                e.preventDefault();
                setBatteryVoltage(3.7);
                setBatteryAh(0.5);
                setBatteryDischarge(28.5);
              }}
            >
              LiPo Small (4.2↓3v)
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setBatteryVoltage(3.6);
                setBatteryAh(2.5);
                setBatteryDischarge(40);
              }}
            >
              18650 (4.2↓2.5v)
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setBatteryVoltage(3.7);
                setBatteryAh(5.0);
                setBatteryDischarge(28.5);
              }}
            >
              LiPo Large (4.2↓3v)
            </button>
          </div>
          {batteryVoltageInput}
          {batteryAhInput}
          {batteryDischargeInput}
          <div className="field">
            <label>Power/time (Wh)</label>
            <div className="figure-wrapper">
              <div className="input">
                <input disabled value={simplifyFloat(batteryWattHours)} />
              </div>
              <figure>
                {/* <div>Pt = V * It</div> */}
                <div>Wh = V * Ah * Discharge</div>
              </figure>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>Device</legend>
          <div className="field">
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
                setDeviceAmps(0.35);
              }}
            >
              Pi 3
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setDeviceVoltage(5.0);
                setDeviceAmps(0.54);
              }}
            >
              Pi 4
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
          <aside>
            NOTE: TP4056 discharge protection should not be relied on for LiPo,
            as it cuts off real low at 2.4v. Li-ion is safer, but check specs of
            any BMS.
          </aside>
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
        <aside>
          This will be inaccurate because:
          <ul>
            <li>
              Battery capacity changes with discharge rate and temperature
            </li>
            <li>Vendors over estimate capacity</li>
          </ul>
          But an Efficiency of 70% tries to account for it.
        </aside>
      </fieldset>
    </main>
  );
}
