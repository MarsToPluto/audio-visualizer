// EQUALIZER
configurationEqualizer = {
  bottom: path.length - 1,
};

// More colors for enhanced visual feedback
colors = [
  "#2aab3d", "#2fc245", "#49e060", "#6cda3a", "#89ec5c", // Greens
  "#f24318", "#c83916", "#b4381a", "#b4381a", "#b4381a", // Reds
  "#b4381a", "#b4381a", "#b4381a", "#b4381a", "#b4381a", // Repeated Reds
  "#f7e03d", "#f9c823", "#f9a620", "#f99f00", "#f9b15c", // Yellows/Oranges
  "#2f7bc2", "#1c4b9d", "#004f83", "#7a8b9f", "#d4d6db", // Blues
  "#925cb5", "#ab67b3", "#ff6f91", "#ff9f00", "#ffa600", // Purples/Pinks
  "#ecf0f1", "#95a5a6", "#34495e", "#2c3e50", "#2980b9"  // Light Grays and Darker Colors
];


async function updateAnimationEqualizer(Frequency = 0.0) {
  try {
    let heightFromBottom = 0;

    // Updated frequency thresholds for finer control
    if (Frequency >= 200) heightFromBottom = 20; // Highest level
    else if (Frequency >= 190) heightFromBottom = 19;
    else if (Frequency >= 180) heightFromBottom = 18;
    else if (Frequency >= 170) heightFromBottom = 17;
    else if (Frequency >= 160) heightFromBottom = 16;
    else if (Frequency >= 150) heightFromBottom = 15;
    else if (Frequency >= 140) heightFromBottom = 14;
    else if (Frequency >= 130) heightFromBottom = 13;
    else if (Frequency >= 120) heightFromBottom = 12;
    else if (Frequency >= 110) heightFromBottom = 11;
    else if (Frequency >= 100) heightFromBottom = 10;
    else if (Frequency >= 90) heightFromBottom = 9;
    else if (Frequency >= 80) heightFromBottom = 8;
    else if (Frequency >= 70) heightFromBottom = 7;
    else if (Frequency >= 60) heightFromBottom = 6;
    else if (Frequency >= 50) heightFromBottom = 5;
    else if (Frequency >= 40) heightFromBottom = 4;
    else if (Frequency >= 30) heightFromBottom = 3;
    else if (Frequency >= 20) heightFromBottom = 2;
    else if (Frequency >= 10) heightFromBottom = 1;
    else heightFromBottom = 0; // Below 10 gives no animation

    // Ensure at least one level is triggered
    heightFromBottom = Math.max(heightFromBottom, 1); // Ensure at least 1 for minimal feedback

    // Limit the height to the number of available colors
    heightFromBottom = Math.min(heightFromBottom, colors.length);

    // Iterate through the height levels and apply animations
    for (let i = 0; i < heightFromBottom; i++) {
      const g = path[configurationEqualizer.bottom - i];
      const divs = g.map(e => {
        return [...e, document.querySelector(`div[gp="${e[1]}"]`)]; // Selecting the element
      });

      for (let elem of divs) {
        // If heightFromBottom is very low, use a default color
        elem[2].classList.add('gone');
        elem[2].style.backgroundColor = colors[i];

        // If the frequency is very low, apply a default response to avoid no animation
        if (Frequency < 10) {
          elem[2].style.backgroundColor = colors[colors.length - 1]; // Use the last color for low frequencies
        }

        // Using a longer timeout for smoother transition
        setTimeout(() => {
          elem[2].classList.remove('gone');
          elem[2].style.backgroundColor = "";
        }, 300); // Increased duration for smoother effect
      }
    }
  } catch (e) {
    console.log(e);
  }
}


// EQUALIZER
// EQUALIZER

var getAverageVolume = function(array) {
  var length = array.length;
  var values = 0;
  for (let i = 0; i < length; i++) {
    values += array[i];
  }
  return values / length;
};

// navigator.mediaDevices.getUserMedia({ audio: true })
//   .then(function(localStream) {
//     const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//     const input = audioContext.createMediaStreamSource(localStream);
//     const analyser = audioContext.createAnalyser();
//     const scriptProcessor = audioContext.createScriptProcessor();

//     analyser.smoothingTimeConstant = 0;
//     analyser.fftSize = 64;

//     input.connect(analyser);
//     analyser.connect(scriptProcessor);
//     scriptProcessor.connect(audioContext.destination);

//     // Audio processing callback
//     var onAudio = function() {
//       const tempArray = new Uint8Array(analyser.frequencyBinCount);
//       analyser.getByteFrequencyData(tempArray);
//       const latestFrequency = getAverageVolume(tempArray);
//       updateAnimationEqualizer(latestFrequency);
//     };
//     scriptProcessor.onaudioprocess = onAudio;
//   })
//   .catch(function(e) {
//     console.log('err', e);
//   });


    function playAudioFromFile(file) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createBufferSource();

      // Load the audio file
      const reader = new FileReader();
      reader.onload = function(event) {
        audioContext.decodeAudioData(event.target.result, function(buffer) {
          source.buffer = buffer;
          source.connect(analyser);
          analyser.connect(audioContext.destination);
          source.start();

          // Set up audio processing
          const onAudio = function() {
            const tempArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(tempArray);
            const latestFrequency = getAverageVolume(tempArray);
            updateAnimationEqualizer(latestFrequency);
          };

          const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
          scriptProcessor.onaudioprocess = onAudio;
          analyser.connect(scriptProcessor);
          scriptProcessor.connect(audioContext.destination);
        });
      };
      reader.readAsArrayBuffer(file);
    }


    document.getElementById('audioFileInput').addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
        playAudioFromFile(file);
      }
    });


// Improve Visual Feedback:
// #TODO: Implement a smooth easing effect for bar height changes (e.g., CSS transitions or requestAnimationFrame).
// #TODO: Add peak hold indicators to display the maximum frequency levels temporarily.
// Frequency Analysis Optimization:

// #TODO: Use a weighted average or smoothing algorithm to reduce noise in low-frequency signals.
// #TODO: Implement FFT (Fast Fourier Transform) for more precise frequency detection.
// #TODO: Adjust frequency bands dynamically based on user-selected audio input (e.g., song genre or sample).
// Customization & User Controls:

// #TODO: Add a slider to adjust sensitivity for frequency response.
// #TODO: Provide theme customization options (color palettes, bar styles).
// #TODO: Allow users to choose between different visualizer modes (bars, circles, waves).
// Performance Optimization:

// #TODO: Use WebGL or Canvas for rendering animations to enhance performance on slower devices.
// #TODO: Throttle updates or batch DOM manipulations to prevent performance bottlenecks.
// Interactivity Enhancements:

// #TODO: Sync animation with audio beat detection for more engaging effects.
// #TODO: Make the visualizer reactive to user input (e.g., respond to microphone input).
// #TODO: Integrate touch gestures (e.g., tap to change animation modes).
// Cross-Platform Compatibility:

// #TODO: Ensure the visualizer works on both desktop and mobile browsers.
// #TODO: Handle browser-specific limitations (e.g., audio context policies in Safari).
// Advanced Features:

// #TODO: Add 3D visualizer effects for an immersive experience.
// #TODO: Implement multi-channel visualization (e.g., stereo separation with left and right bars).
