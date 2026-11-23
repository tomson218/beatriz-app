import { describe, expect, it, vi } from 'vitest';
import mongoose from 'mongoose';
import UserModel from '../../../../modules/users/users.model.ts';
import { mockQuery } from '../../../helpers/mockQuery.ts';
import { catchAsyncError } from '../../../helpers/catchError.ts';
import {
	addFavouriteEvent,
	deactivateAccount,
	deleteUserById,
	findAllUsers,
	findFavouriteEvents,
	findUserById,
	removeFavouriteEvent,
	saveCart,
	updateOwnProfile,
	updateUserByAdmin,
} from '../../../../modules/users/users.service.ts';

vi.mock('../../../../modules/users/users.model.ts', () => ({
	default: { find: vi.fn(), findById: vi.fn(), findByIdAndUpdate: vi.fn(), findByIdAndDelete: vi.fn() },
}));

const User = vi.mocked(UserModel);

const EVENT_ID = 'a'.repeat(24);
const OTHER_EVENT_ID = 'b'.repeat(24);
const noUserWithId = { statusCode: 404, message: 'No user found with that ID' };
const userNotFound = { statusCode: 404, message: 'User not found.' };

const userWithFavourites = (ids: string[]) => ({
	favouriteEventIds: ids.map(id => new mongoose.Types.ObjectId(id)),
	save: vi.fn(),
});

const profileChanges = { username: 'jan', email: 'jan@x.pl', firstName: 'Jan', lastName: 'K', role: 'admin', password: 'x' };

describe('findAllUsers / findUserById', () => {
	it('returns all users', async () => {
		User.find.mockResolvedValue(['u1'] as never);

		const result = await findAllUsers();
		const expected = ['u1'];

		expect(result).toEqual(expected);
	});

	it('returns the user by id', async () => {
		User.findById.mockResolvedValue({ _id: 'u1' } as never);

		const result = await findUserById('u1');
		const expected = { _id: 'u1' };

		expect(result).toEqual(expected);
	});

	it('throws 404 when the user does not exist', async () => {
		User.findById.mockResolvedValue(null);

		const result = await catchAsyncError(findUserById('missing'));
		const expected = noUserWithId;

		expect(result).toMatchObject(expected);
	});
});

describe('updateOwnProfile', () => {
	it('returns the updated user', async () => {
		User.findByIdAndUpdate.mockResolvedValue({ _id: 'u1' } as never);

		const result = await updateOwnProfile('u1', profileChanges as never);
		const expected = { _id: 'u1' };

		expect(result).toEqual(expected);
	});

	it('updates only profile fields (no password or role) with validation', async () => {
		User.findByIdAndUpdate.mockResolvedValue({ _id: 'u1' } as never);

		await updateOwnProfile('u1', profileChanges as never);
		const expected = { username: 'jan', email: 'jan@x.pl', firstName: 'Jan', lastName: 'K' };

		expect(User.findByIdAndUpdate).toHaveBeenCalledWith('u1', expected, { new: true, runValidators: true });
	});

	it('throws 404 when the user does not exist', async () => {
		User.findByIdAndUpdate.mockResolvedValue(null);

		const result = await catchAsyncError(updateOwnProfile('missing', {} as never));
		const expected = noUserWithId;

		expect(result).toMatchObject(expected);
	});
});

describe('updateUserByAdmin', () => {
	it('lets the admin change the role but not the password', async () => {
		User.findByIdAndUpdate.mockResolvedValue({ _id: 'u1' } as never);

		await updateUserByAdmin('u1', profileChanges as never);
		const expected = { username: 'jan', email: 'jan@x.pl', firstName: 'Jan', lastName: 'K', role: 'admin' };

		expect(User.findByIdAndUpdate).toHaveBeenCalledWith('u1', expected, { new: true, runValidators: true });
	});

	it('throws 404 when the user does not exist', async () => {
		User.findByIdAndUpdate.mockResolvedValue(null);

		const result = await catchAsyncError(updateUserByAdmin('missing', {} as never));
		const expected = noUserWithId;

		expect(result).toMatchObject(expected);
	});
});

