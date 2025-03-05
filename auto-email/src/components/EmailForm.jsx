import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

function EmailForm() {
  const [email, setEmail] = useState("");
  const [appKey, setAppKey] = useState("");
  const [fromSno, setFromSno] = useState("");
  const [toSno, setToSno] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [resume, setResume] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setMessage(
        `I hope this email finds you well. My name is ${firstName} ${lastName}, and I am very interested in the ${role} role at {company}.
      
        I have completed my Bachelor of Technology in Computer Science & Engineering, and I am currently pursuing a career in software development. I have gained hands-on experience through internships, where I had the opportunity to work with technologies like Java, JavaScript, React, Node.js, and SQL.
        
        Some highlights of my experience:
        - Developed and optimized applications using React.js and Node.js during my internship at Payworld Digital Services.
        - Worked with REST APIs, SQL databases, and designed solutions to handle real-time data and transactions.
        - Collaborated with cross-functional teams in an agile environment, contributing to both front-end and back-end development.
        
        In addition to my technical skills, I have a passion for problem-solving and continuous learning, which I believe will allow me to contribute effectively to your team.
        
        Please find my resume attached for your review. I would be thrilled to discuss how my skills and experiences can contribute to the growth and success of your organization.
        
        Best regards,
        ${firstName} ${lastName}`
    );
  }, [firstName, lastName, role]);

  useEffect(() => {
    const fullName = lastName ? `${firstName} ${lastName}` : firstName;
    setSubject(fullName && role ? `${fullName} – CV Submission for ${role} Role` : "");
  }, [firstName, lastName, role]);

  const handleResumeUpload = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !appKey || !firstName || !role || !fromSno || !toSno) {
      setStatus("⚠️ Please fill in all required fields.");
      return;
    }

    setStatus("Sending emails...");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("appKey", appKey);
    formData.append("fromSno", fromSno);
    formData.append("toSno", toSno);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("role", role);
    formData.append("subject", subject);
    formData.append("message", message);
    if (resume) formData.append("resume", resume);

    try {
      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setStatus(result.message);
    } catch (error) {
      setStatus("❌ Failed to send emails.");
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-700 via-blue-900 to-black text-white px-4">
      {/* Laser Animation */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute w-2 h-64 bg-blue-500 opacity-50 blur-lg animate-laserMove1"></div>
        <div className="absolute w-2 h-80 bg-pink-500 opacity-50 blur-lg animate-laserMove2"></div>
        <div className="absolute w-2 h-72 bg-green-400 opacity-50 blur-lg animate-laserMove3"></div>
      </div>

      <motion.div
        className="relative bg-black bg-opacity-60 backdrop-blur-md p-6 rounded-2xl shadow-2xl w-full max-w-xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold text-center mb-4">🚀 Email Sender</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* First Name & Last Name */}
          <input className="p-1.5 border rounded-md bg-gray-800 text-white" type="text" placeholder="First Name *" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <input className="p-1.5 border rounded-md bg-gray-800 text-white" type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />

          {/* Desired Role & Email */}
          <input className="p-1.5 border rounded-md bg-gray-800 text-white" type="text" placeholder="Desired Role *" value={role} onChange={(e) => setRole(e.target.value)} required />
          <input className="p-1.5 border rounded-md bg-gray-800 text-white" type="email" placeholder="Your Gmail *" value={email} onChange={(e) => setEmail(e.target.value)} required />

          {/* From SNo & To SNo */}
          <input className="p-1.5 border rounded-md bg-gray-800 text-white" type="number" placeholder="From SNo. *" value={fromSno} onChange={(e) => setFromSno(e.target.value)} required />
          <input className="p-1.5 border rounded-md bg-gray-800 text-white" type="number" placeholder="To SNo. *" value={toSno} onChange={(e) => setToSno(e.target.value)} required />
        
          <input type="password" placeholder="Gmail App Key *" value={appKey} onChange={(e) => setAppKey(e.target.value)} required className="p-1.5 border rounded-md bg-gray-800 text-whit" />
          <input type="file" onChange={handleResumeUpload} required className="p-1.5 border rounded-md bg-gray-800 text-whit" />
          

          {/* Subject (Full Width) */}
          <textarea className="p-1.5 border rounded-md bg-gray-800 text-white sm:col-span-2 h-10" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />

          {/* Message (Full Width) */}
          <textarea className="p-1.5 border rounded-md bg-gray-800 text-white sm:col-span-2 h-20" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} required />

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#34D399" }}
            className="w-full bg-gradient-to-r from-blue-500 to-green-400 text-white py-2 rounded-md font-bold sm:col-span-2 hover:shadow-xl transition-transform"
            type="submit"
          >
            📤 Send Email
          </motion.button>
        </form>

        {status && (
          <p className={`text-center mt-4 p-2 rounded-md ${status.includes("⚠️") || status.includes("❌") ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}>
            {status}
          </p>
        )}
      </motion.div>
    </div>
  );
}

export default EmailForm;
