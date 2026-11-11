export interface DiscountCode {
	_id: string;
	code: string;
	value: number;
	expiration: string;
	usageLimit: number;
	usageConditions: number;
}
