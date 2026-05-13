interface ImportMetaEnv {
  readonly RESEND_API_KEY: string;
  readonly PUBLIC_WHATSAPP_NUMBER: string;
  readonly PUBLIC_WHATSAPP_MESSAGE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
