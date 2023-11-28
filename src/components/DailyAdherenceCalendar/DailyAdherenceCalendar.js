import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function DailyAdherenceCalendar({ loggedMedications }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    console.log("DailyAdherenceCalendar loggedMedications:", loggedMedications);
    const mappedEvents = loggedMedications.map(log => {
      try {
        const startDateTime = new Date(log.action_time);
        return {
          title: `${log.drug_name} - ${log.action}`,
          start: startDateTime,
          end: startDateTime,
          allDay: false
        };
      } catch (error) {
        console.error('Error mapping event:', error);
        return null;
      }
    }).filter(event => event !== null);

    setEvents(mappedEvents);
  }, [loggedMedications]);

  const handleEventClick = (event) => {
    alert(`Medication: ${event.title}\nTime: ${event.start.toLocaleTimeString()}`);
  };

  const twoHoursAgo = new Date();
  twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 300 }}
        views={['day']}
        defaultView="day"
        scrollToTime={twoHoursAgo}
        onSelectEvent={handleEventClick}
      />
    </div>
  );
}

export default DailyAdherenceCalendar;
