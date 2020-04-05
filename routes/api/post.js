const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const Post = require("../../modules/Post");
const Profile = require("../../modules/Profile");
const validatePost = require("../../validation/post");
const router = express.Router();

router.get("/test", (req, res) => res.json({ msg: "Posts works" }));

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ noPostFound: "No post found" }));
});

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ noPostFound: "No post found" }));
});

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePost(req.body);
    if (!isValid) return res.status(400).json(errors);

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.user.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (Post.user.toString() != req.user.id) {
            return res
              .status(401)
              .json({ noAuthorized: "User not authorized" });
          }

          Post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postNotFound: "Post not found" }));
    });
  }
);

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyLiked: "User has already liked this post" });
          }

          post.likes.unshift({ user: req.user.id });
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postNotFound: "Post not found" }));
    });
  }
);

router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            (post.likes.filter(
              like => like.user.toString() === req.user.id
            ).length = 0)
          ) {
            return res
              .status(400)
              .json({ notLiked: "You have not liked post yet" });
          }

          const removeLikeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          post.likes.spice(removeLikeIndex, 1);
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postNotFound: "Post not found" }));
    });
  }
);

router.post(
  "/post/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePost(req.body);
    if (!isValid) return res.status(400).json(errors);

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        post.comments.unshift(newComment);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postNotFound: "Post not found" }));
  }
);

router.delete(
  "/post/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePost(req.body);
    if (!isValid) return res.status(400).json(errors);

    Post.findById(req.params.id)
      .then(post => {
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res.status(404).json({ commentNotFound: "Comment not found" });
        }

        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        post.comments.splice(removeIndex, 1);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postNotFound: "Post not found" }));
  }
);

module.exports = router;
