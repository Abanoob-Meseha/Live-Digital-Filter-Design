class ZTransform {
    constructor() {
        this.MAX_POINTS = 180;
        this.semiUnitCircle = this.generateSemiUnitCircle();
    }

    get frequencies() {
        return this.theta;
    }

    generateSemiUnitCircle() {
        this.theta = this.linspace(0, Math.PI, this.MAX_POINTS);
        let points = [];
        let x, y;
        for (let i = 0; i < this.MAX_POINTS; i++) {
            x = Math.cos(this.theta[i]);
            y = Math.sin(this.theta[i]);
            points[i] = [x, y]
        }
        return points;
    }

    difference(point1 = [], point2 = []) {
        return [point2[0] - point1[0], point2[1] - point1[1]];
    }

    magnitude(point) {
        return Math.sqrt(Math.pow(point[0], 2) + Math.pow(point[1], 2));
    }

    phase(point) {
        if (point[0] == 0) {
            return Math.PI / 2;
        }
        else {
            return - Math.atan(point[1] / point[0]);
        }
    }

    filter(poles = [[]], zeroes = [[]], allPass = [[]]) {
        let magResponse = []
        let phaseResponse = []
        let allPassPhaseResponse = []
        let magNum, magDenum, phaseNum, phaseDenum, allPassPhaseNum, allPassPhaseDenum, diff;
        for (const point of this.semiUnitCircle) {
            magNum = 1;
            magDenum = 1;
            phaseNum = 0;
            phaseDenum = 0;
            allPassPhaseNum = 0;
            allPassPhaseDenum = 0;
            //mag_response or gain =()()().....Zeros<Numerator> / ()()()...Poles<Denominator> 
            for (const zero of zeroes) {
                diff = this.difference(point, zero);// distance between all zeros and points of unit circuit
                magNum = magNum * this.magnitude(diff);
                phaseNum = phaseNum + this.phase(diff);//increament the phase of num with the zero angle
            }
            for (const pole of poles) {
                diff = this.difference(point, pole);// distance between all poles and points of unit circuit
                magDenum = magDenum * this.magnitude(diff);
                phaseDenum = phaseDenum + this.phase(diff);//increament the phase of DEnum with the pole angle
            }
            for (const a of allPass) {// 1-..a/1-..*a and mag is 1
                diff = this.difference(point, a);
                allPassPhaseNum = allPassPhaseNum + this.phase([1 - point[0] * a[0] - point[1] * a[1], point[0] * a[1] - point[1] * a[0]]);
                allPassPhaseDenum = allPassPhaseDenum + this.phase(diff);
            }
            magResponse.push((magNum / magDenum).toFixed(5));//mag of zeros over magnitude of poles
            phaseResponse.push((phaseNum + allPassPhaseNum - phaseDenum - allPassPhaseDenum).toFixed(5));//zeros phases -poles phases
            allPassPhaseResponse.push((allPassPhaseNum - allPassPhaseDenum).toFixed(5));//allpass zeros - poles 
        }
        return {
            "magnitude": magResponse,
            "phase": phaseResponse,
            "allPassPhase": allPassPhaseResponse
        };
    }

    linspace(start, end, num) {
        const step = (end - start) / (num - 1);
        let arr = [];
        for (let i = 0; i < num; i++) {
            arr[i] = (start + (i * step)).toFixed(2);
        }
        return arr;
    }
}