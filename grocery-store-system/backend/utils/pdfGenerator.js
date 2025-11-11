const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generateInvoicePDF = async (invoice, order) => {
  return new Promise((resolve, reject) => {
    try {
      // Create invoices directory if it doesn't exist
      const invoicesDir = path.join(__dirname, '../uploads/invoices');
      if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
      }

      const filename = `invoice-${invoice.invoiceNumber}.pdf`;
      const filepath = path.join(invoicesDir, filename);

      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Header
      doc.fontSize(24)
        .text('INVOICE', 50, 50)
        .fontSize(10)
        .text(`Invoice #: ${invoice.invoiceNumber}`, 50, 85)
        .text(`Date: ${invoice.invoiceDate.toLocaleDateString()}`, 50, 100)
        .text(`Order #: ${order.orderNumber}`, 50, 115);

      // Customer Info
      doc.fontSize(12)
        .text('Bill To:', 50, 150)
        .fontSize(10)
        .text(order.customer.name, 50, 170)
        .text(order.customer.email, 50, 185)
        .text(order.shippingAddress, 50, 200);

      // Table Header
      const tableTop = 250;
      doc.fontSize(10)
        .text('Item', 50, tableTop, { bold: true })
        .text('Qty', 250, tableTop)
        .text('Price', 320, tableTop)
        .text('Discount', 390, tableTop)
        .text('Total', 480, tableTop);

      doc.moveTo(50, tableTop + 15)
        .lineTo(550, tableTop + 15)
        .stroke();

      // Items
      let yPosition = tableTop + 25;
      invoice.items.forEach((item, index) => {
        doc.text(item.product, 50, yPosition, { width: 180 })
          .text(item.quantity.toString(), 250, yPosition)
          .text(`${item.price.toFixed(2)}`, 320, yPosition)
          .text(`${item.discount}%`, 390, yPosition)
          .text(`${item.total.toFixed(2)}`, 480, yPosition);

        yPosition += 25;
      });

      // Line before totals
      yPosition += 10;
      doc.moveTo(50, yPosition)
        .lineTo(550, yPosition)
        .stroke();

      // Totals
      yPosition += 20;
      doc.text('Subtotal:', 380, yPosition)
        .text(`${invoice.subtotal.toFixed(2)}`, 480, yPosition);

      yPosition += 20;
      doc.text('Tax (13%):', 380, yPosition)
        .text(`${invoice.tax.toFixed(2)}`, 480, yPosition);

      yPosition += 20;
      doc.fontSize(12)
        .text('Total Amount:', 380, yPosition, { bold: true })
        .text(`${invoice.totalAmount.toFixed(2)}`, 480, yPosition);

      // Footer
      doc.fontSize(8)
        .text('Thank you for your business!', 50, 700, { align: 'center' })
        .text('For any queries, contact us at support@grocerystore.com', 50, 715, { align: 'center' });

      doc.end();

      stream.on('finish', () => {
        resolve(filepath);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};