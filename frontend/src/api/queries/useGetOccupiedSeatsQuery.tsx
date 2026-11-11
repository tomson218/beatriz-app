import { useQuery } from '@tanstack/react-query';
import instance, { API_URL } from '../apiConfig';

const useGetOccupiedSeatsQuery = (eventId: string, sector: string, block: string) => {
	const getOccupiedSeats = async () => {
		const uri = `${API_URL}/tickets/occupiedSeats/${eventId}/${sector}/${block}`;
		const response = await instance.get(uri);
		return response.data.occupiedSeats;
	};

	return useQuery({
		queryKey: [`occupied-seats${eventId}-${sector}`],
		queryFn: getOccupiedSeats,
	});
};

export default useGetOccupiedSeatsQuery;
