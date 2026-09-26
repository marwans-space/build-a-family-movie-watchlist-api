import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { addMovie, deleteMovie, findById, getWatchlist, updateMovie } from '../utils/db.js';
import { authorizeModification } from '../middleware/authorize.js';

const router = express.Router();
export default router;

router.use(authenticate);

router.get('/:userId', (req, res, next) => {
    const userId = Number(req.params.userId);
    const watchlist = getWatchlist(userId);
    return res.status(200).json(watchlist);
});

router.post('/:userId/movies', authorizeModification, (req, res, next) => {
    const userId = Number(req.params.userId);
    const movie = { ...req.body };

    if (req.user.role === 'parent') {
        addMovie(userId, movie);
        return res.status(201).json({ message: "Created successfully" });
    }

    if (userId !== Number(req.user.id)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    addMovie(userId, movie);
    return res.status(201).json({ message: "Created successfully" });
});

router.put('/:userId/movies/:movieId', authorizeModification, (req, res, next) => {
    const userId = Number(req.params.userId);
    const movieId = Number(req.params.movieId);
    const updates = { ...req.body };

    if (req.user.role === 'parent') {
        updateMovie(userId, movieId, updates);
        return res.status(200).json({ message: "OK" });
    }

    if (userId !== Number(req.user.id)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    updateMovie(userId, movieId, updates);
    return res.status(200).json({ message: 'OK' });
});

router.delete('/:userId/movies/:movieId', authorizeModification, (req, res, next) => {
    const userId = Number(req.params.userId);
    const movieId = Number(req.params.movieId);

    if (req.user.role === 'parent') {
        deleteMovie(userId, movieId);
        return res.status(200).json({ message: 'OK' });
    }

    if (userId !== Number(req.user.id)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    deleteMovie(userId, movieId);
    return res.status(200).json({ message: 'OK' });
});