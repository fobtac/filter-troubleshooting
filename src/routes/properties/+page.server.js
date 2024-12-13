import { GOOGLE_EMAIL } from "$env/static/private";
import transporter from "$lib/functions/emailSetup.server.js";
import { error } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { browser } from "$app/environment";




async function handlePost() {
    try {
        const formData = await request.formData();
        const userEmail = formData.get('userEmail');
        const listing = formData.get('listing')

        let html = `${listing}`;

        const message = {
            from: GOOGLE_EMAIL,
            to: userEmail,
            subject: 'Listing Results',
            html: html,
        };

        const sendEmail = async (message) => {
            await new Promise((resolve, reject) => {
                transporter.sendMail(message, (err, info) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        resolve(info);
                    }
                });
            });
        };

        await sendEmail(message);

        return {
                success: "Email sent!",
            };
    } catch (error) {
        console.error(error);
        return {
            error: "An error occurred while processing your request."
        };
    }
}

export const actions = {
    default: async ({ request }) => {
        return await handlePost(request);
    },
};