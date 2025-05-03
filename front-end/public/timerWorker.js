let intervalId;
self.onmessage = (event) => {
    const { type, timeCount } = event.data;
    let { time, byoyomi, style } = timeCount;
    if (type === 'START') {
        clearInterval(intervalId);
        intervalId = setInterval(() => {
            time--;
            if (time >= 0 && time <= 60) {
                postMessage({ type: 'EXTRATIME', isExtra: true });
            } else {
                postMessage({ type: 'EXTRATIME', isExtra: false });
            }
            if (time < 0 && byoyomi <= 0) {
                postMessage({ type: 'TIMEOUT' });
                clearInterval(intervalId);
                return;
            }
            if (time <= 0 && byoyomi > 0) {
                time = style;
                byoyomi -= 1;
                postMessage({ type: 'UPDATE', timeCount: { byoyomi, time } });
                return;
            }
            if (time >= 0) {
                postMessage({ type: 'TICK', timeCount: { time } });
                return;
            }
        }, 1000)
    } else if (type === 'STOP') {
        clearInterval(intervalId);
        if (time >= 0 && time <= 60) {
            postMessage({ type: 'TICK', timeCount: { time } });
        }
    }
}