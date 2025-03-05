const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multer = require("multer");
const hrContacts = require("./hr_contacts.json"); // Import HR contacts JSON

const app = express();
app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// ✅ Function to get HR Emails & Company Names in Range
const getHREmailsInRange = (fromSno, toSno) => {
  return hrContacts
    .filter((contact) => {
      const sno = parseInt(contact.SNo, 10);
      return sno >= fromSno && sno <= toSno;
    })
    .filter((hr) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(hr.Email)) // ✅ Valid email check
    .map((hr) => ({
      email: hr.Email,
      company: hr.Company,  // ✅ Get company name per HR
    }));
};

// 📌 ✅ Send personalized email to each HR separately
app.post("/send-email", upload.single("resume"), async (req, res) => {
  const { email, appKey, fromSno, toSno, subject, message } = req.body;
  const resume = req.file;

  const hrDetailsList = getHREmailsInRange(parseInt(fromSno), parseInt(toSno));

  if (hrDetailsList.length === 0) {
    return res.status(400).json({ message: "❌ No valid HR emails found in the given range." });
  }

  let errors = [];
  let successCount = 0;

  for (const hr of hrDetailsList) {
    const personalizedMessage = message.replace(/\{company\}/g, hr.company); // ✅ Replace {company} for each HR

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: email, pass: appKey },
    });

    const mailOptions = {
      from: email,
      to: hr.email,
      subject: subject || `Job Application for ${hr.company}`,
      text: personalizedMessage,
      attachments: resume ? [{ filename: resume.originalname, path: resume.path }] : [],
    };

    try {
      await transporter.sendMail(mailOptions);
      successCount++;
    } catch (error) {
      errors.push(`Failed to send email to ${hr.email}: ${error.message}`);
    }
  }

  if (errors.length > 0) {
    return res.status(500).json({ message: `✅ Sent ${successCount} emails. ❌ Errors: ${errors.join("; ")}` });
  }

  res.json({ message: `✅ Successfully sent ${successCount} emails!` });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));