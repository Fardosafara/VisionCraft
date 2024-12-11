const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Update the /send-email endpoint to handle the form data
app.post("/send-email", async (req, res) => {
  const { clientName, clientEmail, ...formData } = req.body;

  // Validate incoming data
  if (!clientName || !clientEmail) {
    return res.status(400).send("Name and email are required.");
  }

  const mailOptions = {
    from: `"Website Form" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `New Website Project Scope Questionnaire from ${clientName}`,
    html: `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
          h2 { color: #2980b9; margin-top: 20px; }
          .section { background-color: #f9f9f9; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
          .field { margin-bottom: 10px; }
          .label { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>New Website Project Scope Questionnaire</h1>
          
          <div class="section">
            <h2>Client Information</h2>
            <div class="field"><span class="label">Name:</span> ${clientName}</div>
            <div class="field"><span class="label">Email:</span> ${clientEmail}</div>
          </div>

          <div class="section">
            <h2>General Information</h2>
            <div class="field"><span class="label">Website Goal:</span> ${formData.websiteGoal}</div>
            ${formData.otherGoal ? `<div class="field"><span class="label">Other Goal:</span> ${formData.otherGoal}</div>` : ''}
            <div class="field"><span class="label">Key Features:</span> ${formData.keyFeatures}</div>
            ${formData.otherFeatures ? `<div class="field"><span class="label">Other Features:</span> ${formData.otherFeatures}</div>` : ''}
            <div class="field"><span class="label">Target Audience:</span> ${formData.targetAudience}</div>
          </div>

          <div class="section">
            <h2>Design and Layout</h2>
            <div class="field"><span class="label">Design Preference:</span> ${formData.designPreference}</div>
            <div class="field"><span class="label">Number of Pages:</span> ${formData.numberOfPages}</div>
            <div class="field"><span class="label">Interactive Features:</span> ${formData.interactiveFeatures}</div>
            ${formData.otherInteractive ? `<div class="field"><span class="label">Other Interactive Features:</span> ${formData.otherInteractive}</div>` : ''}
            <div class="field"><span class="label">Mobile Responsive:</span> ${formData.mobileResponsive}</div>
          </div>

          <div class="section">
            <h2>Functionality</h2>
            <div class="field"><span class="label">Booking System:</span> ${formData.bookingSystem}</div>
            <div class="field"><span class="label">SEO Optimization:</span> ${formData.seoOptimization}</div>
            <div class="field"><span class="label">Authentication:</span> ${formData.authentication}</div>
            <div class="field"><span class="label">Database Requirement:</span> ${formData.databaseRequirement}</div>
          </div>

          <div class="section">
            <h2>Content and Additional Features</h2>
            <div class="field"><span class="label">Content Provider:</span> ${formData.contentProvider}</div>
            <div class="field"><span class="label">Content Help Needed:</span> ${formData.contentHelp}</div>
            <div class="field"><span class="label">Contact Form:</span> ${formData.contactForm}</div>
            <div class="field"><span class="label">Social Media Integration:</span> ${formData.socialMediaIntegration}</div>
          </div>

          <div class="section">
            <h2>Project Details</h2>
            <div class="field"><span class="label">Budget:</span> ${formData.budget}</div>
            <div class="field"><span class="label">Timeline:</span> ${formData.timeline}</div>
            ${formData.additionalFeatures ? `<div class="field"><span class="label">Additional Features:</span> ${formData.additionalFeatures}</div>` : ''}
          </div>
        </div>
      </body>
    </html>
  `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email.");
  }
});

const port = process.env.PORT || 5500;
app.listen(port, () => console.log(`Server listening on port ${port}`));

