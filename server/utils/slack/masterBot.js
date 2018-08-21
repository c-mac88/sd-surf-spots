const INSTRUCTORS_CHANNEL_ID = 'G4BT52PML';

const lateNotificationMessageAttachments = [{
  fallback: 'What is your predicament?',
  title: 'What is your predicament?',
  callback_id: 'late_notification_res',
  attachment_type: 'default',
  actions: [
    {
      name: 'forgot-clockin',
      text: 'Forgot to Clock-in.',
      type: 'button',
      value: 'forgot-clockin'
    },
    {
      name: 'will-be-late',
      text: 'I will be late today.',
      type: 'button',
      value: 'will-be-late'
    },
    {
      name: 'will-miss-day',
      text: 'I am unable to make it today.',
      style: 'danger',
      type: 'button',
      value: 'will-miss-day'
    }
  ]
}];

module.exports = {
  INSTRUCTORS_CHANNEL_ID,
  lateNotificationMessageAttachments
};
