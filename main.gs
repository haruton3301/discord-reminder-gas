const WEBHOOK_URL = 'https://discord.com/api/webhooks/...';
const MESSAGE = 'ミーティングの時間です！';
const TIMEZONE = 'Asia/Tokyo';
const REMINDER_HOUR = 21;
const REMINDER_MINUTE = 0;
const THURSDAY_REMINDER_HOUR = 19;
const THURSDAY_REMINDER_MINUTE = 0;

function sendDiscordMessage() {
  const url = WEBHOOK_URL;
  const payload = {
    'content': MESSAGE
  };

  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };

  UrlFetchApp.fetch(url, options);

  // Delete old triggers
  deleteAllTriggers();

  // Schedule the next trigger
  scheduleNextTrigger();
}

function scheduleNextTrigger() {
  const timeZone = TIMEZONE;
  const now = new Date();
  const nextTrigger = new Date(now);

  if (now.getDay() === 4) {
    // If today is Thursday, set the trigger for 19:00
    nextTrigger.setHours(THURSDAY_REMINDER_HOUR, THURSDAY_REMINDER_MINUTE, 0, 0);
  } else {
    // If today is not Thursday, set the trigger for 21:00
    nextTrigger.setHours(REMINDER_HOUR, REMINDER_MINUTE, 0, 0);
  }

  // If the trigger time has already passed today, schedule it for the next day
  if (now >= nextTrigger) {
    nextTrigger.setDate(nextTrigger.getDate() + 1);
  }

  ScriptApp.newTrigger('sendDiscordMessage')
    .timeBased()
    .at(nextTrigger)
    .inTimezone(timeZone)
    .create();
}

function createTimeDrivenTriggers() {
  deleteAllTriggers();
  scheduleNextTrigger();
}

function deleteAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    ScriptApp.deleteTrigger(trigger);
  }
}
