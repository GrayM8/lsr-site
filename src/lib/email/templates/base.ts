/**
 * Base email template wrapper with LSR branding.
 * All notification emails use this layout.
 */

export type BaseTemplateProps = {
  previewText?: string;
  title: string;
  body: string; // HTML content
  actionUrl?: string;
  actionText?: string;
  footerText?: string;
};

export function baseTemplate({
  previewText,
  title,
  body,
  actionUrl,
  actionText,
  footerText,
}: BaseTemplateProps): { html: string; text: string } {
  const currentYear = new Date().getFullYear();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  ${previewText ? `<!--[if !mso]><!--><meta name="x-apple-mail-app-link" content="${previewText}"><!--<![endif]-->` : ""}
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #1a1a1a;
      color: #ffffff;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 32px;
    }
    .logo {
      width: 80px;
      height: 80px;
    }
    .brand-name {
      font-size: 18px;
      font-weight: 800;
      font-style: italic;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      color: #ffffff;
      margin-top: 12px;
    }
    .content {
      background-color: #262626;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 32px;
    }
    .title {
      font-size: 24px;
      font-weight: 800;
      font-style: italic;
      text-transform: uppercase;
      color: #ffffff;
      margin: 0 0 16px 0;
    }
    .body-text {
      font-size: 16px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.7);
    }
    .body-text p {
      margin: 0 0 16px 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #ff6b00;
      color: #ffffff !important;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      text-decoration: none;
      padding: 16px 32px;
      margin-top: 24px;
    }
    .cta-button:hover {
      background-color: #ff8533;
    }
    .footer {
      text-align: center;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .footer-text {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.4);
      margin: 0;
    }
    .footer-link {
      color: #ff6b00;
      text-decoration: none;
    }
    .divider {
      height: 1px;
      background-color: rgba(255, 255, 255, 0.1);
      margin: 24px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img
        src="https://www.longhornsimracing.org/brand/logos/white_logo2.png"
        alt="LSR"
        class="logo"
        width="80"
        height="80"
      />
      <div class="brand-name">Longhorn Sim Racing</div>
    </div>

    <div class="content">
      <h1 class="title">${title}</h1>
      <div class="body-text">
        ${body}
      </div>
      ${
        actionUrl && actionText
          ? `<a href="${actionUrl}" class="cta-button">${actionText}</a>`
          : ""
      }
    </div>

    <div class="footer">
      ${footerText ? `<p class="footer-text">${footerText}</p>` : ""}
      <p class="footer-text">
        &copy; ${currentYear} Longhorn Sim Racing &bull; University of Texas at Austin
      </p>
      <p class="footer-text" style="margin-top: 8px;">
        <a href="https://www.longhornsimracing.org/account" class="footer-link">Manage email preferences</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  // Generate plain text version
  const text = `
${title.toUpperCase()}

${body.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()}

${actionUrl && actionText ? `${actionText}: ${actionUrl}` : ""}

---
${footerText ? footerText + "\n" : ""}
Longhorn Sim Racing | University of Texas at Austin
Manage preferences: https://www.longhornsimracing.org/account
  `.trim();

  return { html, text };
}
