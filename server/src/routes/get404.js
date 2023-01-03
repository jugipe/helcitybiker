const get404 = async (req, res) => {
    res.status(404).send("Page not found");
};

module.exports = get404;