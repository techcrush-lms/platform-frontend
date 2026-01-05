import Joi from 'joi';
import { ChatReadStatus } from '../utils';

export interface RetrieveChatsProps {
  token: string;
  status?: ChatReadStatus;
  q?: string;
}

export interface RetrieveGroupChatsProps {
  token: string;
  q?: string;
  page?: number;
}

export interface RetrieveMessagesProps {
  token: string;
  chatBuddy?: string;
  page?: number;
  chatGroup?: string;
}

export interface SendMessageProps {
  token: string;
  chatBuddy?: string;
  chatGroup?: string;
  message?: string;
  file?: string;
}

export interface CreateGroupChatProps {
  token: string;
  name: string;
  description?: string;
  multimedia_id: string;
  members: { member_id: string }[];
}

export interface LeaveGroupChatProps {
  token: string;
  group_id: string;
}

export interface UpdateGroupChatProps {
  group_id: string;
  token: string;
  name?: string;
  description?: string;
  multimedia_id?: string;
  members: { member_id: string }[];
}

export const retrieveChatsSchema = Joi.object<RetrieveChatsProps>({
  token: Joi.string().required(),
  status: Joi.string()
    .valid(...Object.values(ChatReadStatus))
    .optional(),
  q: Joi.string().optional(),
});

export const retrieveChatGroupsSchema = Joi.object<RetrieveGroupChatsProps>({
  token: Joi.string().required(),
  q: Joi.string().optional(),
  page: Joi.number().optional(),
});

export const retrieveMessagesSchema = Joi.object<RetrieveMessagesProps>({
  token: Joi.string().required(),
  chatBuddy: Joi.string().optional(),
  chatGroup: Joi.string().optional(),
  page: Joi.number().optional(),
});

export const sendMessageSchema = Joi.object<SendMessageProps>({
  token: Joi.string().required(),
  chatBuddy: Joi.string().optional(),
  chatGroup: Joi.string().optional(),
  message: Joi.string().min(1).max(1000).optional(),
  file: Joi.string().optional(),
});

export const createGroupChatSchema = Joi.object<CreateGroupChatProps>({
  token: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().optional(),
  multimedia_id: Joi.string().optional(),
  members: Joi.array()
    .items(
      Joi.object({
        member_id: Joi.string().required(),
      })
    )
    .optional(),
});

export const leaveGroupChatSchema = Joi.object<LeaveGroupChatProps>({
  token: Joi.string().required(),
  group_id: Joi.string().required(),
});

export const updateGroupChatSchema = Joi.object<UpdateGroupChatProps>({
  group_id: Joi.string().required(),
  token: Joi.string().required(),
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  multimedia_id: Joi.string().optional(),
  members: Joi.array()
    .items(
      Joi.object({
        member_id: Joi.string().required(),
      })
    )
    .optional(),
});

export interface CreateChatProps {
  initiator: string;
  chatBuddy: string;
}
