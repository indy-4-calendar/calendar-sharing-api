import User from '@/models/user';
import Event from '@/models/event';
import logger from '@/lib/logger';

const sendNotifications = async () => {
  const startTime = performance.now();
  logger.debug('[CRON] Checking for events');

  const now = new Date();
  now.setSeconds(0, 0);

  // Thirty minutes from now minus 30 seconds
  const thirtyMinutesFromNowLower = new Date(
    now.getTime() + 30 * 60 * 1000 - 30 * 1000,
  );
  // Thirty minutes from now plus 30 seconds
  const thirtyMinutesFromNowUpper = new Date(
    now.getTime() + 30 * 60 * 1000 + 30 * 1000,
  );

  // Find all events whose start date is in 30 minutes
  const events = await Event.find({
    date: {
      $gt: thirtyMinutesFromNowLower,
      $lte: thirtyMinutesFromNowUpper,
    },
  });

  // For each event, find all of the users with that calendar in their list, and
  // send them a notification
  for (const event of events) {
    const users = await User.find({ calendars: { $in: [event.calendar] } });

    for (const user of users) {
      user.sendNotification({
        title: 'Event Reminder',
        body: `"${event.name}" is in 30 minutes`,
      });
    }
  }

  const endTime = performance.now();
  const time = Math.floor(endTime - startTime);
  logger.debug(`[CRON] Finished checking events in ${time}ms`);
};

export default sendNotifications;
