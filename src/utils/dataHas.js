const dataHas = (propertyName = '', type = '') => {
    return (req, res, next) => {
        const { data = {} } = req.body
        data[propertyName] ? (
            next()
        ) : (
            next({
                status: 400, 
                message: `${type} must include a ${propertyName}`
            })
        )
    }
}

module.exports = dataHas