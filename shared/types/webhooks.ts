/** @TODO: Replace `unknown` with a proper webhook payload type once the webhook payload structure is finalized. */
export type WebhookPayload = unknown;

export interface ListenWebhookRequest {
	payload: WebhookPayload;
	signature: string;
}

export interface ListenWebhookResponse {
	processed: boolean;
	message?: string;
}
