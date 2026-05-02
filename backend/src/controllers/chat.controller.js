import { asyncHandler } from '../middlewares/asyncHandler.js';
import { chatService } from '../services/chat.service.js';

export const handleChat = asyncHandler(async (req, res) => {
  const { message, url } = req.body;
  const response = await chatService.handleChat(message, url);
  
  res.status(200).json({
    success: true,
    data: { response },
  });
});
