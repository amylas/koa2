const router = require('koa-router')();

router.get('/:page', async (ctx, next) => {
    await ctx.render('../webapp/'+ ctx.params.page);
});

module.exports = router;
