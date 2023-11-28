const urlRouter = require("express").Router();
const url = require("../models/urlSchema");
const { nanoid } = require("nanoid");
const config = require("../utils/config");

urlRouter.post("/short", async (req, res) => {
  const { origUrl } = req.body;
  const urlId = nanoid(8);
  try {
    let Url = await url.findOne({ origUrl });
    if (Url) {
      res.json(Url);
    } else {
      const shortUrl = `${config.BASE}/${urlId}`;

      Url = new url({
        origUrl,
        shortUrl,
        urlId,
        date: new Date(),
      });

      await Url.save();
      res.json(Url);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});

urlRouter.get("/:urlId", async (req, res) => {
  try {
    const Url = await url.findOne({ urlId: req.params.urlId });
    if (Url) {
      await url.updateOne(
        {
          urlId: req.params.urlId,
        },
        { $inc: { clicks: 1 } }
      );
      return res.redirect(Url.origUrl);
    } else res.status(404).json("Not found");
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});

module.exports = urlRouter;
