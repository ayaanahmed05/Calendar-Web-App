// Get the current date and set it to currentDate
let currentDate = new Date();
let selectedDate = null;

// Get the saved events from localStorage if they exist
let savedEvents = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

// Get the calendar container in the HTML
const calendarContainer = document.getElementById('calendar');

// Create a list of weekday names
const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Function to show the calendar and events
function renderCalendar() {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Set the month name and year at the top
    document.getElementById('monthDisplay').innerText = `${currentDate.toLocaleDateString('en-us', { month: 'long' })} ${currentYear}`;

    // Clear the calendar before adding new days
    calendarContainer.innerHTML = '';

    // Get the first day of the month and the total number of days in the month
    const firstDayOfCurrentMonth = new Date(currentYear, currentMonth, 1);
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const leadingEmptyDays = weekdayNames.indexOf(firstDayOfCurrentMonth.toLocaleDateString('en-us', { weekday: 'long' }));

    // Get the last day of the previous month to calculate empty days at the start
    const lastDayOfPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    // Add empty spaces for days from the previous month
    for (let i = leadingEmptyDays; i > 0; i--) {
        const prevMonthDay = lastDayOfPrevMonth - i + 1;
        const paddingDiv = document.createElement('div');
        paddingDiv.classList.add('day', 'padding');
        paddingDiv.innerText = prevMonthDay;
        calendarContainer.appendChild(paddingDiv);
    }

    // Loop through the days in the current month and add them to the calendar
    for (let day = 1; day <= totalDaysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');

        const dayString = `${currentMonth + 1}/${day}/${currentYear}`;
        dayDiv.innerText = day;

        // Check if there are any events for the day
        const eventForDay = savedEvents.find(event => event.date === dayString);
        if (eventForDay) {
            const eventDiv = document.createElement('div');
            eventDiv.classList.add('event');
            eventDiv.innerText = eventForDay.title;
            dayDiv.appendChild(eventDiv);
        }

        // Add click event for selecting the day and adding or deleting events
        dayDiv.addEventListener('click', () => {
            selectedDate = dayString; // Set the selected date

            const eventForSelectedDay = savedEvents.find(event => event.date === selectedDate);
            if (eventForSelectedDay) {
                const confirmDelete = confirm(`Event: ${eventForSelectedDay.title}\nDo you want to delete this event?`);
                if (confirmDelete) {
                    // Remove the event
                    savedEvents = savedEvents.filter(event => event.date !== selectedDate);
                    localStorage.setItem('events', JSON.stringify(savedEvents)); // Save the updated events
                    renderCalendar(); // Refresh the calendar
                }
            } else {
                // Ask the user to enter an event
                const eventTitle = prompt("Enter your event like Exam, Birthday, etc");
                if (eventTitle) {
                    savedEvents.push({ date: selectedDate, title: eventTitle });
                    localStorage.setItem('events', JSON.stringify(savedEvents)); // Save the new event
                    renderCalendar(); // Refresh the calendar
                }
            }
        });

        calendarContainer.appendChild(dayDiv); // Add the day to the calendar
    }
}

// When the next button is clicked, go to the next month
document.getElementById('nextButton').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// When the back button is clicked, go to the previous month
document.getElementById('backButton').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

// Show the calendar when the page loads
renderCalendar();