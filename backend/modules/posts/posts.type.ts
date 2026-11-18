// Kontrakt API współdzielony z frontendem: encje, DTO, requesty i response'y.
export type {
	AddNewPostToForumRequest,
	AddNewPostToForumResponse,
	ForumMessageParams,
	ForumPost,
	ForumPostDto,
	ForumPostRequest,
	GetAllForumPostsResponse,
} from '@beatriz/shared/forums';

export interface PostsByEventParams {
	eventId: string;
}
