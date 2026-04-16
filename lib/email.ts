import nodemailer from 'nodemailer';

import { BRAND_CONFIG } from '@/config/brand';

type SendOptions = {
  replyTo?: string;
};

function makeTransport() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpSecure = process.env.SMTP_SECURE === 'true';

  if (smtpHost) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function getFromAddress() {
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
  const fromName = process.env.SMTP_FROM_NAME || BRAND_CONFIG.name;

  if (!fromEmail) {
    return null;
  }

  return `${fromName} <${fromEmail}>`;
}

export function getAdminInboxEmail() {
  return process.env.ADMIN_EMAIL || process.env.SMTP_USER || null;
}

async function send(to: string, subject: string, html: string, options: SendOptions = {}) {
  const from = getFromAddress();

  if (!from || !process.env.SMTP_PASS) {
    console.warn('[email] SMTP not configured - skipping');
    return false;
  }

  try {
    await makeTransport().sendMail({
      from,
      replyTo: options.replyTo,
      to,
      subject,
      html,
    });
    console.log(`[email] sent -> ${to}`);
    return true;
  } catch (error) {
    console.error('[email] failed:', error);
    return false;
  }
}

export async function sendOrderConfirmation(
  customerEmail: string,
  order: {
    orderId: string;
    customerName: string;
    total: number;
    items: Array<{ name: string; quantity: number; price: number }>;
  },
) {
  const rows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #eee">${item.name}</td>
          <td style="padding:12px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
          <td style="padding:12px;border-bottom:1px solid #eee;text-align:right">${BRAND_CONFIG.currency.symbol}${item.price.toLocaleString()}</td>
        </tr>
      `,
    )
    .join('');

  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px;background:#fafafa">
      <h1 style="color:#1a1a1a;font-size:22px;text-transform:uppercase;letter-spacing:2px">Order Confirmed</h1>
      <div style="background:#fff;padding:30px;border-left:4px solid #d4af37">
        <p style="color:#333;font-size:15px">Dear ${order.customerName},</p>
        <p style="color:#666;font-size:14px">Thank you for your order. We&apos;ll begin processing it shortly.</p>
        <p style="color:#333;font-size:13px;margin-top:20px"><strong>Order ID:</strong> ${order.orderId}</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0">
          <thead>
            <tr style="background:#1a1a1a;color:#fff">
              <th style="padding:10px;text-align:left;font-size:11px;text-transform:uppercase">Item</th>
              <th style="padding:10px;text-align:center;font-size:11px;text-transform:uppercase">Qty</th>
              <th style="padding:10px;text-align:right;font-size:11px;text-transform:uppercase">Price</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
          <tfoot>
            <tr style="background:#f8f8f8;font-weight:bold">
              <td colspan="2" style="padding:14px;text-align:right">Total:</td>
              <td style="padding:14px;text-align:right">${BRAND_CONFIG.currency.symbol}${order.total.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
        <p style="color:#999;font-size:12px">
          Questions? ${BRAND_CONFIG.contact.email} | WhatsApp ${BRAND_CONFIG.contact.whatsapp}
        </p>
      </div>
      <p style="color:#bbb;font-size:11px;text-align:center;margin-top:24px">
        ${BRAND_CONFIG.name} | ${BRAND_CONFIG.contact.address}
      </p>
    </div>
  `;

  return send(customerEmail, `Order Confirmed #${order.orderId.slice(0, 8).toUpperCase()}`, html);
}

export async function sendGoldRateReminder(adminEmail: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px;background:#fafafa">
      <h1 style="color:#1a1a1a;font-size:20px;text-transform:uppercase;letter-spacing:2px">Gold Rate Reminder</h1>
      <div style="background:#fff;padding:30px;border-left:4px solid #d4af37">
        <p style="color:#333;font-size:15px">Today&apos;s 22K gold rate has <strong>not been updated yet</strong>.</p>
        <div style="background:#fff3cd;border:1px solid #ffeaa7;padding:16px;margin:16px 0">
          <p style="color:#856404;margin:0;font-weight:bold">Warning: prices are showing yesterday&apos;s rate.</p>
        </div>
        <a
          href="${siteUrl}/admin/gold-rate"
          style="display:inline-block;margin-top:24px;padding:14px 28px;background:#1a1a1a;color:#fff;text-decoration:none;text-transform:uppercase;letter-spacing:2px;font-size:12px;font-weight:bold"
        >
          Update Gold Rate
        </a>
      </div>
    </div>
  `;

  return send(adminEmail, "Gold rate not updated - prices showing yesterday's rate", html);
}

export async function sendContactInquiry(
  adminEmail: string,
  inquiry: { name: string; email: string; phone?: string; message: string },
) {
  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#fafafa">
      <h2 style="color:#1a1a1a;font-size:20px;text-transform:uppercase;letter-spacing:2px">New Inquiry</h2>
      <div style="background:#fff;padding:24px;border-left:4px solid #d4af37;margin-top:20px">
        <p><strong>Name:</strong> ${inquiry.name}</p>
        <p><strong>Email:</strong> ${inquiry.email}</p>
        ${inquiry.phone ? `<p><strong>Phone:</strong> ${inquiry.phone}</p>` : ''}
        <p style="margin-top:16px"><strong>Message:</strong></p>
        <p style="color:#555;line-height:1.6">${inquiry.message}</p>
      </div>
      <p style="color:#999;font-size:12px;margin-top:24px">Reply to this email to respond to ${inquiry.name}.</p>
    </div>
  `;

  return send(adminEmail, `New Inquiry from ${inquiry.name}`, html, { replyTo: inquiry.email });
}
