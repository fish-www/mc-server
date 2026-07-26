ServerEvents.recipes(event => {
    // 5B 酸液 + 娜迦战利品 + 死岩，搅拌，加热，产出 1 娜迦石，酸液和娜迦战利品不消耗
    event.custom({
        type: 'create:mixing',
        heat_requirement: "heated",
        ingredients: [
            { item: 'twilightforest:naga_banner_pattern' },
            {
                type: "neoforge:single",
                "amount": 5000,
                "fluid": "powergrid:acid"
            },
            { item: 'twilightforest:deadrock' }
        ],
        results: [
            { id: 'twilightforest:naga_banner_pattern' },
            {
                "amount": 5000,
                "id": "powergrid:acid"
            },
            { id: 'twilightforest:nagastone' }
        ]
    });

    // 娜迦石，切石机配方，产娜迦石顶柱，娜迦石柱，蚀刻娜迦石
    event.stonecutting('twilightforest:etched_nagastone', 'twilightforest:nagastone')
    event.stonecutting('twilightforest:nagastone_pillar', 'twilightforest:nagastone')
    event.stonecutting('twilightforest:nagastone_head', 'twilightforest:nagastone')

    // 裂纹娜迦石，切石机配方，产裂纹娜迦石柱，裂纹蚀刻娜迦石
    event.stonecutting('twilightforest:etched_nagastone_weathered', 'twilightforest:nagastone')
    event.stonecutting('twilightforest:nagastone_pillar_weathered', 'twilightforest:nagastone')

    // 娜迦石，切石机配方，产娜迦石楼梯（左/右）
    event.stonecutting('twilightforest:nagastone_stairs_left', 'twilightforest:nagastone')
    event.stonecutting('twilightforest:nagastone_stairs_right', 'twilightforest:nagastone')

    // 裂纹娜迦石，切石机配方，产裂纹娜迦石楼梯（左/右）
    event.stonecutting('twilightforest:cracked_nagastone_stairs_left', 'twilightforest:nagastone')
    event.stonecutting('twilightforest:cracked_nagastone_stairs_right', 'twilightforest:nagastone')


    // 城堡砖染色为对应的城堡符文砖
    event.shapeless(
        Item.of('twilightforest:pink_castle_rune_brick'),
        [
            'twilightforest:castle_brick',
            'minecraft:magenta_dye'
        ]
    )
    event.shapeless(
        Item.of('twilightforest:blue_castle_rune_brick'),
        [
            'twilightforest:castle_brick',
            'minecraft:blue_dye'
        ]
    )
    event.shapeless(
        Item.of('twilightforest:violet_castle_rune_brick'),
        [
            'twilightforest:castle_brick',
            'minecraft:purple_dye'
        ]
    )
    event.shapeless(
        Item.of('twilightforest:yellow_castle_rune_brick'),
        [
            'twilightforest:castle_brick',
            'minecraft:yellow_dye'
        ]
    )

    // 头颅烛台
    event.shapeless(
        Item.of('twilightforest:creeper_skull_candle'),
        [
            'minecraft:candle',
            'minecraft:creeper_head'
        ]
    )
    event.shapeless(
        Item.of('twilightforest:piglin_skull_candle'),
        [
            'minecraft:candle',
            'minecraft:piglin_head'
        ]
    )
    event.shapeless(
        Item.of('twilightforest:player_skull_candle'),
        [
            'minecraft:candle',
            'minecraft:player_head'
        ]
    )
    event.shapeless(
        Item.of('twilightforest:skeleton_skull_candle'),
        [
            'minecraft:candle',
            'minecraft:skeleton_skull'
        ]
    )
    event.shapeless(
        Item.of('twilightforest:wither_skeleton_skull_candle'),
        [
            'minecraft:candle',
            'minecraft:wither_skeleton_skull'
        ]
    )
    event.shapeless(
        Item.of('twilightforest:zombie_skull_candle'),
        [
            'minecraft:candle',
            'minecraft:zombie_head'
        ]
    )

});