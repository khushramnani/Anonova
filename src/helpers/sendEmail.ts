// import { resend } from "@/lib/resend";
// import VerificationEmail from "../../emails/emailTemplate";
// import { ApiResponse } from "@/types/ApiResponse";


// export async function sendVerificationEmail(
//   username: string,
//   email: string,
//   verifyCode: string
// ): Promise<ApiResponse> {
//   try {
//     await resend.emails.send({
//       from: "onboarding@resend.dev",
//       to: email,
//       subject: "Verification Code | Anonova",
//       react: VerificationEmail({ username, otp: verifyCode }),
//     });
//     console.log("Email sent successfully" , resend.emails.send);
//     return { success: true, message: "Email Sent Succesfully!" };
//   } catch (error) {
//     console.error("error while sending email", error);
//     return { success: false, message: "failed to send verification email" };
//   }
// }