describe('deactivateAccount / deleteUserById', () => {
	it('deactivates the account instead of deleting it', async () => {
		await deactivateAccount('u1');
		const expected = { active: false };

		expect(User.findByIdAndUpdate).toHaveBeenCalledWith('u1', expected);
	});

	it('deletes the user', async () => {
		User.findByIdAndDelete.mockResolvedValue({ _id: 'u1' } as never);

		const result = await deleteUserById('u1');

		expect(result).toBeUndefined();
		expect(User.findByIdAndDelete).toHaveBeenCalledWith('u1');
	});

	it('throws 404 when deleting a user that does not exist', async () => {
		User.findByIdAndDelete.mockResolvedValue(null);

		const result = await catchAsyncError(deleteUserById('missing'));
		const expected = noUserWithId;

		expect(result).toMatchObject(expected);
	});
});

describe('findFavouriteEvents', () => {
	it('returns the populated favourite events', async () => {
		const query = mockQuery({ favouriteEvents: [{ name: 'Koncert' }] });
		User.findById.mockReturnValue(query as never);

		const result = await findFavouriteEvents('u1');
		const expected = [{ name: 'Koncert' }];

		expect(result).toEqual(expected);
		expect(query.populate).toHaveBeenCalledWith('favouriteEvents');
	});

	it('throws 404 when the user does not exist', async () => {
		User.findById.mockReturnValue(mockQuery(null) as never);

		const result = await catchAsyncError(findFavouriteEvents('missing'));
		const expected = userNotFound;

		expect(result).toMatchObject(expected);
	});
});

describe('addFavouriteEvent', () => {
	it('adds the event to favourites', async () => {
		const user = userWithFavourites([OTHER_EVENT_ID]);
		User.findById.mockResolvedValue(user as never);

		await addFavouriteEvent('u1', EVENT_ID);
		const result = user.favouriteEventIds.map(String);
		const expected = [OTHER_EVENT_ID, EVENT_ID];

		expect(result).toEqual(expected);
		expect(user.save).toHaveBeenCalledWith({ validateBeforeSave: false });
	});

	it('throws 409 when the event is already a favourite', async () => {
		const user = userWithFavourites([EVENT_ID]);
		User.findById.mockResolvedValue(user as never);

		const result = await catchAsyncError(addFavouriteEvent('u1', EVENT_ID));
		const expected = { statusCode: 409, message: 'This event is on your list of favourites.' };

		expect(result).toMatchObject(expected);
		expect(user.save).not.toHaveBeenCalled();
	});

	it('throws for an invalid event id', async () => {
		User.findById.mockResolvedValue(userWithFavourites([]) as never);

		const result = await catchAsyncError(addFavouriteEvent('u1', 'not-an-id'));
		const expected = { name: 'BSONError' };

		expect(result).toMatchObject(expected);
	});

	it('throws 404 when the user does not exist', async () => {
		User.findById.mockResolvedValue(null);

		const result = await catchAsyncError(addFavouriteEvent('missing', EVENT_ID));
		const expected = userNotFound;

		expect(result).toMatchObject(expected);
	});
});

describe('removeFavouriteEvent', () => {
	it('removes the event from favourites', async () => {
		const user = userWithFavourites([EVENT_ID, OTHER_EVENT_ID]);
		User.findById.mockResolvedValue(user as never);

		await removeFavouriteEvent('u1', EVENT_ID);
		const result = user.favouriteEventIds.map(String);
		const expected = [OTHER_EVENT_ID];

		expect(result).toEqual(expected);
		expect(user.save).toHaveBeenCalledWith({ validateBeforeSave: false });
	});

	it('throws 404 when the event is not a favourite', async () => {
		const user = userWithFavourites([OTHER_EVENT_ID]);
		User.findById.mockResolvedValue(user as never);

		const result = await catchAsyncError(removeFavouriteEvent('u1', EVENT_ID));
		const expected = { statusCode: 404, message: 'This event is not on your list of favourites.' };

		expect(result).toMatchObject(expected);
		expect(user.save).not.toHaveBeenCalled();
	});
});

describe('saveCart', () => {
	it('saves the client cart with validation', async () => {
		const cart = [{ eventId: EVENT_ID }] as never;

		await saveCart('u1', cart);
		const expected = { cart };

		expect(User.findByIdAndUpdate).toHaveBeenCalledWith('u1', expected, { new: true, runValidators: true });
	});
});
