// Dependencies
import { Router } from 'express';

// Utils
import adminRequestHandler from '../../utils/admin-api';

const router = Router();
router.use('*', adminRequestHandler);

export default router;
