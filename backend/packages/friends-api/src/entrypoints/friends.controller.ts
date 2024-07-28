import { NextFunction, Request, Response, Router } from 'express';
import * as friendService from '../services/friends.service';
import {
  authMiddleware,
  UnAuthorizedError,
  validateErrors,
} from '@svdw/common';
import { body } from 'express-validator';
import { InvalidFriendRequest } from '../errors/account-invalid-credentials.error';

const router = Router();

router.get(
  '/friends',
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnAuthorizedError();
      }
      const requests = await friendService.getFriends({
        accountId: req.user.id,
      });
      res.status(200).json(requests);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/friend-requests',
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnAuthorizedError();
      }
      const requests = await friendService.getPendingFriendRequests({
        accountId: req.user.id,
      });
      res.status(201).json(requests);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/friend-requests',
  body('friendId')
    .exists()
    .withMessage('friendId is required')
    .isUUID()
    .withMessage('Must be UUID'),
  validateErrors,
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { friendId } = req.body;

      if (!req.user) {
        throw new UnAuthorizedError();
      }

      if (friendId == req.user.id) {
        throw new InvalidFriendRequest('Trying to befriend yourself?');
      }

      await friendService.addFriendRequest({
        friendId,
        accountId: req.user.id,
      });
      res.status(201).send();
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/friend-requests',
  body('friendId').exists().isUUID(),
  validateErrors,
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { friendId } = req.body;

      if (!req.user) {
        throw new UnAuthorizedError();
      }

      await friendService.removeFriendRequest({
        friendId,
        accountId: req.user.id,
      });
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/friend-requests/accept',
  body('friendId').exists().isUUID(),
  validateErrors,
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { friendId } = req.body;

      if (!req.user) {
        throw new UnAuthorizedError();
      }

      await friendService.acceptFriendRequest({
        friendId,
        accountId: req.user.id,
      });
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/friend-requests/decline',
  body('friendId').exists().isUUID(),
  validateErrors,
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { friendId } = req.body;

      if (!req.user) {
        throw new UnAuthorizedError();
      }

      await friendService.declineFriendRequest({
        friendId,
        accountId: req.user.id,
      });
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
