const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        JWT.verify(token, process.env.TOKEN_SECRET, (err, tokenUser) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.UserData = tokenUser
        });
        next();

    } else {
        res.sendStatus(401);
    }
};