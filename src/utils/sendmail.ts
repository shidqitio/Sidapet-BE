import nodemailer from "nodemailer";

export const sendMail=async(to:string,subject:string,bodymail:string)=>{
  try{
   let transporter = nodemailer.createTransport({
     sendmail: true, // Gunakan sendmail
     newline: "unix", // Ganti baris menggunakan UNIX newline
     path: "/usr/sbin/sendmail",
   });
   let mailOptions = {
     from: "hallo.pmo.ut@gmail.com", // Ganti dengan alamat email Anda
     to: to, // Ganti dengan alamat email penerima
     subject: subject,
     text: bodymail,
   };
   const res = await transporter.sendMail(mailOptions);
   return res;
  }catch(err){
   throw err;
  }
}