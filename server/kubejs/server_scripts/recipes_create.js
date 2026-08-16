// 将原版生肉加入 forge:raw_meats 标签
ServerEvents.tags('item', event => {
    event.add('forge:raw_meats', [
        'minecraft:beef',
        'minecraft:porkchop',
        'minecraft:chicken',
        'minecraft:mutton',
        'minecraft:rabbit'
    ]);
});

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

    // 多孔肉块，粉碎，产出 1 腐肉，25% 1 腐肉
    event.custom({
        type: 'create:crushing',
        ingredients: [
            { item: 'biomesoplenty:porous_flesh' }
        ],
        processing_time: 400,
        results: [
            {
                count: 1,
                id: 'minecraft:rotten_flesh'
            },
            {
                chance: 0.25,
                id: 'minecraft:rotten_flesh'
            }
        ]
    });


    // 肉块 2，4，6，8 位置配方合成 2 多孔肉块
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

    // 4 多孔肉块，合成 4 肉块
    event.shaped(
        Item.of('biomesoplenty:flesh', 4),
        [
            'AA ',
            'AA ',
            '   '
        ],
        {
            A: 'biomesoplenty:porous_flesh'
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

    // 肉冲压出鲜血
    event.custom({
        type: 'create:compacting',
        ingredients: [
            {
                tag: "forge:raw_meats"
            }, {
                tag: "forge:raw_meats"
            }, {
                tag: "forge:raw_meats"
            }, {
                tag: "forge:raw_meats"
            }, {
                tag: "forge:raw_meats"
            }, {
                tag: "forge:raw_meats"
            }, {
                tag: "forge:raw_meats"
            }, {
                tag: "forge:raw_meats"
            }, {
                tag: "forge:raw_meats"
            }, {
                tag: "forge:raw_meats"
            }, {
                tag: "forge:raw_meats"
            }, {
                tag: "forge:raw_meats"
            }, {
                tag: "forge:raw_meats"
            }, {
                tag: "forge:raw_meats"
            }, {
                tag: "forge:raw_meats"
            }, {
                tag: "forge:raw_meats"
            }, {
                tag: "forge:raw_meats"
            }, {
                tag: "forge:raw_meats"
            }, {
                tag: "forge:raw_meats"
            }, {
                tag: "forge:raw_meats"
            },
        ],
        results: [
            {
                amount: 1000,
                id: "kaleidoscope_bloodwine:blood"
            }
        ]
    });

    // 方解石，缠魂，产出白垩岩
    event.custom({
        type: 'create:haunting',
        ingredients: [
            { item: 'minecraft:calcite' }
        ],
        results: [
            {
                id: 'natures_spirit:white_chalk'
            }
        ]
    });

    // 白垩岩，粉碎，产出 3 白垩岩粉 + 25% 1 白垩岩粉
    event.custom({
        type: 'create:crushing',
        ingredients: [
            { item: 'natures_spirit:white_chalk' }
        ],
        processing_time: 400,
        results: [
            {
                count: 3,
                id: 'natures_spirit:chalk_powder'
            },
            {
                chance: 0.25,
                id: 'natures_spirit:chalk_powder'
            }
        ]
    });

    // 1 烈焰粉 + 1B 岩浆，搅拌，产出 1B 硫磺火
    event.custom({
        type: 'create:mixing',
        ingredients: [
            {
                "item": "minecraft:blaze_powder"
            },
            {
                type: "neoforge:single",
                "amount": 1000,
                "fluid": "minecraft:lava"
            }
        ],
        results: [
            {
                "amount": 1000,
                "id": "createcraftedbeginning:brimstone"
            }
        ]
    });

    // 文文的相机，缠魂，产出魂符
    event.custom({
        type: 'create:haunting',
        ingredients: [
            { item: 'touhou_little_maid:camera' }
        ],
        results: [
            {
                id: 'touhou_little_maid:smart_slab_empty'
            }
        ]
    });

    // 肉块/多孔肉块，冲压，产出血
    event.custom({
        type: 'create:compacting',
        ingredients: [
            {
                item: "biomesoplenty:flesh"
            },
            {
                item: "biomesoplenty:flesh"
            },
            {
                item: "biomesoplenty:flesh"
            },
            {
                item: "biomesoplenty:flesh"
            },
        ],
        results: [
            {
                amount: 500,
                id: "biomesoplenty:blood"
            }
        ]
    });
    event.custom({
        type: 'create:compacting',
        ingredients: [
            {
                item: "biomesoplenty:porous_flesh"
            },
            {
                item: "biomesoplenty:porous_flesh"
            },
            {
                item: "biomesoplenty:porous_flesh"
            },
            {
                item: "biomesoplenty:porous_flesh"
            },
        ],
        results: [
            {
                amount: 250,
                id: "biomesoplenty:blood"
            }
        ]
    });

    // 3 岩浆块 + 250mb 酸液，冲压，加热，产出 4 硫磺石
    event.custom({
        type: 'create:compacting',
        heat_requirement: "heated",
        ingredients: [
            { item: 'minecraft:magma_block' },
            { item: 'minecraft:magma_block' },
            { item: 'minecraft:magma_block' },
            {
                type: "neoforge:single",
                "amount": 250,
                "fluid": "powergrid:acid"
            },
        ],
        results: [
            {
                count: 4,
                id: 'biomesoplenty:orpiment'
            }
        ]
    });

    // 8x 紫颂锭 + 物理手杖，有序合成，创造模式物理手杖
    event.shaped(
        Item.of('simulated:creative_physics_staff', 1),
        [
            'AAA',
            'ABA',
            'AAA'
        ],
        {
            A: 'createcasing:chorium_ingot',
            B: 'gravitation:physics_staff'
        }
    )

    // 凋零骷髅头 + 白色染料 => 普通骷髅头颅
    event.shapeless(
        Item.of('minecraft:skeleton_skull'),
        [
            'minecraft:wither_skeleton_skull',
            'minecraft:white_dye'
        ]
    );

    // 普通骷髅头颅，序列装配：切割 -> 装龙肉 -> 注入龙血 -> 装龙牙x2 -> 装龙齿x4，产出 1 龙头
    // 过渡物品为 kubejs:incomplete_dragon_head（见 startup_scripts/dragon_head.js）
    // 机械手安装步骤生成器（龙牙/龙齿/龙肉各需多次部署）
    const deployDragonStep = itemId => ({
        type: "create:deploying",
        ingredients: [
            { item: "kubejs:incomplete_dragon_head" },
            { item: itemId }
        ],
        results: [
            { id: "kubejs:incomplete_dragon_head" }
        ]
    });
    // 注意：Rhino 不支持数组展开语法（...），这里用 push 拼接
    const dragonSteps = [];
    dragonSteps.push(deployDragonStep('kaleidoscope_end:raw_ender_dragon_meat'));
    dragonSteps.push({
        type: "create:filling",
        ingredients: [
            { item: "kubejs:incomplete_dragon_head" },
            {
                "type": "neoforge:single",
                "amount": 250,
                "fluid": "kaleidoscope_dim_wine:dragon_blood"
            }
        ],
        results: [
            { id: "kubejs:incomplete_dragon_head" }
        ]
    });
    for (let i = 0; i < 2; i++) dragonSteps.push(deployDragonStep('kaleidoscope_end:dragon_tooth'));
    for (let i = 0; i < 4; i++) dragonSteps.push(deployDragonStep('ends_delight:dragon_tooth'));
    event.custom({
        type: 'create:sequenced_assembly',
        ingredient: {
            item: 'minecraft:skeleton_skull'
        },
        loops: 1,
        results: [
            {
                id: 'minecraft:dragon_head'
            }
        ],
        sequence: [
            {
                type: "create:cutting",
                ingredients: [
                    { item: "kubejs:incomplete_dragon_head" }
                ],
                results: [
                    { id: "kubejs:incomplete_dragon_head" }
                ]
            }
        ].concat(dragonSteps),
        transitional_item: {
            id: "kubejs:incomplete_dragon_head"
        }
    });

    // 5x 生末影龙肉，冲压，产出 1000mb 龙血
    event.custom({
        type: 'create:compacting',
        ingredients: [
            { item: 'kaleidoscope_end:raw_ender_dragon_meat' },
            { item: 'kaleidoscope_end:raw_ender_dragon_meat' },
            { item: 'kaleidoscope_end:raw_ender_dragon_meat' },
            { item: 'kaleidoscope_end:raw_ender_dragon_meat' },
            { item: 'kaleidoscope_end:raw_ender_dragon_meat' },
        ],
        results: [
            {
                amount: 1000,
                id: "kaleidoscope_dim_wine:dragon_blood"
            }
        ]
    });

    // ===== 不详之瓶升级：基础不详之瓶 + 绿宝石 无序合成（1 绿宝石 = 升 1 级）=====
    // 一级 = 原版 minecraft:ominous_bottle（amplifier 0，微光自带配方/试炼密容产出）
    // 二级~五级 = amplifier 1~4 的同一物品（1.21.1 原版合成配方 result 支持 components）
    // 注意：1.21.1 配方无法按数据组件匹配输入，故每条配方的瓶输入不做等级区分，
    // 建议从一级瓶开始合成；绿宝石数量决定目标等级（基础瓶 + N 绿宝石 = N+1 级）
    // 注意：Rhino 不支持循环体内声明 const/let（会报 redeclaration），数组须声明在循环外
    let emeraldIngredients = [];
    for (let level = 1; level <= 4; level++) {
        emeraldIngredients = [];
        for (let i = 0; i < level; i++) {
            emeraldIngredients.push({ item: 'minecraft:emerald' });
        }
        event.custom({
            type: 'minecraft:crafting_shapeless',
            category: 'misc',
            ingredients: [
                { item: 'minecraft:ominous_bottle' }
            ].concat(emeraldIngredients),
            result: {
                id: 'minecraft:ominous_bottle',
                components: {
                    'minecraft:ominous_bottle_amplifier': level
                }
            }
        });
    }

    // 岩浆块，粉碎，产出 1 岩浆膏，75% 额外产出 1 岩浆膏
    event.custom({
        type: 'create:crushing',
        ingredients: [
            { item: 'minecraft:magma_block' }
        ],
        processing_time: 400,
        results: [
            {
                id: 'minecraft:magma_cream'
            },
            {
                chance: 0.75,
                id: 'minecraft:magma_cream'
            }
        ]
    });

    // 1b 融雪，搅拌，超级燃烧，产出 8 薄云
    event.custom({
        type: 'create:mixing',
        heat_requirement: "superheated",
        ingredients: [
            {
                type: "neoforge:single",
                "amount": 1000,
                "fluid": "createcraftedbeginning:slush"
            }
        ],
        results: [
            {
                count: 8,
                id: 'twilightforest:wispy_cloud'
            }
        ]
    });

    // 薄云，批量冶炼（高炉/风扇批量冶炼），产出 1 浮云
    event.custom({
        type: 'minecraft:blasting',
        category: 'blocks',
        cookingtime: 100,
        experience: 0.1,
        ingredient: {
            item: 'twilightforest:wispy_cloud'
        },
        result: {
            id: 'twilightforest:fluffy_cloud'
        }
    });

    // 8 浮云 + 1b 水/融雪，搅拌，产出 雨云/雪云
    const cloudMixingIngredients = fluidId => {
        const ingredients = [
            { type: "neoforge:single", "amount": 1000, "fluid": fluidId }
        ];
        for (let i = 0; i < 8; i++) {
            ingredients.push({ item: 'twilightforest:fluffy_cloud' });
        }
        return ingredients;
    };
    event.custom({
        type: 'create:mixing',
        ingredients: cloudMixingIngredients('minecraft:water'),
        results: [
            {
                id: 'twilightforest:rainy_cloud'
            }
        ]
    });
    event.custom({
        type: 'create:mixing',
        ingredients: cloudMixingIngredients('createcraftedbeginning:slush'),
        results: [
            {
                id: 'twilightforest:snowy_cloud'
            }
        ]
    });

});