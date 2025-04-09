import { Router } from 'express';
import { GenreController } from '../controllers/genresController';

const router = Router();

router.get('/', GenreController.getAllGenres);
router.post('/', GenreController.addGenre);
router.put('/:id', GenreController.updateGenre);
router.delete('/:id', GenreController.deleteGenre);
router.get('/search', GenreController.searchGenres);
router.get('/:genreName/movies', GenreController.getMoviesByGenre);

export default router;