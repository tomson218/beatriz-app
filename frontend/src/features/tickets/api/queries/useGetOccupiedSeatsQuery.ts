import { useQuery } from '@tanstack/react-query';
import type { EventDto } from '@beatriz/shared/events';
import type { BlockType } from '@beatriz/shared/tickets';
import instance from '@/shared/api/apiConfig';
import { queryKeys } from '@/shared/api/queryKeys';

const useGetOccupiedSeatsQuery = (eventId: EventDto['_id'], sector: string, block: BlockType) => {
	const getOccupiedSeats = async () => {
		const uri = `/events/${eventId}/occupied-seats`;
		const response = await instance.get(uri, { params: { sector, block } });
		return response.data.data.occupiedSeats;
	};

	return useQuery({
		queryKey: queryKeys.occupiedSeats.bySector(eventId, sector, block),
		queryFn: getOccupiedSeats,
	});
};

export default useGetOccupiedSeatsQuery;
