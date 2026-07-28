// 自定义 biome tag：合并主世界+暮色森林 / 下界+暮色森林
ServerEvents.tags('worldgen/biome', event => {
    event.add('kubejs:ore_vein_overworld_tf', ['#minecraft:is_overworld', '#twilightforest:in_twilight_forest']);
    event.add('kubejs:ore_vein_nether_tf', ['#minecraft:is_nether', '#twilightforest:in_twilight_forest']);
});

// 矿脉合集
// placement 三值与 ore_vein_type/ 一致 → 覆盖原版 JSON
// biomeWhitelist 使用自定义 tag 实现多维度生成
ServerEvents.recipes(event => {

    // ========== 煤矿脉（主世界 + TF） ==========
    event.recipes.createoreexcavation.vein('{"text": "煤矿脉"}', 'minecraft:coal')
        .placement(128, 8, 1042639205).biomeWhitelist('kubejs:ore_vein_overworld_tf')
        .id("kubejs:coal_vein");
    event.recipes.createoreexcavation.drilling('minecraft:coal', 'kubejs:coal_vein', 200)
        .stress(256).id("kubejs:coal_drilling");

    // ========== 铁矿脉（主世界 + TF） ==========
    event.recipes.createoreexcavation.vein('{"text": "铁矿脉"}', 'minecraft:raw_iron')
        .placement(128, 8, 1544847576).biomeWhitelist('kubejs:ore_vein_overworld_tf')
        .id("kubejs:iron_vein");
    event.recipes.createoreexcavation.drilling('minecraft:raw_iron', 'kubejs:iron_vein', 600)
        .stress(256).id("kubejs:iron_drilling");

    // ========== 金矿脉（主世界 + TF） ==========
    event.recipes.createoreexcavation.vein('{"text": "金矿脉"}', 'minecraft:raw_gold')
        .placement(128, 32, 1523235716).biomeWhitelist('kubejs:ore_vein_overworld_tf')
        .id("kubejs:gold_vein");
    event.recipes.createoreexcavation.drilling('minecraft:raw_gold', 'kubejs:gold_vein', 600)
        .stress(192).id("kubejs:gold_drilling");

    // ========== 铜矿脉（主世界 + TF） ==========
    event.recipes.createoreexcavation.vein('{"text": "铜矿脉"}', 'minecraft:raw_copper')
        .placement(128, 8, 277506605).biomeWhitelist('kubejs:ore_vein_overworld_tf')
        .id("kubejs:copper_vein");
    event.recipes.createoreexcavation.drilling('minecraft:raw_copper', 'kubejs:copper_vein', 600)
        .stress(256).id("kubejs:copper_drilling");

    // ========== 红石矿脉（主世界 + TF） ==========
    event.recipes.createoreexcavation.vein('{"text": "红石矿脉"}', 'createoreexcavation:raw_redstone')
        .placement(128, 16, 473161052).biomeWhitelist('kubejs:ore_vein_overworld_tf')
        .id("kubejs:redstone_vein");
    event.recipes.createoreexcavation.drilling('createoreexcavation:raw_redstone', 'kubejs:redstone_vein', 600)
        .stress(256).id("kubejs:redstone_drilling");

    // ========== 青金石矿脉（主世界 + TF） ==========
    event.recipes.createoreexcavation.vein('{"text": "青金石矿脉"}', 'minecraft:lapis_lazuli')
        .placement(128, 8, 551334445).biomeWhitelist('kubejs:ore_vein_overworld_tf')
        .id("kubejs:lapis_vein");
    event.recipes.createoreexcavation.drilling('minecraft:lapis_lazuli', 'kubejs:lapis_vein', 400)
        .stress(256).id("kubejs:lapis_drilling");

    // ========== 绿宝石矿脉（主世界 + TF） ==========
    event.recipes.createoreexcavation.vein('{"text": "绿宝石矿脉"}', 'createoreexcavation:raw_emerald')
        .placement(256, 64, 551829032).biomeWhitelist('kubejs:ore_vein_overworld_tf')
        .id("kubejs:emerald_vein");
    event.recipes.createoreexcavation.drilling('createoreexcavation:raw_emerald', 'kubejs:emerald_vein', 1200)
        .stress(512).id("kubejs:emerald_drilling");

    // ========== 锌矿脉（主世界 + TF） ==========
    event.recipes.createoreexcavation.vein('{"text": "锌矿脉"}', 'create:raw_zinc')
        .placement(128, 8, 1768524180).biomeWhitelist('kubejs:ore_vein_overworld_tf')
        .id("kubejs:zinc_vein");
    event.recipes.createoreexcavation.drilling('create:raw_zinc', 'kubejs:zinc_vein', 600)
        .stress(256).id("kubejs:zinc_drilling");

    // ========== 钻石矿脉（主世界 + TF） ==========
    event.recipes.createoreexcavation.vein('{"text": "钻石矿脉"}', 'createoreexcavation:raw_diamond')
        .placement(256, 64, 2078084124).biomeWhitelist('kubejs:ore_vein_overworld_tf')
        .id("kubejs:diamond_vein");
    event.recipes.createoreexcavation.drilling('createoreexcavation:raw_diamond', 'kubejs:diamond_vein', 1200)
        .stress(512).id("kubejs:diamond_drilling");

    // ========== 硬化钻石矿脉（主世界 + TF） ==========
    event.recipes.createoreexcavation.vein('{"text": "硬化钻石矿脉"}', 'createoreexcavation:raw_diamond')
        .placement(512, 128, 244884670).biomeWhitelist('kubejs:ore_vein_overworld_tf')
        .id("kubejs:hardened_diamond_vein");
    event.recipes.createoreexcavation.drilling(
        [Item.of('createoreexcavation:raw_diamond'), coeutil.processingOutput('minecraft:diamond', 0.1)],
        'kubejs:hardened_diamond_vein', 200
    ).stress(1024).drill('createoreexcavation:netherite_drill').fluid('500x minecraft:lava')
        .id("kubejs:hardened_diamond_drilling");

    // ========== 铂矿脉（主世界 + TF，自定义） ==========
    event.recipes.createoreexcavation.vein('{"text": "铂矿脉"}', 'createpropulsion:raw_platinum')
        .placement(256, 64, 2078084125).biomeWhitelist('kubejs:ore_vein_overworld_tf')
        .id("kubejs:platinum_vein");
    event.recipes.createoreexcavation.drilling(
        [Item.of('createpropulsion:raw_platinum'), coeutil.processingOutput('createpropulsion:raw_platinum', 0.1)],
        'kubejs:platinum_vein', 300
    ).stress(1024).drill('createoreexcavation:netherite_drill').fluid('500x minecraft:water')
        .id("kubejs:platinum_drilling");

    // ========== 萤石矿脉（下界 + TF） ==========
    event.recipes.createoreexcavation.vein('{"text": "萤石矿脉"}', 'minecraft:glowstone_dust')
        .placement(128, 8, 642680510).biomeWhitelist('kubejs:ore_vein_nether_tf')
        .id("kubejs:glowstone_vein");
    event.recipes.createoreexcavation.drilling('minecraft:glowstone_dust', 'kubejs:glowstone_vein', 1200)
        .stress(256).id("kubejs:glowstone_drilling");

    // ========== 金粒矿脉（下界 + TF） ==========
    event.recipes.createoreexcavation.vein('{"text": "金粒矿脉"}', 'minecraft:gold_nugget')
        .placement(256, 64, 148851665).biomeWhitelist('kubejs:ore_vein_nether_tf')
        .id("kubejs:nether_gold_vein");
    event.recipes.createoreexcavation.drilling(
        [Item.of('minecraft:gold_nugget', 3), coeutil.processingOutput('minecraft:gold_nugget', 0.5)],
        'kubejs:nether_gold_vein', 400
    ).stress(192).id("kubejs:nether_gold_drilling");

    // ========== 水源（主世界 + TF） ==========
    event.recipes.createoreexcavation.vein('{"text": "水源"}', 'minecraft:water_bucket')
        .placement(64, 8, 1195889335).biomeWhitelist('kubejs:ore_vein_overworld_tf')
        .alwaysInfinite().id("kubejs:water_vein");
    event.recipes.createoreexcavation.extracting('2Bx minecraft:water', 'kubejs:water_vein', 10)
        .id("kubejs:water_extracting");

});
