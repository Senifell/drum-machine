import React, { useState, useEffect } from 'react';
import './App.css';

const pads = [
  { keyCode: 81, keyTrigger: "Q", id: "Heater-1", url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3" },
  { keyCode: 87, keyTrigger: "W", id: "Heater-2", url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3" },
  { keyCode: 69, keyTrigger: "E", id: "Heater-3", url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3" },
  { keyCode: 65, keyTrigger: "A", id: "Heater-4", url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3" },
  { keyCode: 83, keyTrigger: "S", id: "Clap", url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3" },
  { keyCode: 68, keyTrigger: "D", id: "Open-HH", url: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3" },
  { keyCode: 90, keyTrigger: "Z", id: "Kick-n'-Hat", url: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3" },
  { keyCode: 88, keyTrigger: "X", id: "Kick", url: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3" },
  { keyCode: 67, keyTrigger: "C", id: "Closed-HH", url: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3" }
];

const chordPads = [
  { keyCode: 81, keyTrigger: "Q", id: "Chord-1", url: "https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3" },
  { keyCode: 87, keyTrigger: "W", id: "Chord-2", url: "https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3" },
  { keyCode: 69, keyTrigger: "E", id: "Chord-3", url: "https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3" },
  { keyCode: 65, keyTrigger: "A", id: "Shaker", url: "https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3" },
  { keyCode: 83, keyTrigger: "S", id: "Open-HH", url: "https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3" },
  { keyCode: 68, keyTrigger: "D", id: "Closed-HH", url: "https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3" },
  { keyCode: 90, keyTrigger: "Z", id: "Punchy-Kick", url: "https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3" },
  { keyCode: 88, keyTrigger: "X", id: "Side-Stick", url: "https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3" },
  { keyCode: 67, keyTrigger: "C", id: "Snare", url: "https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3" }
];

const padStyleDefault = {
  backgroundColor: "grey",
  marginTop: 10,
  boxShadow: "3px 3px 5px black"
};

const padStyleActive = {
  backgroundColor: "blue",
  boxShadow: "0 3px black",
  height: 77,
  marginTop: 13
};

const DrumPad = ({ clip, clipId, keyCode, keyTrigger, power, updateDisplay }) => {
  const [padStyle, setPadStyle] = useState(padStyleDefault);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.keyCode === keyCode) {
        playSound();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [keyCode]);

  const playSound = () => {
    const audio = document.getElementById(keyTrigger);
    audio.currentTime = 0;
    audio.play();
    activatePad();
    setTimeout(activatePad, 300);
    updateDisplay(clipId);
  };

  const activatePad = () => {
    if (power) {
      setPadStyle(prevState => prevState === padStyleActive ? padStyleDefault : padStyleActive);
    } else {
      setPadStyle(padStyleDefault);
    }
  };

  return (
    <div
      className="drum-pad"
      id={clipId}
      onClick={playSound}
      style={padStyle}
    >
      <audio className="clip" id={keyTrigger} src={clip} />
      {keyTrigger}
    </div>
  );
};

const PadBank = ({ currentPadBank, power, updateDisplay }) => {
  return (
    <div className="pad-bank">
      {currentPadBank.map(pad => (
        <DrumPad
          key={pad.id}
          clip={power ? pad.url : "#"}
          clipId={pad.id}
          keyCode={pad.keyCode}
          keyTrigger={pad.keyTrigger}
          power={power}
          updateDisplay={updateDisplay}
        />
      ))}
    </div>
  );
};

const DrumMachine = () => {
  const [power, setPower] = useState(true);
  const [display, setDisplay] = useState("");
  const [currentPadBank, setCurrentPadBank] = useState(pads);
  const [sliderVal, setSliderVal] = useState(0.5);

  useEffect(() => {
    document.querySelectorAll(".clip").forEach(audio => {
      audio.volume = sliderVal;
    });
  }, [sliderVal]);

  const powerControl = () => {
    setPower(prevPower => !prevPower);
    setDisplay("");
  };

  const selectBank = () => {
    if (power) {
      if (currentPadBank === pads) {
        setCurrentPadBank(chordPads);
        setDisplay("Smooth Piano Kit");
      } else {
        setCurrentPadBank(pads);
        setDisplay("Heater Kit");
      }
    }
  };

  const displayClipName = (name) => {
    if (power) {
      setDisplay(name);
    }
  };

  const adjustVolume = (e) => {
    if (power) {
      setSliderVal(e.target.value);
      setDisplay(`Volume: ${Math.round(100 * e.target.value)}`);
      setTimeout(() => setDisplay(""), 1000);
    }
  };

  return (
    <div className="inner-container" id="drum-machine">
      <PadBank
        currentPadBank={currentPadBank}
        power={power}
        updateDisplay={displayClipName}
      />

      <div className="controls-container">
        <div className="control">
          <p>Power</p>
          <div className="select" onClick={powerControl}>
            <div className="inner" style={{ float: power ? "right" : "left" }}></div>
          </div>
        </div>
        <p id="display">{display}</p>
        <div className="volume-slider">
          <input
            max="1"
            min="0"
            onChange={adjustVolume}
            step="0.01"
            type="range"
            value={sliderVal}
          />
        </div>
        <div className="control">
          <p>Bank</p>
          <div className="select" onClick={selectBank}>
            <div className="inner" style={{ float: currentPadBank === pads ? "left" : "right" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DrumMachine 
