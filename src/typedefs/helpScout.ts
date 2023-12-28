export interface ReplyThreadPayload {
  text: string; // The reply
  draft?: boolean; // If set to true, a draft reply is created
  customer: { id: number }; // Customer being replied to
  imported?: boolean; // The imported field enables thread to be created for historical purposes
  // (i.e., if moving from a different platform, you can import your history).
  // When imported is set to true, no outgoing emails or notifications will be generated.
  status?: string; // Use this field to change conversation status when adding a thread. If not explicitly set,
  // a reply thread will reactivate the conversation. Valid statuses: active, all, closed, open, pending, spam
  user?: number; // ID of the user who is adding the thread. The resource owner is the default when not set.
  cc?: string[]; // Collection of strings representing email addresses.
  bcc?: string[]; // Collection of strings representing email addresses.
  createdAt?: string; // Optional creation date to be used when importing conversations and threads.
  // It can only be used with the imported field set to true
  attachments?: Attachment[]; // Optional list of attachments to be attached to this thread
}

export interface Attachment {
  fileName: string; // Attachment’s file name
  mimeType: string; // Attachment’s mime type
  data: string; // Base64-encoded stream of data
}
