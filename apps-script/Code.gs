/**
 * Wellspring Writes — inquiry forms → Google Sheet
 *
 * One script serves both versions of the site:
 *   - one-page site (hi-kny/becki)          → tab "Sheet1"
 *   - multi-page site (hi-kny/becki_original) → tab "Multi-page site"
 * Each form sends a hidden form_id field that picks its tab and columns.
 * Tabs are created, with a header row, on their first submission.
 *
 * Paste this into the sheet's Apps Script editor (Extensions → Apps Script),
 * then Deploy → New deployment → Web app, "Execute as: Me",
 * "Who has access: Anyone". Paste the /exec URL into each site's form
 * (the data-endpoint attribute).
 */

// Optional: send an email for every new inquiry. Leave empty to turn off.
const NOTIFY_EMAIL = '';

const FORMS = {
  onepage: {
    sheet: 'Sheet1',
    required: ['name', 'email'],
    // [form field name, column header]
    fields: [
      ['name', 'Name'],
      ['email', 'Email'],
      ['type', 'Project type'],
      ['date', 'Event date'],
      ['location', 'Location'],
      ['quantity', 'Quantity'],
      ['budget', 'Budget'],
      ['message', 'Message'],
    ],
  },
  multipage: {
    sheet: 'Multi-page site',
    required: ['first_name', 'last_name', 'email'],
    fields: [
      ['subject', 'Subject'],
      ['first_name', 'First name'],
      ['last_name', 'Last name'],
      ['email', 'Email'],
      ['event_date', 'Event / deadline date'],
      ['services', 'Services'],
      ['quantity', 'Quantity'],
      ['ink_colors', 'Ink color(s)'],
      ['message', 'Message'],
      ['heard_from', 'Heard about from'],
    ],
  },
};

function doPost(e) {
  const single = (e && e.parameter) || {};
  const multi = (e && e.parameters) || {};

  // Bots fill the hidden honeypot field; people don't see it.
  if (single['company-url']) return json({ result: 'ok' });

  const form = FORMS[single.form_id] || FORMS.onepage;

  // Checkbox groups send several values under one name; join them.
  const value = name => clean((multi[name] || [single[name]]).join(', '));

  if (form.required.some(name => !value(name))) {
    return json({ result: 'error', error: 'Please fill in the required fields.' });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(form.sheet) || ss.insertSheet(form.sheet);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Received'].concat(form.fields.map(f => f[1])));
      sheet.getRange(1, 1, 1, form.fields.length + 1).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([new Date()].concat(form.fields.map(f => value(f[0]))));

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        replyTo: value('email'),
        subject: `New inquiry (${form.sheet}): ${value('subject') || value('name') ||
          value('first_name') + ' ' + value('last_name')}`,
        body: form.fields.map(f => `${f[1]}: ${value(f[0])}`).join('\n') +
          `\n\nSheet: ${ss.getUrl()}`,
      });
    }

    return json({ result: 'ok' });
  } finally {
    lock.releaseLock();
  }
}

// Stops a submitted value starting with = + - @ being run as a formula in the sheet.
function clean(value) {
  const s = String(value || '').trim().slice(0, 5000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
