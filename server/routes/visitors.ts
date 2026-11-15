import express from 'express';
import { getVisitorCount, incrementVisitorCount } from '../services/visitorService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

const VISITOR_COOKIE = 'visitor_id';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 * 1000; // 1年

const visitorCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none' as const,
    maxAge: COOKIE_MAX_AGE,
};

// 現在の訪問者数を取得
router.get(
    '/',
    asyncHandler(async (_req, res) => {
        const count = await getVisitorCount();
        res.json({ count });
    })
);

// 訪問を記録（未カウントの訪問者のみ +1）
router.post(
    '/hit',
    asyncHandler(async (req, res) => {
        const alreadyCounted = Boolean(req.cookies?.[VISITOR_COOKIE]);

        if (alreadyCounted) {
            const count = await getVisitorCount();
            res.json({ count, counted: false });
            return;
        }

        const count = await incrementVisitorCount();
        res.cookie(VISITOR_COOKIE, '1', visitorCookieOptions);
        res.json({ count, counted: true });
    })
);

export { router as visitorsRouter };
