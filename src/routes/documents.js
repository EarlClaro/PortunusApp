import { Router } from 'express';
import { authRequired } from '../middlewares/authMiddleware.js';
import { allowRoles } from '../middlewares/roleMiddleware.js';
import {
  createDocument,
  listDocuments,
  reuploadVersion,
  updateDocumentMeta,
  uploadMiddleware
} from '../Controllers/documentController.js';

const router = Router();

router.get('/', authRequired, listDocuments);
router.post('/',
  authRequired,
  allowRoles('COMPANY_ADMIN','HR_ADMIN','CAPTAIN','CHIEF_MATE','CHIEF_ENGINEER','SECOND_ENGINEER','SHIP_CREW','SAFETY_OFFICER','COMPANY_EMPLOYEE'),
  uploadMiddleware,
  createDocument
);
router.post('/:id/version',
  authRequired,
  allowRoles('COMPANY_ADMIN','HR_ADMIN','CAPTAIN','CHIEF_MATE','CHIEF_ENGINEER','SECOND_ENGINEER','SHIP_CREW','SAFETY_OFFICER','COMPANY_EMPLOYEE'),
  uploadMiddleware,
  reuploadVersion
);
router.put('/:id', authRequired, updateDocumentMeta);

export default router;
