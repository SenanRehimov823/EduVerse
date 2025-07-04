import Stripe from "stripe";
import Course from "../model/Course.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const { courseId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Kurs tapılmadı" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: req.user.email, 

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
            },
            unit_amount: Math.round(course.price * 100),
          },
          quantity: 1,
        },
      ],

      metadata: {
        courseId: course._id.toString(),  
        userId: req.user.id.toString(),   
      },

     success_url: "http://localhost:5173/payment-success",
cancel_url: "http://localhost:5173/payment-cancel",
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error("Stripe Checkout xətası:", err.message);
    res.status(500).json({ error: "Ödəniş başlatmaq olmadı" });
  }
};
