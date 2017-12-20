const router = require('koa-router')();
//路由

router.get('/activity/:id', async (ctx, next) => {
  console.log(`page ${ctx.params.id} was loaded!`);
  await ctx.render('activity/' + ctx.params.id);
});

//跳过路由 直接load view
router.get('/:id', async (ctx, next) => {
    console.log(`page ${ctx.params.id} was loaded!`);

    await ctx.render(ctx.params.id);
});
module.exports = router;
