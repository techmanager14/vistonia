# Modern Hiring Landing Page

A responsive, modern hiring landing page built with HTML, CSS, and JavaScript. The page includes a hero section, job roles display, and an application form that submits data to Google Sheets.

## Features

- Modern, responsive design
- Interactive job role cards
- Dynamic form validation
- Google Sheets integration
- Smooth animations and transitions
- Mobile-friendly layout

## Setup Instructions

### 1. Google Apps Script Setup

1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project
3. Copy and paste the following code into the editor:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.name,
    data.email,
    data.phone,
    data.position,
    data.resume
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({
    'result': 'success',
    'row': sheet.getLastRow()
  })).setMimeType(ContentService.MimeType.JSON);
}
```

4. Create a new Google Sheet
5. Deploy the script as a web app:
   - Click "Deploy" > "New deployment"
   - Choose "Web app"
   - Set "Execute as" to "Me"
   - Set "Who has access" to "Anyone"
   - Click "Deploy"
6. Copy the provided web app URL

### 2. Update the JavaScript File

1. Open `script.js`
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL` with the web app URL you copied

### 3. Deployment

You can deploy this landing page using any static hosting service:

- GitHub Pages
- Netlify
- Vercel
- Any traditional web hosting

## File Structure

```
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
└── README.md          # Documentation
```

## Customization

### Colors
The color scheme can be modified in `styles.css`. The main colors are:
- Primary: #4f46e5
- Secondary: #6366f1
- Text: #333
- Background: #f8fafc

### Job Roles
To modify job roles and their requirements, update the `roleRequirements` object in `script.js`.

### Form Fields
Additional form fields can be added in `index.html` and handled in `script.js`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Feel free to submit issues and enhancement requests! 