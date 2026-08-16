ServerEvents.recipes(event => {
    // ========== 铜矿 ==========
    // 6 粗铜 + 1 经验颗粒 + 1 圆石，冲压，超级加热，产出 1 铜矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'minecraft:raw_copper' },
            { item: 'minecraft:raw_copper' },
            { item: 'minecraft:raw_copper' },
            { item: 'minecraft:raw_copper' },
            { item: 'minecraft:raw_copper' },
            { item: 'minecraft:raw_copper' },
            { item: 'create:experience_nugget' },
            { item: 'minecraft:cobblestone' }
        ],
        results: [
            { id: 'minecraft:copper_ore' }
        ]
    });

    // 8 粗铜 + 1 经验颗粒 + 1 深板岩，冲压，超级加热，产出 1 深层铜矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'minecraft:raw_copper' },
            { item: 'minecraft:raw_copper' },
            { item: 'minecraft:raw_copper' },
            { item: 'minecraft:raw_copper' },
            { item: 'minecraft:raw_copper' },
            { item: 'minecraft:raw_copper' },
            { item: 'minecraft:raw_copper' },
            { item: 'minecraft:raw_copper' },
            { item: 'create:experience_nugget' },
            { item: 'minecraft:deepslate' }
        ],
        results: [
            { id: 'minecraft:deepslate_copper_ore' }
        ]
    });

    // 6 粗铜 + 1 经验颗粒 + 1 黑硅岩，冲压，超级加热，产出 1 黑硅岩铜矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'minecraft:raw_copper' },
            { item: 'minecraft:raw_copper' },
            { item: 'minecraft:raw_copper' },
            { item: 'minecraft:raw_copper' },
            { item: 'minecraft:raw_copper' },
            { item: 'minecraft:raw_copper' },
            { item: 'create:experience_nugget' },
            { item: 'natures_spirit:chert' }
        ],
        results: [
            { id: 'natures_spirit:chert_copper_ore' }
        ]
    });

    // ========== 煤矿 ==========
    // 2 煤 + 1 经验颗粒 + 1 圆石，冲压，超级加热，产出 1 煤矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'minecraft:coal' },
            { item: 'minecraft:coal' },
            { item: 'create:experience_nugget' },
            { item: 'minecraft:cobblestone' }
        ],
        results: [
            { id: 'minecraft:coal_ore' }
        ]
    });

    // 3 煤 + 1 经验颗粒 + 1 深板岩，冲压，超级加热，产出 1 深层煤矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'minecraft:coal' },
            { item: 'minecraft:coal' },
            { item: 'minecraft:coal' },
            { item: 'create:experience_nugget' },
            { item: 'minecraft:deepslate' }
        ],
        results: [
            { id: 'minecraft:deepslate_coal_ore' }
        ]
    });

    // 2 煤 + 1 经验颗粒 + 1 黑硅岩，冲压，超级加热，产出 1 黑硅岩煤矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'minecraft:coal' },
            { item: 'minecraft:coal' },
            { item: 'create:experience_nugget' },
            { item: 'natures_spirit:chert' }
        ],
        results: [
            { id: 'natures_spirit:chert_coal_ore' }
        ]
    });

    // ========== 铁矿 ==========
    // 2 粗铁 + 1 经验颗粒 + 1 圆石，冲压，超级加热，产出 1 铁矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'minecraft:raw_iron' },
            { item: 'minecraft:raw_iron' },
            { item: 'create:experience_nugget' },
            { item: 'minecraft:cobblestone' }
        ],
        results: [
            { id: 'minecraft:iron_ore' }
        ]
    });

    // 3 粗铁 + 1 经验颗粒 + 1 深板岩，冲压，超级加热，产出 1 深层铁矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'minecraft:raw_iron' },
            { item: 'minecraft:raw_iron' },
            { item: 'minecraft:raw_iron' },
            { item: 'create:experience_nugget' },
            { item: 'minecraft:deepslate' }
        ],
        results: [
            { id: 'minecraft:deepslate_iron_ore' }
        ]
    });

    // 2 粗铁 + 1 经验颗粒 + 1 黑硅岩，冲压，超级加热，产出 1 黑硅岩铁矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'minecraft:raw_iron' },
            { item: 'minecraft:raw_iron' },
            { item: 'create:experience_nugget' },
            { item: 'natures_spirit:chert' }
        ],
        results: [
            { id: 'natures_spirit:chert_iron_ore' }
        ]
    });

    // ========== 金矿 ==========
    // 2 粗金 + 1 经验颗粒 + 1 圆石，冲压，超级加热，产出 1 金矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'minecraft:raw_gold' },
            { item: 'minecraft:raw_gold' },
            { item: 'create:experience_nugget' },
            { item: 'minecraft:cobblestone' }
        ],
        results: [
            { id: 'minecraft:gold_ore' }
        ]
    });

    // 3 粗金 + 1 经验颗粒 + 1 深板岩，冲压，超级加热，产出 1 深层金矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'minecraft:raw_gold' },
            { item: 'minecraft:raw_gold' },
            { item: 'minecraft:raw_gold' },
            { item: 'create:experience_nugget' },
            { item: 'minecraft:deepslate' }
        ],
        results: [
            { id: 'minecraft:deepslate_gold_ore' }
        ]
    });

    // 18 金粒 + 1 经验颗粒 + 1 下界岩，冲压，超级加热，产出 1 下界金矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'minecraft:gold_nugget' },
            { item: 'minecraft:gold_nugget' },
            { item: 'minecraft:gold_nugget' },
            { item: 'minecraft:gold_nugget' },
            { item: 'minecraft:gold_nugget' },
            { item: 'minecraft:gold_nugget' },
            { item: 'minecraft:gold_nugget' },
            { item: 'minecraft:gold_nugget' },
            { item: 'minecraft:gold_nugget' },
            { item: 'minecraft:gold_nugget' },
            { item: 'minecraft:gold_nugget' },
            { item: 'minecraft:gold_nugget' },
            { item: 'minecraft:gold_nugget' },
            { item: 'minecraft:gold_nugget' },
            { item: 'minecraft:gold_nugget' },
            { item: 'minecraft:gold_nugget' },
            { item: 'minecraft:gold_nugget' },
            { item: 'minecraft:gold_nugget' },
            { item: 'create:experience_nugget' },
            { item: 'minecraft:netherrack' }
        ],
        results: [
            { id: 'minecraft:nether_gold_ore' }
        ]
    });

    // 2 粗金 + 1 经验颗粒 + 1 黑硅岩，冲压，超级加热，产出 1 黑硅岩金矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'minecraft:raw_gold' },
            { item: 'minecraft:raw_gold' },
            { item: 'create:experience_nugget' },
            { item: 'natures_spirit:chert' }
        ],
        results: [
            { id: 'natures_spirit:chert_gold_ore' }
        ]
    });

    // ========== 红石矿 ==========
    // 7 红石 + 1 经验颗粒 + 1 圆石，冲压，超级加热，产出 1 红石矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'minecraft:redstone' },
            { item: 'minecraft:redstone' },
            { item: 'minecraft:redstone' },
            { item: 'minecraft:redstone' },
            { item: 'minecraft:redstone' },
            { item: 'minecraft:redstone' },
            { item: 'minecraft:redstone' },
            { item: 'create:experience_nugget' },
            { item: 'minecraft:cobblestone' }
        ],
        results: [
            { id: 'minecraft:redstone_ore' }
        ]
    });

    // 8 红石 + 1 经验颗粒 + 1 深板岩，冲压，超级加热，产出 1 深层红石矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'minecraft:redstone' },
            { item: 'minecraft:redstone' },
            { item: 'minecraft:redstone' },
            { item: 'minecraft:redstone' },
            { item: 'minecraft:redstone' },
            { item: 'minecraft:redstone' },
            { item: 'minecraft:redstone' },
            { item: 'minecraft:redstone' },
            { item: 'create:experience_nugget' },
            { item: 'minecraft:deepslate' }
        ],
        results: [
            { id: 'minecraft:deepslate_redstone_ore' }
        ]
    });

    // 7 红石 + 1 经验颗粒 + 1 黑硅岩，冲压，超级加热，产出 1 黑硅岩红石矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'minecraft:redstone' },
            { item: 'minecraft:redstone' },
            { item: 'minecraft:redstone' },
            { item: 'minecraft:redstone' },
            { item: 'minecraft:redstone' },
            { item: 'minecraft:redstone' },
            { item: 'minecraft:redstone' },
            { item: 'create:experience_nugget' },
            { item: 'natures_spirit:chert' }
        ],
        results: [
            { id: 'natures_spirit:chert_redstone_ore' }
        ]
    });

    // ========== 青金石矿 ==========
    // 7 青金石 + 1 经验颗粒 + 1 圆石，冲压，超级加热，产出 1 青金石矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'minecraft:lapis_lazuli' },
            { item: 'minecraft:lapis_lazuli' },
            { item: 'minecraft:lapis_lazuli' },
            { item: 'minecraft:lapis_lazuli' },
            { item: 'minecraft:lapis_lazuli' },
            { item: 'minecraft:lapis_lazuli' },
            { item: 'minecraft:lapis_lazuli' },
            { item: 'create:experience_nugget' },
            { item: 'minecraft:cobblestone' }
        ],
        results: [
            { id: 'minecraft:lapis_ore' }
        ]
    });

    // 8 青金石 + 1 经验颗粒 + 1 深板岩，冲压，超级加热，产出 1 深层青金石矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'minecraft:lapis_lazuli' },
            { item: 'minecraft:lapis_lazuli' },
            { item: 'minecraft:lapis_lazuli' },
            { item: 'minecraft:lapis_lazuli' },
            { item: 'minecraft:lapis_lazuli' },
            { item: 'minecraft:lapis_lazuli' },
            { item: 'minecraft:lapis_lazuli' },
            { item: 'minecraft:lapis_lazuli' },
            { item: 'create:experience_nugget' },
            { item: 'minecraft:deepslate' }
        ],
        results: [
            { id: 'minecraft:deepslate_lapis_ore' }
        ]
    });

    // 7 青金石 + 1 经验颗粒 + 1 黑硅岩，冲压，超级加热，产出 1 黑硅岩青金石矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'minecraft:lapis_lazuli' },
            { item: 'minecraft:lapis_lazuli' },
            { item: 'minecraft:lapis_lazuli' },
            { item: 'minecraft:lapis_lazuli' },
            { item: 'minecraft:lapis_lazuli' },
            { item: 'minecraft:lapis_lazuli' },
            { item: 'minecraft:lapis_lazuli' },
            { item: 'create:experience_nugget' },
            { item: 'natures_spirit:chert' }
        ],
        results: [
            { id: 'natures_spirit:chert_lapis_ore' }
        ]
    });

    // ========== 绿宝石矿 ==========
    // 2 绿宝石 + 1 经验颗粒 + 1 圆石，冲压，超级加热，产出 1 绿宝石矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'minecraft:emerald' },
            { item: 'minecraft:emerald' },
            { item: 'create:experience_nugget' },
            { item: 'minecraft:cobblestone' }
        ],
        results: [
            { id: 'minecraft:emerald_ore' }
        ]
    });

    // 3 绿宝石 + 1 经验颗粒 + 1 深板岩，冲压，超级加热，产出 1 深层绿宝石矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'minecraft:emerald' },
            { item: 'minecraft:emerald' },
            { item: 'minecraft:emerald' },
            { item: 'create:experience_nugget' },
            { item: 'minecraft:deepslate' }
        ],
        results: [
            { id: 'minecraft:deepslate_emerald_ore' }
        ]
    });

    // 2 绿宝石 + 1 经验颗粒 + 1 黑硅岩，冲压，超级加热，产出 1 黑硅岩绿宝石矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'minecraft:emerald' },
            { item: 'minecraft:emerald' },
            { item: 'create:experience_nugget' },
            { item: 'natures_spirit:chert' }
        ],
        results: [
            { id: 'natures_spirit:chert_emerald_ore' }
        ]
    });

    // ========== 石英矿 ==========
    // 3 下界石英 + 1 经验颗粒 + 1 下界岩，冲压，超级加热，产出 1 下界石英矿
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'minecraft:quartz' },
            { item: 'minecraft:quartz' },
            { item: 'minecraft:quartz' },
            { item: 'create:experience_nugget' },
            { item: 'minecraft:netherrack' }
        ],
        results: [
            { id: 'minecraft:nether_quartz_ore' }
        ]
    });

    // ========== 锌矿 ==========
    // 2 粗锌 + 1 经验颗粒 + 1 圆石，冲压，超级加热，产出 1 锌矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'create:raw_zinc' },
            { item: 'create:raw_zinc' },
            { item: 'create:experience_nugget' },
            { item: 'minecraft:cobblestone' }
        ],
        results: [
            { id: 'create:zinc_ore' }
        ]
    });

    // 3 粗锌 + 1 经验颗粒 + 1 深板岩，冲压，超级加热，产出 1 深层锌矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'create:raw_zinc' },
            { item: 'create:raw_zinc' },
            { item: 'create:raw_zinc' },
            { item: 'create:experience_nugget' },
            { item: 'minecraft:deepslate' }
        ],
        results: [
            { id: 'create:deepslate_zinc_ore' }
        ]
    });

    // 2 粗锌 + 1 经验颗粒 + 1 黑硅岩，冲压，超级加热，产出 1 黑硅岩锌矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'create:raw_zinc' },
            { item: 'create:raw_zinc' },
            { item: 'create:experience_nugget' },
            { item: 'natures_spirit:chert' }
        ],
        results: [
            { id: 'natures_spirit:chert_zinc_ore' }
        ]
    });

    // ========== 铂矿 ==========
    // 1 粗铂 + 1 经验颗粒 + 1 圆石，冲压，超级加热，产出 1 铂矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'createpropulsion:raw_platinum' },
            { item: 'create:experience_nugget' },
            { item: 'minecraft:cobblestone' }
        ],
        results: [
            { id: 'createpropulsion:platinum_ore' }
        ]
    });

    // 1 粗铂 + 1 经验颗粒 + 1 深板岩，冲压，超级加热，产出 1 深层铂矿石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'createpropulsion:raw_platinum' },
            { item: 'create:experience_nugget' },
            { item: 'minecraft:deepslate' }
        ],
        results: [
            { id: 'createpropulsion:deepslate_platinum_ore' }
        ]
    });
});