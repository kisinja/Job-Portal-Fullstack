import Resume from "../models/Resume.js";
import PDFDocument from "pdfkit";

// @desc    Create a new resume
// @route   POST /api/resumes
// @access  Private
export const createResume = async (req, res) => {
  const {
    personalInfo,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    hobbies,
  } = req.body;

  const userId = req.user._id;
  console.log(userId);

  try {
    const newResume = new Resume({
      userId: userId,
      personalInfo,
      experience,
      education,
      skills,
      projects,
      certifications,
      languages,
      hobbies,
    });

    const resume = await newResume.save();
    if (!resume) return res.json({ error: "Error while creating resume!" });

    res.status(201).json({
      message: "Resume created Successfully",
      resume,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message }).status(500);
  }
};

// @desc    Get resume by user ID
// @route   GET /api/resumes/:userId
// @access  Private
export const getResumeByUserId = async (req, res) => {
  const userId = req.user._id;
  console.log(userId);

  try {
    const resume = await Resume.findOne({ userId });
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    res.status(200).json(resume);
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message }).status(500);
  }
};

// @desc    Generate a resume as PDF
// @route   GET /api/resumes/:resumeId/pdf
// @access  Private
export const generateResumePDF = async (req, res) => {
  const { resumeId } = req.params;

  try {
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const {
      personalInfo,
      experience,
      education,
      skills,
      projects,
      certifications,
      languages,
      hobbies,
    } = resume;

    const doc = new PDFDocument();

    // Pipe the PDF into the response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=resume_${resumeId}.pdf`
    );
    doc.pipe(res);

    // Header
    doc.fontSize(25).text("Resume", { align: "center" });

    // Personal Info
    doc.moveDown().fontSize(18).text("Personal Information");
    doc.fontSize(12).text(`Name: ${personalInfo.fullName}`);
    doc.text(`Email: ${personalInfo.email}`);
    doc.text(`Phone: ${personalInfo.phone}`);
    if (personalInfo.address) doc.text(`Address: ${personalInfo.address}`);
    if (personalInfo.linkedin) doc.text(`LinkedIn: ${personalInfo.linkedin}`);
    if (personalInfo.github) doc.text(`GitHub: ${personalInfo.github}`);
    if (personalInfo.website) doc.text(`Website: ${personalInfo.website}`);
    if (personalInfo.summary)
      doc.moveDown().text(`Summary: ${personalInfo.summary}`);

    // Experience
    if (experience?.length > 0) {
      doc.moveDown().fontSize(18).text("Experience");
      experience.forEach((exp) => {
        doc.moveDown().fontSize(14).text(`${exp.role} at ${exp.company}`);
        doc
          .fontSize(12)
          .text(
            `${new Date(exp.startDate).toLocaleDateString()} - ${
              exp.endDate
                ? new Date(exp.endDate).toLocaleDateString()
                : "Present"
            }`
          );
        if (exp.location) doc.text(`Location: ${exp.location}`);
        if (exp.description) doc.moveDown().text(exp.description);
      });
    }

    // Education
    if (education?.length > 0) {
      doc.moveDown().fontSize(18).text("Education");
      education.forEach((edu) => {
        doc
          .moveDown()
          .fontSize(14)
          .text(`${edu.degree} in ${edu.fieldOfStudy}`);
        doc
          .fontSize(12)
          .text(
            `${edu.institution}, ${new Date(
              edu.startDate
            ).toLocaleDateString()} - ${
              edu.endDate
                ? new Date(edu.endDate).toLocaleDateString()
                : "Present"
            }`
          );
        if (edu.location) doc.text(`Location: ${edu.location}`);
      });
    }

    // Skills
    if (skills?.length > 0) {
      doc.moveDown().fontSize(18).text("Skills");
      doc.fontSize(12).text(skills.map((s) => s).join(", "));
    }

    // Projects
    if (projects?.length > 0) {
      doc.moveDown().fontSize(18).text("Projects");
      projects.forEach((proj) => {
        doc.moveDown().fontSize(14).text(proj.title);
        if (proj.description) doc.fontSize(12).text(proj.description);
        if (proj.link) doc.text(`Link: ${proj.link}`);
      });
    }

    // Certifications
    if (certifications?.length > 0) {
      doc.moveDown().fontSize(18).text("Certifications");
      certifications.forEach((cert) => {
        doc.moveDown().fontSize(14).text(cert.title);
        doc
          .fontSize(12)
          .text(
            `${cert.issuingOrganization}, Issued: ${new Date(
              cert.issueDate
            ).toLocaleDateString()}`
          );
        if (cert.expirationDate)
          doc.text(
            `Expires: ${new Date(cert.expirationDate).toLocaleDateString()}`
          );
        if (cert.credentialId) doc.text(`Credential ID: ${cert.credentialId}`);
        if (cert.credentialUrl)
          doc.text(`Credential URL: ${cert.credentialUrl}`);
      });
    }

    // Languages
    if (languages?.length > 0) {
      doc.moveDown().fontSize(18).text("Languages");
      languages.forEach((lang) => {
        doc.moveDown().fontSize(14).text(`${lang.name}: ${lang.proficiency}`);
      });
    }

    // Hobbies
    if (hobbies?.length > 0) {
      doc.moveDown().fontSize(18).text("Hobbies");
      doc.fontSize(12).text(hobbies.map((h) => h).join(", "));
    }

    // Footer credit
    doc
      .moveDown()
      .fontSize(10)
      .fillColor("indigo")
      .text(
        "Generated by TechPoster - https://techposter-frontend.onrender.com",
        {
          align: "center",
        }
      );

    doc.end();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update an existing resume
// @route   PUT /api/resumes/:resumeId
// @access  Private
export const updateResume = async (req, res) => {
  const { resumeId } = req.params;
  const {
    personalInfo,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    hobbies,
  } = req.body;

  try {
    const resume = await Resume.findByIdAndUpdate(
      resumeId,
      {
        personalInfo,
        experience,
        education,
        skills,
        projects,
        certifications,
        languages,
        hobbies,
      },
      { new: true }
    );
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    res.status(200).json(resume);
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message }).status(500);
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:resumeId
// @access  Private
export const deleteResume = async (req, res) => {
  const { resumeId } = req.params;

  try {
    const deletedResume = await Resume.findByIdAndDelete(resumeId);

    if (!deletedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message }).status(500);
  }
};
