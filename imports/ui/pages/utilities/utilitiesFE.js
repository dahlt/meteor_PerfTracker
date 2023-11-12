// Helper function to convert duration string to minutes
export const convertDurationToMinutes = (duration) => {
    const durationParts = duration.split(" ");
    const totalDurationHours = parseInt(durationParts[0], 10);
    const totalDurationMinutes = parseInt(durationParts[2], 10);
    return totalDurationHours * 60 + totalDurationMinutes;
};

// Helper function to convert active hours string to minutes
export const convertActiveHoursToMinutes = (activeHours) => {
    const activeHoursParts = activeHours.split(" ");
    const totalActiveHours = parseInt(activeHoursParts[0], 10);
    const totalActiveMinutes = parseInt(activeHoursParts[2], 10);
    return totalActiveHours * 60 + totalActiveMinutes;
};

// Function to calculate average of an array of numbers
export const calculateAverage = (array) => {
    if (!array) {
        return 0;
    }
    const sum = array.reduce((acc, val) => acc + val, 0);
    return sum / array.length;
};