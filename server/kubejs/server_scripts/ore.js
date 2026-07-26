// 1.20 起，概率产出改用 coeutil.processingOutput(<物品>, <概率0-1>)

ServerEvents.recipes(event => {
    
    // ========== 铂矿脉 ==========
    // .placement(间距, 分离度, 盐值)
    // 三个值都相同时，后注册的矿脉会覆盖前者
    // 参考钻石矿脉的稀疏度设置
    event.recipes.createoreexcavation.vein(
        '{"text": "铂矿脉"}',
        'createpropulsion:raw_platinum'
    )
        .placement(256, 64, 2078084125)
        .biomeWhitelist('minecraft:is_overworld')
        .id("kubejs:platinum_vein");

    // 钻探配方（物品）
    // 参数：产物物品，矿脉 ID，32 RPM 下的提取时间（tick）
    // 铂矿偏稀有，提取时间稍长
    event.recipes.createoreexcavation.drilling(
        'createpropulsion:raw_platinum',
        'kubejs:platinum_vein',
        600
    )
        .id("kubejs:platinum_drilling");

});

// 将新钻头物品添加到 #createoreexcavation:drills 物品标签
// 钻头纹理放在 assets/<物品modid>/textures/entity/drill/<物品名>.png
// 参考 assets/createoreexcavation/textures/entity/drill/drill.png
