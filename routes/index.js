var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Movie = require('../models/movie');
var _ = require('underscore')
mongoose.connect('mongodb://localhost/imooc')
/* GET home page. */
router.get('/', function(req, res, next) {
    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err)
        }
        res.render('index', {
            title: '首页',
            movies: movies
        });
    })
});

router.get('/movie/:id', function(req, res, next) {
    var id = req.params.id;
    Movie.findById(id, function(err, movie) {
        console.log(movie);
        res.render('detail', {
            title: '详情',
            movie: movie
        });
    })

});

router.get('/admin/movie', function(req, res, next) {
    res.render('admin', {
        title: 'admin',
        movie: {
            doctor: '',
            country: '',
            title: '',
            year: '',
            poster: '',
            language: '',
            flash: '',
            summary: ''
        }
    });
});

router.get('/admin/update/:id', function(req,res) {
    var id = req.params.id
    if (id) {
        Movie.findById(id, function(err, movie) {
            res.render('admin', {
                title: 'immoc 后台更新',
                movie: movie
            })
        })
    }
})

router.post('/admin/movie/new', function(req, res) {
    var id = req.body._id
    var movieObj = req.body
    var _movie
    if (id !== 'undefined') {
        Movie.findById(id, function(err, movie) {
            if (err) {
                console.log(err)
            }

            _movie = _.extend(movie, movieObj)
            _movie.save(function(err, movie) {
                if (err) {
                    console.log(err)
                }

                res.redirect('/movie/' + movie._id)
            })
        })
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        })

        _movie.save(function(err,movie) {
            if (err) {
                console.log(err)
            }

            res.redirect('/movie/' + movie._id)
        })
    }
})

router.get('/admin/list', function(req, res, next) {
    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err)
        }
        res.render('list', {
            title: 'list',
            movies: movies
        });
    })
});

router.delete('/admin/list', function(req, res){
    var id = req.query.id
    if (id) {
        Movie.remove({_id:id}, function(err, movie) {
            if (err) {
                console.log(err)
            } else {
                res.json({success:1})
            }
        })
    }
})

module.exports = router;
