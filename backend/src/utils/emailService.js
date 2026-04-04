// backend/src/utils/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host  : process.env.EMAIL_HOST  || 'smtp.gmail.com',
  port  : process.env.EMAIL_PORT  || 587,
  secure: false,
  auth  : {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderEmail = async (order) => {
  if (!process.env.EMAIL_USER) return; // skip if not configured

  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee">${item.product.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center">${item.size}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>`).join('');

  const html = `
  <div style="font-family:'DM Sans',sans-serif;max-width:560px;margin:0 auto;background:#fff;border:1px solid #E2DDD6;border-radius:8px;overflow:hidden">
    <div style="background:#1A1660;padding:28px 32px;text-align:center">
      <h1 style="color:#fff;font-size:22px;font-weight:300;letter-spacing:0.1em;margin:0">JYOTHI COLLECTIONS</h1>
      <p style="color:rgba(255,255,255,0.6);font-size:12px;letter-spacing:0.2em;text-transform:lowercase;margin:6px 0 0">explore the fashion world</p>
    </div>
    <div style="padding:32px">
      <h2 style="color:#1A1660;font-size:18px;font-weight:400;margin:0 0 8px">Order Confirmed!</h2>
      <p style="color:#8B89C0;font-size:14px;margin:0 0 24px">Hi ${order.customerName}, your order has been placed successfully.</p>
      <p style="font-size:12px;color:#8B89C0;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:8px">Order ID</p>
      <p style="font-size:14px;font-weight:500;color:#1A1660;background:#F7F5FF;padding:10px 14px;border-radius:4px;margin:0 0 24px">${order.id}</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <thead>
          <tr style="background:#F7F5FF">
            <th style="padding:10px 12px;text-align:left;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#8B89C0">Product</th>
            <th style="padding:10px 12px;text-align:center;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#8B89C0">Size</th>
            <th style="padding:10px 12px;text-align:center;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#8B89C0">Qty</th>
            <th style="padding:10px 12px;text-align:right;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#8B89C0">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding:12px;text-align:right;font-weight:500;color:#1A1660">Total</td>
            <td style="padding:12px;text-align:right;font-weight:600;color:#2B2DB5;font-size:16px">₹${order.totalAmount.toLocaleString('en-IN')}</td>
          </tr>
        </tfoot>
      </table>
      <div style="background:#F7F5FF;border-radius:6px;padding:16px 20px;margin-bottom:24px">
        <p style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#8B89C0;margin:0 0 6px">Delivery Address</p>
        <p style="font-size:14px;color:#1A1660;margin:0">${order.address}</p>
        <p style="font-size:13px;color:#8B89C0;margin:4px 0 0">📞 ${order.phone}</p>
      </div>
      <p style="font-size:13px;color:#8B89C0;line-height:1.7;margin:0">We'll notify you once your order is shipped. Thank you for shopping with us!</p>
    </div>
    <div style="background:#F7F5FF;padding:16px 32px;text-align:center;border-top:1px solid #E2DDD6">
      <p style="font-size:12px;color:#8B89C0;margin:0">© 2025 Jyothi Collections · Made with care in India 🇮🇳</p>
    </div>
  </div>`;

  await transporter.sendMail({
    from   : process.env.EMAIL_FROM,
    to     : process.env.EMAIL_USER, // send to store owner
    subject: `New Order #${order.id.slice(0,8).toUpperCase()} — ${order.customerName}`,
    html,
  });
};

module.exports = { sendOrderEmail };
