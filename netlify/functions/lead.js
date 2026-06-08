const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: 'Method Not Allowed' };
  }

  try {
    const { name, email, projectType, description, timeline, budget } =
      JSON.parse(event.body);

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 24px; }
    h2 { color: #F85E00; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 10px 14px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
    td:first-child { font-weight: 600; white-space: nowrap; width: 140px; color: #374151; }
    td:last-child { color: #111827; }
  </style>
</head>
<body>
  <h2>New Lead from Portfolio Chatbot</h2>
  <table>
    <tr><td>Name</td><td>${escHtml(name)}</td></tr>
    <tr><td>Email</td><td>${escHtml(email)}</td></tr>
    <tr><td>Project Type</td><td>${escHtml(projectType)}</td></tr>
    <tr><td>Description</td><td>${escHtml(description)}</td></tr>
    <tr><td>Timeline</td><td>${escHtml(timeline)}</td></tr>
    <tr><td>Budget</td><td>${escHtml(budget)}</td></tr>
  </table>
</body>
</html>`;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: 'joelgacho.ffseo@gmail.com',
        subject: `New Lead from Portfolio Chatbot — ${name}`,
        html,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Resend error:', err);
      return {
        statusCode: 502,
        headers: CORS,
        body: JSON.stringify({ error: 'Email service unavailable' }),
      };
    }

    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error('lead function error:', err);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

function escHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
