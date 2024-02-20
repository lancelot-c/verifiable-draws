import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(request: Request) {

    const body = await request.json()
    const firstName: string = body.firstName
    const lastName: string = body.lastName
    const company: string = body.company
    const email: string = body.email
    const phone: string = body.phone
    const message: string = body.message
    let errorMessage = '';

    if (!process.env.COMPANY_EMAIL) {
        errorMessage = 'COMPANY_EMAIL is undefined'

    } else if (!firstName || !lastName || !email || !message) {

        errorMessage = 'First name, last name, email, & message are required.';

    } else {

        const to = process.env.COMPANY_EMAIL;
        const fromEmail = process.env.COMPANY_EMAIL;
        const subject: string = `${firstName} ${lastName} contacted you`

        const content = `<b>First name:</b> ${firstName}<br />
        <b>Last name:</b> ${lastName}<br />
        <b>Company:</b> ${company}<br />
        <b>Email:</b> ${email}<br />
        <b>Phone:</b> ${phone}<br /><br />

        <b>Message:</b><br />
        ${message}`

        const msg = {
            to,
            from: {
                name: 'Contact Form',
                email: fromEmail
            },
            subject,
            text: content,
            html: content,
        };

        try {
            await sgMail.send(msg);
            console.log('Email sent successfully');
        } catch (error: any) {
            errorMessage = error.response.body.errors[0].message;
            console.error('Error sending email', error.response.body.errors);
        }

    }
    
    const data = {
        errorMessage
    }

    return NextResponse.json(data, {
        status: errorMessage ? 500 : 200
    });
}