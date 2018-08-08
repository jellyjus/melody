export default function(audio) {
    const context = new AudioContext();
    const src = context.createMediaElementSource(audio);
    const analyser = context.createAnalyser();

    const canvas = document.getElementById("canvas");
    canvas.width = 850;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;

    const dataArray = new Uint8Array(bufferLength);

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const barWidth = (WIDTH / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    const img = new Image();
    img.src = '/img/game_background.6fb37880.png';
    img.onload = () => {
        const pattern = ctx.createPattern(img, 'no-repeat');
        renderFrame(pattern);
    };

    function renderFrame(pattern) {
        requestAnimationFrame(renderFrame);

        x = 0;

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            const r = barHeight + (25 * (i/bufferLength));
            const g = 250 * (i/bufferLength);
            const b = 50;

            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);


            x += barWidth + 1;
        }
    }
};