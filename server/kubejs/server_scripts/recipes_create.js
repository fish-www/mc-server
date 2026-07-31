ServerEvents.recipes(event => {
    // 6 铁粒 + 1 圆石，冲压，加热，产出 1 绯红岩
    event.custom({
        type: 'create:compacting',
        heat_requirement: "heated",
        ingredients: [
            { item: 'minecraft:iron_nugget' },
            { item: 'minecraft:iron_nugget' },
            { item: 'minecraft:iron_nugget' },
            { item: 'minecraft:iron_nugget' },
            { item: 'minecraft:iron_nugget' },
            { item: 'minecraft:iron_nugget' },
            { item: 'minecraft:cobblestone' }
        ],
        results: [
            { id: 'create:crimsite' }
        ]
    });

    // 12 铜粒 + 1 圆石，冲压，加热，产出 1 辉绿岩
    event.custom({
        type: 'create:compacting',
        heat_requirement: "heated",
        ingredients: [
            { item: 'create:copper_nugget' },
            { item: 'create:copper_nugget' },
            { item: 'create:copper_nugget' },
            { item: 'create:copper_nugget' },
            { item: 'create:copper_nugget' },
            { item: 'create:copper_nugget' },
            { item: 'create:copper_nugget' },
            { item: 'create:copper_nugget' },
            { item: 'create:copper_nugget' },
            { item: 'create:copper_nugget' },
            { item: 'create:copper_nugget' },
            { item: 'create:copper_nugget' },
            { item: 'minecraft:cobblestone' }
        ],
        results: [
            { id: 'create:veridium' }
        ]
    });

    // 6 锌粒 + 1 圆石，冲压，加热，产出 1 皓蓝石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "heated",
        ingredients: [
            { item: 'create:zinc_nugget' },
            { item: 'create:zinc_nugget' },
            { item: 'create:zinc_nugget' },
            { item: 'create:zinc_nugget' },
            { item: 'create:zinc_nugget' },
            { item: 'create:zinc_nugget' },
            { item: 'minecraft:cobblestone' }
        ],
        results: [
            { id: 'create:asurine' }
        ]
    });

    // 3 金粒 + 1 砂岩，冲压，加热，产出 1 赭金砂
    event.custom({
        type: 'create:compacting',
        heat_requirement: "heated",
        ingredients: [
            { item: 'minecraft:gold_nugget' },
            { item: 'minecraft:gold_nugget' },
            { item: 'minecraft:gold_nugget' },
            { item: 'minecraft:sandstone' }
        ],
        results: [
            { id: 'create:ochrum' }
        ]
    });

    // 1 石头 + 1 橙沙，冲压，超级加热，产出 2 黑硅岩
    event.custom({
        type: 'create:compacting',
        heat_requirement: "superheated",
        ingredients: [
            { item: 'minecraft:stone' },
            { item: 'biomesoplenty:orange_sand' }
        ],
        results: [
            { id: 'natures_spirit:chert' }
        ]
    });

    // 燧石，粉碎，产出 1 火药，75% 
    event.custom({
        type: 'create:crushing',
        ingredients: [
            { item: 'minecraft:flint' }
        ],
        processing_time: 400,
        results: [
            {
                chance: 0.75,
                id: 'minecraft:gunpowder'
            }
        ]
    });

    // 燧石，研磨，产出 1 火药
    event.custom({
        type: 'create:crushing',
        ingredients: [
            { item: 'minecraft:flint' }
        ],
        processing_time: 125,
        results: [
            { id: 'minecraft:gunpowder' }
        ]
    });

    // 皮革配方：3 腐肉 + 500mb 水 + 1 树皮，搅拌，加热，产出 1 皮革
    event.custom({
        type: 'create:mixing',
        heat_requirement: "heated",
        ingredients: [
            { item: 'minecraft:rotten_flesh' },
            {
                "type": "neoforge:single",
                "amount": 500,
                "fluid": "minecraft:water"
            },
            { item: 'farmersdelight:tree_bark' }
        ],
        results: [
            { id: 'minecraft:leather' }
        ]
    });

    // 肉块，粉碎，75% 产出 1 腐肉
    event.custom({
        type: 'create:crushing',
        ingredients: [
            { item: 'biomesoplenty:flesh' }
        ],
        processing_time: 400,
        results: [
            {
                chance: 0.75,
                id: 'minecraft:rotten_flesh'
            }
        ]
    });

    // 肉块 2，4，6，8 位置配方合成 1 多孔肉块
    event.shaped(
        Item.of('biomesoplenty:porous_flesh', 2),
        [
            ' A ',
            'A A',
            ' A '
        ],
        {
            A: 'biomesoplenty:flesh'
        }
    )

    // 烈焰珍珠，粉碎，产出 3 烈焰粉，25% 额外产一个
    event.custom({
        type: 'create:crushing',
        ingredients: [
            { item: 'kaleidoscope_nether:blaze_heart' }
        ],
        processing_time: 400,
        results: [
            {
                count: 3,
                id: 'minecraft:blaze_powder'
            },
            {
                chance: 0.25,
                id: 'minecraft:blaze_powder'
            }
        ]
    });

    // 烈焰珍珠，研磨，产出 4 烈焰粉
    event.custom({
        type: 'create:milling',
        ingredients: [
            { item: 'kaleidoscope_nether:blaze_heart' }
        ],
        processing_time: 125,
        results: [
            {
                count: 4,
                id: 'minecraft:blaze_powder'
            }
        ]
    });

    // 陶瓦，粉碎，产出 1 对应颜色的沙子（目前只有白沙、红沙、橙沙）
    event.custom({
        type: 'create:crushing',
        ingredients: [
            { item: 'minecraft:white_terracotta' }
        ],
        processing_time: 400,
        results: [
            {
                count: 1,
                id: 'minecraft:sand'
            }
        ]
    });
    event.custom({
        type: 'create:crushing',
        ingredients: [
            { item: 'minecraft:red_terracotta' }
        ],
        processing_time: 400,
        results: [
            {
                count: 1,
                id: 'minecraft:red_sand'
            }
        ]
    });
    event.custom({
        type: 'create:crushing',
        ingredients: [
            { item: 'minecraft:orange_terracotta' }
        ],
        processing_time: 400,
        results: [
            {
                count: 1,
                id: 'biomesoplenty:orange_sand'
            }
        ]
    });

    // 创造模式便携储罐：大型便携流体储罐，大型便携燃油储罐，铜含水树叶箱，无限流体储罐，流体舱口，铁桶
    event.shapeless(
        Item.of('create_sa:creative_filling_tank'),
        [
            'create_sa:large_filling_tank',
            'create_sa:large_fueling_tank',
            'fluidlogistics:water_containing_copper_casing',
            'fluidlogistics:infinite_fluid_tank',
            'fluidlogistics:fluid_hatch',
            'minecraft:bucket'
        ]
    );

    // 烈焰人燃烧室，粉碎，产出 1 烈焰棒，3 烈焰粉，75% 额外一个烈焰粉，25% 额外一个烈焰粉，5% 一个铁板，5% 一个余烬面粉
    event.custom({
        type: 'create:crushing',
        ingredients: [
            { item: 'create:blaze_burner' }
        ],
        processing_time: 400,
        results: [
            {
                id: 'minecraft:blaze_rod'
            },
            {
                count: 3,
                id: 'minecraft:blaze_powder'
            },
            {
                chance: 0.75,
                id: 'minecraft:blaze_powder'
            },
            {
                chance: 0.25,
                id: 'minecraft:blaze_powder'
            },
            {
                chance: 0.05,
                id: 'create:iron_sheet'
            },
            {
                chance: 0.05,
                id: 'create:cinder_flour'
            },
        ]
    });

    // 旋风人冷却室，粉碎，产出 1 旋风棒，3 风弹，75% 额外一个风弹，25% 额外一个风弹，5% 一个铁板，5% 一个锌粒
    event.custom({
        type: 'create:crushing',
        ingredients: [
            { item: 'createcraftedbeginning:breeze_cooler' }
        ],
        processing_time: 400,
        results: [
            {
                id: 'minecraft:breeze_rod'
            },
            {
                count: 3,
                id: 'minecraft:wind_charge'
            },
            {
                chance: 0.75,
                id: 'minecraft:wind_charge'
            },
            {
                chance: 0.25,
                id: 'minecraft:wind_charge'
            },
            {
                chance: 0.05,
                id: 'create:iron_sheet'
            },
            {
                chance: 0.05,
                id: 'create:zinc_nugget'
            },
        ]
    });

    // 旋风人蓄风室，粉碎，产出 1 旋风棒，3 风弹，75% 额外一个风弹，25% 额外一个风弹，10% 一个铁板，5% 一个锌粒
    event.custom({
        type: 'create:crushing',
        ingredients: [
            { item: 'createcraftedbeginning:breeze_chamber' }
        ],
        processing_time: 400,
        results: [
            {
                id: 'minecraft:breeze_rod'
            },
            {
                count: 3,
                id: 'minecraft:wind_charge'
            },
            {
                chance: 0.75,
                id: 'minecraft:wind_charge'
            },
            {
                chance: 0.25,
                id: 'minecraft:wind_charge'
            },
            {
                chance: 0.10,
                id: 'create:iron_sheet'
            },
            {
                chance: 0.05,
                id: 'create:zinc_nugget'
            },
        ]
    });

    // 1B 岩浆 + 10B 水，冲压，产出 64 个圆石
    event.custom({
        type: 'create:compacting',
        ingredients: [
            {
                type: "neoforge:single",
                "amount": 1000,
                "fluid": "minecraft:lava"
            },
            {
                type: "neoforge:single",
                "amount": 10000,
                "fluid": "minecraft:water"
            }
        ],
        results: [
            {
                count: 64,
                id: 'minecraft:cobblestone'
            }
        ]
    });

    // 修复气密板配方冲突
    event.remove({ output: 'createcraftedbeginning:airtight_sheet' })
    event.custom({
        type: 'create:sequenced_assembly',
        ingredient: {
            tag: "c:plates/iron"
        },
        loops: 1,
        results: [
            {
                count: 2,
                id: 'createcraftedbeginning:airtight_sheet'
            }
        ],
        sequence: [
            {
                type: "create:deploying",
                ingredients: [
                    {
                        item: "createcraftedbeginning:incomplete_airtight_sheet"
                    },
                    {
                        tag: "c:slimeballs"
                    }
                ],
                results: [
                    {
                        id: "createcraftedbeginning:incomplete_airtight_sheet"
                    }
                ]
            },
            {
                type: "create:deploying",
                ingredients: [
                    {
                        item: "createcraftedbeginning:incomplete_airtight_sheet"
                    },
                    {
                        tag: "c:plates/iron"
                    }
                ],
                results: [
                    {
                        id: "createcraftedbeginning:incomplete_airtight_sheet"
                    }
                ]
            },
            {
                type: "create:deploying",
                ingredients: [
                    {
                        item: "createcraftedbeginning:incomplete_airtight_sheet"
                    },
                    {
                        tag: "c:dusts/crying_obsidian"
                    }
                ],
                results: [
                    {
                        id: "createcraftedbeginning:incomplete_airtight_sheet"
                    }
                ]
            },
            {
                type: "create:deploying",
                ingredients: [
                    {
                        item: "createcraftedbeginning:incomplete_airtight_sheet"
                    },
                    {
                        item: "minecraft:dried_kelp"
                    }
                ],
                results: [
                    {
                        id: "createcraftedbeginning:incomplete_airtight_sheet"
                    }
                ]
            },
            {
                type: "create:pressing",
                ingredients: [
                    {
                        item: "createcraftedbeginning:incomplete_airtight_sheet"
                    }
                ],
                results: [
                    {
                        id: "createcraftedbeginning:incomplete_airtight_sheet"
                    }
                ]
            },
        ],
        transitional_item: {
            id: "createcraftedbeginning:incomplete_airtight_sheet"
        }
    });
    event.custom({
        type: 'create:sequenced_assembly',
        ingredient: { tag: "c:plates/iron" },
        loops: 1,
        results: [
            {
                count: 2,
                id: 'createcraftedbeginning:airtight_sheet'
            }
        ],
        sequence: [
            {
                type: "create:deploying",
                ingredients: [
                    {
                        item: "createcraftedbeginning:incomplete_airtight_sheet"
                    },
                    {
                        item: "create:super_glue"
                    }
                ],
                results: [
                    {
                        id: "createcraftedbeginning:incomplete_airtight_sheet"
                    }
                ]
            },
            {
                type: "create:deploying",
                ingredients: [
                    {
                        item: "createcraftedbeginning:incomplete_airtight_sheet"
                    },
                    {
                        tag: "c:plates/iron"
                    }
                ],
                results: [
                    {
                        id: "createcraftedbeginning:incomplete_airtight_sheet"
                    }
                ]
            },
            {
                type: "create:deploying",
                ingredients: [
                    {
                        item: "createcraftedbeginning:incomplete_airtight_sheet"
                    },
                    {
                        tag: "c:dusts/crying_obsidian"
                    }
                ],
                results: [
                    {
                        id: "createcraftedbeginning:incomplete_airtight_sheet"
                    }
                ]
            },
            {
                type: "create:deploying",
                ingredients: [
                    {
                        item: "createcraftedbeginning:incomplete_airtight_sheet"
                    },
                    {
                        item: "minecraft:dried_kelp"
                    }
                ],
                results: [
                    {
                        id: "createcraftedbeginning:incomplete_airtight_sheet"
                    }
                ]
            },
            {
                type: "create:pressing",
                ingredients: [
                    {
                        item: "createcraftedbeginning:incomplete_airtight_sheet"
                    }
                ],
                results: [
                    {
                        id: "createcraftedbeginning:incomplete_airtight_sheet"
                    }
                ]
            },
        ],
        transitional_item: {
            id: "createcraftedbeginning:incomplete_airtight_sheet"
        }
    });

});