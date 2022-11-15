const errorHander = (err, req, res, next) => {
    const errorStatus = res.statusCode ? res.statusCode : 500
    const errorMessage = err.message || "Something went wrong!";

    return res.status(errorStatus).json({
        status: errorStatus,
        message: errorMessage, 
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    })
}

module.exports = errorHander

