// 地狱皮树叶：破坏时额外掉落 1 个地狱皮树苗
BlockEvents.drops(event => {
    if (event.block.id === 'biomesoplenty:hellbark_leaves') {
        event.addItem(Item.of('biomesoplenty:hellbark_sapling'))
    }
})
//   "block.biomesoplenty.hellbark_leaves": "地狱皮树叶",
