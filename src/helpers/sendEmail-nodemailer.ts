import nodemailer from "nodemailer";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/emailTemplate";
import { render } from "@react-email/render"; 

export async function sendVerificationEmail(
  username: string,
  email: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },

    });

    
    const htmlContent = await render(
      VerificationEmail({ username, otp: verifyCode })
    );

    const mailOptions = {
      from: `"Anonova" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verification Code | Anonova",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log("SMTP info:", info);

    // console.log("Sending email to:", email);
    // console.log("Email content:", htmlContent);
    // console.log("SMTP info:", info);


    return { success: true, message: "Email Sent Successfully!" };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
