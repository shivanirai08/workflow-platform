import { Router } from 'express' ;
import { createOrganization, getOrganization, updateOrganization, deleteOrganization } from './org.controller';
import { authenticate } from '../../middleware/auth.middleware';


const router = Router();

router.post('/', authenticate, createOrganization);
router.get('/:id', authenticate, getOrganization);
router.put('/:id', authenticate, updateOrganization);
router.delete('/:id', authenticate, deleteOrganization);

export default router;