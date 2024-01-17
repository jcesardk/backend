// import { transporter } from '../../main';
import * as process from "process";
import * as handlebars from 'handlebars';
import {transporter} from "../../main";
import * as path from "path";
import * as fs from "fs";

export const sendMail = async (emailDestinatario: string, assunto: string, template: string, context: any, attachments?: any) => {
  let arquivos = [{
    cid: 'logo'
  }];
  if (attachments) {
    arquivos.push(attachments);
  }
  const templatePath = path.join(__dirname, '../../templates/', `${template}.hbs`);
  const templateContent = fs.readFileSync(templatePath, 'utf8');
  const templateHtml = handlebars.compile(templateContent)(context);

  try {
    const mail = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: emailDestinatario,
      subject: assunto,
      html: templateHtml,
      attachments: arquivos
    });
    console.log(`[INFO] E-mail ${template} enviado com sucesso`);
    return mail;
  } catch (e) {
    console.log(`[ERRO] Erro ao enviar o e-mail ${template} `);
  }
}
