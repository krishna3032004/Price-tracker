import Product from "@/models/Product"; // apna model ka path do
import connectDB from "@/db/connectDB";
import nodemailer from "nodemailer"

export async function POST(req) {
  try {
    const { productId, name, email } = await req.json();
    await connectDB()

    if (!productId || !name || !email) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);

    if (!product) {
      return new Response(
        JSON.stringify({ error:"Sorry, the product you’re looking for doesn’t exist."}),
        { status: 404 }
      );
    }

    // Check if email already exists in notify array
    const alreadyNotified = product.notify.some(
      (n) => n.email.toLowerCase() === email.toLowerCase()
    );

    if (alreadyNotified) {
      return new Response(
        JSON.stringify({ message: "You’ve already subscribed for updates. We’ll notify you as soon as this product price drops!"}),
        { status: 200 }
      );
    }

    // Push new notification
    product.notify.push({ name, email });
    await product.save();


     // Send Email Notification Confirmation
     const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
      });
  
      await transporter.sendMail({
        from: `"Product Updates" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "You’re on the list! 🎉",
        html: `
          <p>Hey ${name},</p>
          <p>Thanks for showing interest in <strong>${product.title}</strong>!</p>
          <p>You’re now on our exclusive notification list. We’ll make sure you’re the first to know as soon as the drop goes live. ⏳🔥</p>
          <p>Stay tuned,<br> The Team</p>
        `
      });
  

    return new Response(
      JSON.stringify({ message: "You’re all set! We’ll send you a notification as soon as this product price drops." }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
}
