import formData from "form-data";
import Mailgun from "mailgun.js";

export const email = {
  send: async (to, id, link) => {
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY,
    });

    mg.messages
      .create(process.env.MAILGUN_DOMAIN, {
        from: `Jonathan <noreplyn@${process.env.MAILGUN_DOMAIN}>`,
        to: [to],
        subject: "You've been invited to collaborate",
        text: "Testing some Mailgun awesomeness!",
        html: `
        <h1>Invite to collaborate!</h1>
        <p>If you already have an account <a href="${link}/user/login/collaboration/${id}">login</a> here!</p>
        <p>Otherwise you can <a href="${link}/user/create/collaboration/${id}">signup</a> here!</p>
        `,
      })
      .then((msg) => console.log(msg))
      .catch((err) => console.log(err));
  },
};
