// 半成品龙头：龙头序列装配的过渡物品
// 临时复用末影龙头纹理，如需自定义请放纹理到 assets/kubejs/textures/item/incomplete_dragon_head.png
StartupEvents.registry('item', event => {
    event.create('kubejs:incomplete_dragon_head')
        .texture('minecraft:block/dragon_head')
})