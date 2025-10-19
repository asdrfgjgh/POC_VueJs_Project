import { Router, Request, Response } from 'express';
import { getAllModules, getAllModulesForAnalytics } from '../application/module.service';
import { getFilterOptions } from '../application/module.service';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const level = req.query.level as string || '';
    const location = req.query.location as string || '';
    const studycredit = req.query.studycredit ? parseInt(req.query.studycredit as string) : undefined;


    // Lees tags uit de query, split ze op komma en filter lege strings
    let tags: string[] = [];
    if (typeof req.query.tags === 'string' && req.query.tags) {
      tags = req.query.tags.split(',').filter(tag => tag);
    }

    const { modules, total } = await getAllModules(page, limit, tags, level, location, studycredit);

    res.json({
      modules,
      total,
      page,
      limit,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/all-for-analytics', async (req: Request, res: Response) => {
  try {
    const modules = await getAllModulesForAnalytics();
    res.json(modules);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/filters', async (req: Request, res: Response) => {
  try {
    const filters = await getFilterOptions();
    res.json(filters);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});


export default router;