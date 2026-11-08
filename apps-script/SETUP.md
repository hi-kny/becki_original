# Connecting the inquiry form to Google Sheets

Form submissions are saved as new rows in [Contact Form_Wellspring Writes](https://docs.google.com/spreadsheets/d/1pi5QcrqqstRHxXLGhTMOO6-UJ8nNWSWP1cc5HX24agk/edit). The site sends them to a small Google Apps Script attached to that sheet. Setup is one time and takes about 5 minutes.

**One script serves both versions of the site.** Each version saves to its own tab, because the two forms ask different questions:

| Site | Repo | Tab | File to edit in step 3 |
|---|---|---|---|
| One-page | [hi-kny/becki](https://github.com/hi-kny/becki) | `Sheet1` | `site/index.html` |
| Multi-page | [hi-kny/becki_original](https://github.com/hi-kny/becki_original) | `Multi-page site` (created automatically) | `contact.html` |

Both repos contain an identical copy of `apps-script/Code.gs`. Deploy it once and paste the same URL into both sites.

## 1. Add the script to the sheet

1. Open the sheet and go to **Extensions → Apps Script**.
2. Delete the sample code and paste in everything from [`apps-script/Code.gs`](../apps-script/Code.gs).
3. Optional: set `NOTIFY_EMAIL` to Becky's address so she gets an email for each inquiry.
4. Click **Save**.

## 2. Deploy it as a web app

1. Click **Deploy → New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. **Execute as:** Me. **Who has access:** Anyone.
4. Click **Deploy** and approve the permissions. Google warns that the app is unverified because it's your own script: click *Advanced → Go to project*.
5. Copy the **Web app URL**. It ends in `/exec`.

## 3. Paste the URL into the site

In each site's form file (see the table above), find `data-endpoint="PASTE_WEB_APP_URL"` and replace `PASTE_WEB_APP_URL` with the URL you copied. Commit and push, and each site republishes automatically.

## 4. Test

Submit each site's form once. On a tab's first submission a header row appears, then one row per inquiry:

- **Sheet1 (one-page):** Received · Name · Email · Project type · Event date · Location · Quantity · Budget · Message
- **Multi-page site:** Received · Subject · First name · Last name · Email · Event / deadline date · Services · Quantity · Ink color(s) · Message · Heard about from

If several services are checked, they go into one cell, separated by commas.

## Notes

- **Changing the script later:** use **Deploy → Manage deployments → Edit → Version: New version**, which keeps the same URL. A *new* deployment gives a new URL that you'd have to paste again.
- **Spam:** a hidden "honeypot" field quietly drops most bot submissions.
- **Safety:** a value starting with `=`, `+`, `-` or `@` is saved as plain text, so nobody can slip a formula into the sheet.
- The web app URL appears in the public page source. That's normal: all it can do is add rows to this one sheet.
