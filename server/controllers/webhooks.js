import Stripe from "stripe";
import Transaction from "../models/Transaction.js"
import User from "../models/User.js"

export const stripehooks = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const sig = req.headers["stripe-signature"]

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRPPIE_WEBHOOK_SECRET)
    } catch (error) {
        return res.status(400).send(`Webhook error: ${error.message}`)
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded":{
                const payment_intent = event.data.object;
                const sessionList = await stripe.checkout.sessions.list({
                    payment_intent: payment_intent.id,
                })
                
                const session = sessionList.data[0];
                const {transactionId, appId} = session.metadata;

                if(appId === "chadgpt"){
                    const transaction = await Transaction.findOne({_id: transactionId, isPaid: false})

                    //Update credits in User account
                    await User.updateOne({_id: transactionId.userId}, {$inc: {credits: transtion.credits}})

                    //Update credit payment status
                    transaction.isPaid = true
                    await transaction.save();
                }else{
                    return res.json({received: true, message: "Ignored event: Invalid app"})
                }
                break;
            }
            
            default:
                console.log("Unhadled event type: ", event.type)
                break;
        }
        res.json({received: true})
    } catch (error) {
        console.error("Webhook processing error:", error)
        res.status(500).send("Internal Server Error")
    }
}