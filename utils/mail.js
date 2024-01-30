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

// https://testcaseonly.onrender.com/user/confirm/6311c021dfbc7495ef5acaf0cfed1fd3a07536fb4bd17386a473a04a128cfb2974bd5ccb08d28d0126ae23eb88df55bd95028956edc42e94711e746342aa239f
