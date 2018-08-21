const staffChannel = 'https://hooks.slack.com/services/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';
const engineeringChannel = 'https://hooks.slack.com/services/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';
const alertsChannel = 'https://hooks.slack.com/services/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';

const timeClockMessageAttachments = [{
  fallback: 'Please confirm that the development team is working on this issue',
  title: 'Please confirm that the development team is working on this issue',
  callback_id: 'service_monitor_time_clock_confirm',
  attachment_type: 'default',
  actions: [
    {
      name: 'confirm',
      text: 'Confirm',
      type: 'button',
      value: 'confirm'
    }
  ]
}];

module.exports = {
  staffChannel,
  engineeringChannel,
  alertsChannel,
  timeClockMessageAttachments
};
