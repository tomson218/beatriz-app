export const getNameBlock = name => {
	if (name === 'blue') return 'niebieska';
	else if (name === 'green') return 'zielona';
	else if (name === 'yellow') return 'żółta';
	else return 'czarna';
};

export const getNameTypeTicket = type => {
	if (type === 'VIP') {
		return 'VIP';
	} else if (type === 'normal') {
		return 'Normalny';
	} else if (type === 'child') {
		return 'Dziecinny';
	} else return 'Unknown';
};
