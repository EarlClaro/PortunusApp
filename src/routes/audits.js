import { Router } from 'express';
import { authRequired } from '../middlewares/authMiddleware.js';
import { allowRoles } from '../middlewares/roleMiddleware.js';
import { createTemplate, listTemplates, startAudit, submitAudit, listAudits } from '../Controllers/auditController.js';

const router = Router();

router.get('/templates', authRequired, listTemplates);
router.post('/templates', authRequired, allowRoles('COMPANY_ADMIN','HR_ADMIN','COMPANY_REP','FLEET_SUPERINTENDENT','OPERATIONS_MANAGER'), createTemplate);

router.get('/', authRequired, listAudits);
router.post('/start', authRequired, allowRoles('CAPTAIN','CHIEF_MATE','CHIEF_ENGINEER','SAFETY_OFFICER'), startAudit);
router.post('/:id/submit', authRequired, submitAudit);

export default router;
