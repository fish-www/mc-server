ServerEvents.recipes(event => {
    // 附魔金苹果
    event.shaped(
        Item.of('minecraft:enchanted_golden_apple', 1),
        [
            'BBB',
            'BAB',
            'BBB'
        ],
        {
            A: 'minecraft:apple',
            B: 'minecraft:gold_block'
        }
    )
});