import * as React from 'react';

interface VideoProps {
    children: React.ReactNode;
}

interface appState { gray: string, invert: string, hr: number, min: number, sec: number, stoptime: boolean, showTime: string };

export default class Video extends React.Component<{}, appState> {
    constructor(props: any) {
        super(props);
        this.state = { gray: 'gray', invert: 'normal', hr: 0, min: 0, sec: 0, stoptime: true, showTime: '00:00:00' }
    }

    private video = React.createRef<HTMLVideoElement>();
    private canvas = React.createRef<HTMLCanvasElement>();
    private timer = React.createRef<HTMLParagraphElement>();
    public timerCount: any;
    public constraints = {
        Audio: true,
        video: true
    };




    streamVideo = () => {
        let dimensions = window.innerWidth;
        let dimensions2 = window.innerHeight;
        this.canvas.current!.width = dimensions;
        this.canvas.current!.height = dimensions2;
        this.canvas.current!.getContext('2d')!.drawImage(this.video.current!, 0, 0, dimensions, dimensions2);
        requestAnimationFrame(this.streamVideo);
    }

    videoGray = () => {
        let dimensions = window.innerWidth;
        let dimensions2 = window.innerHeight;
        this.canvas.current!.width = dimensions;
        this.canvas.current!.height = dimensions2;
        requestAnimationFrame(this.videoGray);
        this.canvas.current!.getContext('2d')!.drawImage(this.video.current!, 0, 0, dimensions, dimensions2);
        let pixelData = this.canvas.current!.getContext('2d')!.getImageData(0, 0, dimensions, dimensions2);
        for (let i = 0; i < pixelData.data.length; i += 4) {
            let r = pixelData.data[i];
            let g = pixelData.data[i + 1];
            let b = pixelData.data[i + 2];
            let averageColour = (r + g + b) / 3;
            pixelData.data[i] = averageColour;
            pixelData.data[i + 1] = averageColour;
            pixelData.data[i + 2] = averageColour;
        }
        this.canvas.current!.getContext('2d')!.putImageData(pixelData, 0, 0);
    }

    invertColors = (data: any) => {
        for (let i = 0; i < data.length; i += 4) {
            data[i] = data[i] ^ 255; // Invert Red
            data[i + 1] = data[i + 1] ^ 255; // Invert Green
            data[i + 2] = data[i + 2] ^ 255; // Invert Blue
        }
    }


    invertionOfColors = () => {
        let dimensions = window.innerWidth;
        let dimensions2 = window.innerHeight;
        this.canvas.current!.width = dimensions;
        this.canvas.current!.height = dimensions2;
        requestAnimationFrame(this.invertionOfColors);
        this.canvas.current!.getContext('2d')!.drawImage(this.video.current!, 0, 0, dimensions, dimensions2);
        let pixelData = this.canvas.current!.getContext('2d')!.getImageData(0, 0, dimensions, dimensions2);
        this.invertColors(pixelData.data);
        this.canvas.current!.getContext('2d')!.putImageData(pixelData, 0, 0);
    }


    invertColorsApply = () => {
        let invertion = this.state.invert;

        if (invertion === 'normal') {
            this.invertionOfColors();
            this.setState({ gray: 'gray' });
            this.setState({ invert: 'inverted' });
        } else {
            this.streamVideo();
            this.setState({ invert: 'normal' });
        }
    }

    startTimer = () => {
        this.timerCycle();
    }
    stopTimer = () => {
        clearTimeout(this.timerCount);
    }

    timerCycle = () => {
        if (this.state.stoptime === true) {
            this.setState({sec: this.state.sec});
            this.setState({min: this.state.min});
            this.setState({hr: this.state.hr});
    
            this.setState({sec: this.state.sec + 1});
    
            if (this.state.sec === 60) {
                this.setState({min: this.state.min + 1});
                this.setState({sec: 0});
            }
            if (this.state.min === 60) {
                this.setState({hr: this.state.hr + 1});
                this.setState({min: 0});
                this.setState({sec: 0});
            }
    
            this.setState({showTime: this.state.hr.toString().padStart(2,'0') + ':' + this.state.min.toString().padStart(2,'0') + ':' + this.state.sec.toString().padStart(2,'0')});
    
            this.timerCount = setTimeout(this.timerCycle, 1000);
        }
    }


    playVideo = () => {
        this.video.current!.play();
        this.startTimer();
    }

    pauseVideo = () => {
        this.video.current!.pause();
        this.stopTimer();
    }

    componentDidMount() {
        navigator.mediaDevices.getUserMedia(this.constraints)
            .then((stream: MediaStream): void => {
                this.video.current!.srcObject = stream;
                this.streamVideo();
                this.startTimer();
            })
            .catch((err: Object): void => {
                console.log(err)
            })
    }

    toggleColor = () => {
        let color = this.state.gray;
        if (color === "gray") {
            this.videoGray();
            this.setState({ gray: 'color' });
            this.setState({ invert: 'normal' });
        } else {
            this.streamVideo();
            this.setState({ gray: 'gray' });
        }
    }


    render() {

        return (
            <section className="videoContainer">
                <video ref={this.video} playsInline autoPlay></video>
                <canvas ref={this.canvas}></canvas>
                <div id="controls">
                    <button onClick={this.toggleColor}>Convert to black and white</button>
                    <button id="play-button" onClick={this.playVideo}>Play</button>
                    <button id="pause-button" onClick={this.pauseVideo}>Pause</button>
                    <button id="color-button" onClick={this.invertColorsApply}>Invert Colors</button>
                    <p ref={this.timer}>{this.state.showTime}</p>
                </div>
            </section>
        )
    }
}



export { Video }

