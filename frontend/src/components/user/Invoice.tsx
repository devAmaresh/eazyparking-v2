import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Booking {
  id: string;
  registrationNumber: string;
  location: string;
  company: string;
  category: string;
  inTime: string;
  outTime: string | null;
  totalSpent: number;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  regDate: string;
  profileImage: string;
}

export const generateInvoicePDF = (booking: Booking, profile: UserProfile) => {
  const doc = new jsPDF();

  const marginLeft = 15;
  const pageWidth = doc.internal.pageSize.getWidth();

  // --- Header Branding ---
  doc.setFillColor(245, 245, 245);
  doc.rect(0, 0, pageWidth, 43, "F");

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40, 40, 40);
  doc.text("EazyParking", marginLeft, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(90);
  doc.text("support@eazyparking.tech", marginLeft, 27);
  doc.text("www.eazyparking.tech", marginLeft, 32);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(0);
  doc.text("INVOICE", pageWidth - marginLeft, 20, { align: "right" });

  // --- Invoice Meta ---
  const invoiceNo = `INV-${booking.id.slice(-6)}`;
  const invoiceDate = new Date().toLocaleDateString();

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80);

  doc.text(`Invoice No: ${invoiceNo}`, pageWidth - marginLeft, 28, {
    align: "right",
  });
  doc.text(`Date: ${invoiceDate}`, pageWidth - marginLeft, 34, {
    align: "right",
  });
  doc.text(`Booking Id: ${booking.id}`, pageWidth - marginLeft, 40, {
    align: "right",
  });

  // --- Customer & Booking Info ---
  let y = 50;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(33);
  doc.text("Billed To", marginLeft, y);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60);
  y += 6;
  doc.text(`${profile.firstName} ${profile.lastName}`, marginLeft, y);
  y += 5;
  doc.text(`Email: ${profile.email}`, marginLeft, y);
  y += 5;
  doc.text(`Mobile: ${profile.mobileNumber || "NA"}`, marginLeft, y);

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(33);
  doc.text("Booking Summary", marginLeft, y);

  // --- Booking Table ---
  autoTable(doc, {
    startY: y + 6,
    head: [
      [
        "Vehicle Company",
        "Reg No",
        "Category",
        "Location",
        "Check-In",
        "Check-Out",
        "Amount (Rs)",
      ],
    ],
    body: [
      [
        booking.company,
        booking.registrationNumber,
        booking.category,
        booking.location,
        new Date(booking.inTime).toLocaleString(),
        booking.outTime ? new Date(booking.outTime).toLocaleString() : "-",
        booking.totalSpent.toFixed(2),
      ],
    ],
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 3,
      valign: "middle",
    },
    headStyles: {
      fillColor: [22, 160, 133],
      textColor: 255,
      fontStyle: "bold",
    },
    columnStyles: {
      6: { halign: "right" },
    },
    margin: { left: marginLeft, right: marginLeft },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // --- Total Summary Box ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(33);
  doc.text("Total Amount Payable", pageWidth - marginLeft - 69, finalY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(22, 160, 133);
  doc.text(
    `Rs ${booking.totalSpent.toFixed(2)}`,
    pageWidth - marginLeft,
    finalY,
    { align: "right" }
  );

  // --- Footer ---
  const footerY = finalY + 40;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text("Authorized Signature", marginLeft, footerY);
  doc.line(marginLeft, footerY + 1, marginLeft + 50, footerY + 1);
  doc.text("EazyParking.tech", marginLeft, footerY + 10);

  doc.setFont("helvetica", "italic");
  doc.setTextColor(150);
  doc.setFontSize(10);
  doc.text(
    "Thank you for choosing EazyParking. We appreciate your business!",
    pageWidth / 2,
    footerY + 30,
    {
      align: "center",
    }
  );
  doc.setFontSize(8);
  doc.setTextColor(130);
  doc.text(
    "Note: This is a computer-generated invoice. No signature required.",
    marginLeft,
    doc.internal.pageSize.getHeight() - 15
  );

  // --- Save PDF ---
  doc.save(`Invoice_${booking.registrationNumber}.pdf`);
  // --- Save PDF ---
  doc.save(`Invoice_${booking.registrationNumber}.pdf`);
};
