interface ImportMetaEnv {
  readonly RESEND_API_KEY: string;
  readonly CONTACT_FROM: string;
  readonly CONTACT_TO: string;
  readonly PUBLIC_WHATSAPP_NUMBER: string;
  readonly PUBLIC_WHATSAPP_MESSAGE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
