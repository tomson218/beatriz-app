import { useQuery } from '@tanstack/react-query';
import type { Event } from '@beatriz/shared/events';
import type { BlockType } from '@beatriz/shared/tickets';
import instance from '@/api/apiConfig';
import { queryKeys } from '@/api/queryKeys';

const useGetOccupiedSeatsQuery = (eventId: Event["_id"], sector: string, block: BlockType) => {
	const getOccupiedSeats = async () => {
		const uri = `/tickets/events/${eventId}/occupied-seats/${sector}/${block}`;
		const response = await instance.get(uri);
		return response.data.data.occupiedSeats;
	};

	return useQuery({
		queryKey: queryKeys.occupiedSeats.bySector(eventId, sector, block),
		queryFn: getOccupiedSeats,
	});
};

export default useGetOccupiedSeatsQuery;
