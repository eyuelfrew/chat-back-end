import nodemailer from "nodemailer";
const sendMail = async (email, link) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    let info = await transporter.sendMail(
      {
        from: "eyumanfrew@gmail.com",
        to: email,
        subject: "Email Verification !",
        text: "Welcome, please verifiy your email to continue!",
        html: `<>
                <a href=${link}>Click Here To Confirm Your Account</a>
            </>`,
      },
      (error, info) => {
        if (error) {
          console.error("Error:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      }
    );
    return info;
  } catch (error) {
    return error.message;
  }
};
export default sendMail;
