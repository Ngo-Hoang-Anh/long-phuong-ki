export const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

function padNumber(num) {
    return num < 10 ? "0" + num : num;
}
export const convertSecondToTimeAndMinutes = (seconds, style) => {
    let minutes = Math.floor((seconds % 3600) / 60);
    let second = seconds % 60;
    let remainingTimes = Math.floor(seconds / (style * 60));
    return { minutes: padNumber(minutes), second: padNumber(second), remainingTimes };
}