import nodemailer from 'nodemailer';
import EmailTemplates from "swig-email-templates";
import path from 'path';

import { User } from "../models/User";
import getEmailConfig from "../config/email";
import { getToken } from "../auth/token.helper";

export class EmailService {
    private transporter: nodemailer.Transporter;
    private templates: EmailTemplates;
    private readonly config: Object;

    constructor() {
        this.config = getEmailConfig();
        this.transporter = nodemailer.createTransport(this.config);

        this.templates = new EmailTemplates({
            root: path.resolve(__dirname + '/../templates')
        });
    }

    private async sendEmail(emailTo:string, template: string, data: Object) {
        const self = this;

        this.templates.render(template +'/index.html', data, function(err, html, text, subject) {
            self.transporter.sendMail({
                to: emailTo,
                subject: subject,
                html: html,
                text: text,
                attachments: [{
                    filename: 'logo.png',
                    path: __dirname +'/../templates/images/logo.png',
                    cid: 'logo@cid'
                }]
            }, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        })
    }

    async sendConfirmationEmail(user: User) {
        const url = `${process.env.FRONTEND_URL}/confirmation/${getToken({user, expires: '7d'})}`;

        await this.sendEmail(user.email, 'confirmation', {
            'user': user,
            'url': url,
            'baseUrl': process.env.FRONTEND_URL
        });
    }

    async sendPasswordEmail(user: User) {
        const url = `${process.env.FRONTEND_URL}/password/${getToken({user, expires: '7d'})}`;

        await this.sendEmail(user.email, 'password', {
            'user': user,
            'url': url,
            'baseUrl': process.env.FRONTEND_URL
        });
    }
}

