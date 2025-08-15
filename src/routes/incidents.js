import { Router } from 'express';
import { authRequired } from '../middlewares/authMiddleware.js';
import { allowRoles } from '../middlewares/roleMiddleware.js';
import { createIncident, updateIncidentStatus, listIncidents } from '../Controllers/incidentController.js';

const router = Router();

router.get('/', authRequired, listIncidents);
router.post('/', authRequired, allowRoles('CAPTAIN','CHIEF_MATE','CHIEF_ENGINEER','SECOND_ENGINEER','SHIP_CREW','SAFETY_OFFICER'), createIncident);
router.patch('/:id/status', authRequired, allowRoles('COMPANY_ADMIN','CAPTAIN','SAFETY_OFFICER','OPERATIONS_MANAGER'), updateIncidentStatus);

export default router;
