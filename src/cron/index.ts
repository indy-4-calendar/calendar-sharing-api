import cron from 'node-cron';

import sendNotifications from './send-notifications';

const startJobs = () => {
  // Every minute
  // Check for notifications of events
  cron.schedule('* * * * *', sendNotifications);
};

export default { startJobs };
