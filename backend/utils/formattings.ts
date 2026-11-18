const BLOCK_NAMES: Record<string, string> = { blue: 'niebieska', green: 'zielona', yellow: 'żółta' };
const TICKET_TYPE_NAMES: Record<string, string> = { VIP: 'VIP', normal: 'Normalny', child: 'Dziecinny' };

export const getNameBlock = (name?: string | null): string => BLOCK_NAMES[name ?? ''] ?? 'czarna';

export const getNameTypeTicket = (type?: string | null): string => TICKET_TYPE_NAMES[type ?? ''] ?? 'Unknown';
